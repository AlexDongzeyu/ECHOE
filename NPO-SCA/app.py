import eventlet
eventlet.monkey_patch()
from flask import Flask, render_template, redirect, url_for, flash, request, jsonify, abort, send_from_directory, session, make_response
from sqlalchemy import inspect, text
from flask_login import LoginManager, login_user, logout_user, current_user, login_required
from urllib.parse import urlparse
import os
from datetime import datetime
import json
import uuid
import requests
import httpx
from flask_cors import CORS
import sqlite3
import logging
import sys
import traceback
import time
from flask_socketio import SocketIO, emit
import random
from flask_migrate import Migrate
import xml.etree.ElementTree as ET

from config import Config
from models import db, User, Letter, Response, PhysicalMailbox, Post, Event, UserRole
from forms import LetterForm, ResponseForm, LoginForm, RegistrationForm, PhysicalLetterForm
from middlewares import LanguageMiddleware
from init_db import init_db
from cli_commands import register_commands
from admin_decorators import admin_required, ultimate_admin_required, volunteer_required

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

try:
    app = Flask(__name__, 
                static_folder='static',
                template_folder='templates')
    logger.info("Flask app created")
    
    app.config.from_object(Config)
    app.config['DEBUG'] = True  # 启用调试模式
    logger.info("Config loaded")
    
    app.config['BABEL_DEFAULT_LOCALE'] = 'en_CA'  # Set Canadian English as default
    app.config['TEMPLATES_AUTO_RELOAD'] = True    # Ensure templates are not cached
    CORS(app)
    logger.info("CORS initialized")

    # Apply middleware
    app.wsgi_app = LanguageMiddleware(app.wsgi_app)
    logger.info("Middleware applied")

    socketio = SocketIO(app, async_mode='eventlet')

    # Define anonymous names for chat
    ANONYMOUS_NAMES = ["QuietFox", "CalmRiver", "SilentWolf", "GentleBear", "PeacefulEagle"]

    # Initialize database
    logger.info("Initializing database...")
    db.init_app(app)
    migrate = Migrate(app, db)
    
    @app.context_processor
    def inject_nav_counts():
        try:
            flagged_cnt = Letter.query.filter_by(is_flagged=True).count()
            unprocessed_cnt = Letter.query.filter(
                (Letter.is_processed == False) & ((Letter.is_flagged == False) | (Letter.is_flagged.is_(None)))
            ).count()
        except Exception:
            flagged_cnt = 0
            unprocessed_cnt = 0
        return dict(flagged_count=flagged_cnt, unprocessed_count=unprocessed_cnt)
    
    # Ensure instance folder exists and create database tables
    def _ensure_anon_inbox_schema():
        """Ensure 'anon_user_id' and 'has_unread' columns and index exist on 'letter'.
        Safe to call multiple times; uses SQLite-compatible statements.
        """
        try:
            inspector = inspect(db.engine)
            cols = [c['name'] for c in inspector.get_columns('letter')]
            if 'anon_user_id' not in cols:
                db.session.execute(text("ALTER TABLE letter ADD COLUMN anon_user_id VARCHAR(64)"))
            if 'has_unread' not in cols:
                db.session.execute(text("ALTER TABLE letter ADD COLUMN has_unread BOOLEAN DEFAULT 0"))
            if 'title' not in cols:
                db.session.execute(text("ALTER TABLE letter ADD COLUMN title VARCHAR(140)"))
            # Index for faster inbox lookups (SQLite supports IF NOT EXISTS for CREATE INDEX)
            db.session.execute(text("CREATE INDEX IF NOT EXISTS idx_letter_anon_user_id ON letter(anon_user_id)"))
            # Moderation metadata (best-effort, safe to run repeatedly)
            if 'moderation_reason' not in cols:
                db.session.execute(text("ALTER TABLE letter ADD COLUMN moderation_reason TEXT"))
            if 'moderation_checked' not in cols:
                db.session.execute(text("ALTER TABLE letter ADD COLUMN moderation_checked BOOLEAN DEFAULT 0"))
            db.session.commit()
            logger.info("Anonymous inbox schema ensured")
        except Exception as mig_e:
            logger.warning(f"Anonymous inbox schema check/apply failed or already applied: {mig_e}")

    with app.app_context():
        try:
            logger.info("Creating instance folder...")
            os.makedirs(os.path.dirname(app.config['SQLALCHEMY_DATABASE_URI'].replace('sqlite:///', '')), exist_ok=True)
            logger.info("Creating database tables...")
            db.create_all()
            logger.info("Database tables created successfully!")
            
            # Initialize initial data
            init_db(app)
            logger.info("Initial data created successfully!")
            # Ensure anon inbox schema
            _ensure_anon_inbox_schema()
        except Exception as e:
            logger.error(f"Error during database initialization: {str(e)}")
            logger.error(traceback.format_exc())
            raise

    # Flask 3.x removed before_first_request; schema ensured at startup above.

    # Initialize login manager
    logger.info("Initializing login manager...")
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'login'
    login_manager.login_message = 'Please log in'
    login_manager.login_message_category = 'info'
    
    # Register CLI commands
    register_commands(app)

    # ---------------- Instagram Feed (Basic Display API) -----------------
    _ig_cache = { 'ts': 0, 'data': [] }

    @app.route('/api/instagram-feed')
    def instagram_feed():
        try:
            access_token = os.environ.get('INSTAGRAM_ACCESS_TOKEN') or app.config.get('INSTAGRAM_ACCESS_TOKEN')
            if not access_token:
                return jsonify({ 'items': [], 'error': 'INSTAGRAM_ACCESS_TOKEN not set' }), 200

            # cache for 10 minutes
            now = time.time()
            if _ig_cache['data'] and now - _ig_cache['ts'] < 600:
                return jsonify({ 'items': _ig_cache['data'] })

            fields = 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp'
            url = f'https://graph.instagram.com/me/media?fields={fields}&access_token={access_token}&limit=25'

            collected = []
            seen_ids = set()
            max_items = 60  # cap to keep response light

            with httpx.Client(timeout=10) as client:
                while url and len(collected) < max_items:
                    r = client.get(url)
                    payload = r.json()
                    page_items = payload.get('data', []) if isinstance(payload, dict) else []
                    for it in page_items:
                        iid = it.get('id')
                        if not iid or iid in seen_ids:
                            continue
                        seen_ids.add(iid)
                        collected.append(it)
                        if len(collected) >= max_items:
                            break
                    # follow paging if available
                    url = None
                    try:
                        paging = payload.get('paging', {}) if isinstance(payload, dict) else {}
                        next_url = paging.get('next')
                        if next_url:
                            url = next_url
                    except Exception:
                        url = None

            # Sort by timestamp (newest first)
            collected.sort(key=lambda x: x.get('timestamp', ''), reverse=True)

            # Normalize
            normalized = []
            for it in collected:
                normalized.append({
                    'id': it.get('id'),
                    'caption': it.get('caption'),
                    'type': it.get('media_type'),
                    'url': it.get('media_url'),
                    'thumb': it.get('thumbnail_url') or it.get('media_url'),
                    'permalink': it.get('permalink'),
                    'timestamp': it.get('timestamp')
                })

            _ig_cache['data'] = normalized
            _ig_cache['ts'] = now
            return jsonify({ 'items': normalized })
        except Exception as e:
            app.logger.error(f"Instagram feed error: {e}")
            return jsonify({ 'items': [] }), 200

    # ---------------- YouTube latest via RSS (uploads feed) -----------------
    _yt_cache = { 'ts': 0, 'item': None }

    @app.route('/api/youtube-latest')
    def youtube_latest():
        try:
            # Allow config via env: YOUTUBE_HANDLE or YOUTUBE_CHANNEL_ID
            yt_handle = os.environ.get('YOUTUBE_HANDLE') or app.config.get('YOUTUBE_HANDLE') or 'echoe_hosa'
            yt_channel_id = os.environ.get('YOUTUBE_CHANNEL_ID') or app.config.get('YOUTUBE_CHANNEL_ID')

            now = time.time()
            if _yt_cache['item'] and now - _yt_cache['ts'] < 600:
                return jsonify(_yt_cache['item'])

            if yt_channel_id:
                rss_url = f'https://www.youtube.com/feeds/videos.xml?channel_id={yt_channel_id}'
            else:
                # Handle uploads feed by user name/handle
                rss_url = f'https://www.youtube.com/feeds/videos.xml?user={yt_handle}'

            with httpx.Client(timeout=10) as client:
                r = client.get(rss_url)
                rss_text = r.text

            # Parse RSS (Atom)
            # Namespaces for YouTube Atom feeds
            ns = {
                'atom': 'http://www.w3.org/2005/Atom',
                'media': 'http://search.yahoo.com/mrss/'
            }
            root = ET.fromstring(rss_text)
            entry = root.find('atom:entry', ns)
            if entry is None:
                return jsonify({'error': 'No entries'}), 200

            vid_id_el = entry.find('yt:videoId', {
                'yt': 'http://www.youtube.com/xml/schemas/2015',
                'atom': ns['atom'],
                'media': ns['media']
            })
            link_el = entry.find('atom:link', ns)
            title_el = entry.find('atom:title', ns)
            published_el = entry.find('atom:published', ns)
            thumb_el = entry.find('media:group/media:thumbnail', ns)

            video_id = vid_id_el.text if vid_id_el is not None else None
            link = link_el.get('href') if link_el is not None else (f'https://www.youtube.com/watch?v={video_id}' if video_id else None)
            title = title_el.text if title_el is not None else ''
            published = published_el.text if published_el is not None else ''
            thumb = thumb_el.get('url') if thumb_el is not None else None

            item = {
                'video_id': video_id,
                'url': link,
                'title': title,
                'published': published,
                'thumb': thumb,
                'embed_url': f'https://www.youtube.com/embed/{video_id}' if video_id else None
            }

            _yt_cache['item'] = item
            _yt_cache['ts'] = now
            return jsonify(item)
        except Exception as e:
            app.logger.error(f"YouTube latest error: {e}")
            return jsonify({'error': 'failed'}), 200
    
    @login_manager.user_loader
    def load_user(user_id):
        logger.info(f"Loading user with ID: {user_id}")
        try:
            user = User.query.get(int(user_id))
            if user:
                # Debug info
                logger.info(f"Loaded user: {user.username}, type: {type(user)}")
                logger.info(f"Has has_admin_access method: {hasattr(user, 'has_admin_access')}")
                
                if not hasattr(user, 'has_admin_access'):
                    # Force refresh and try to recreate the object
                    logger.warning("User object missing methods, attempting to fix...")
                    db.session.refresh(user)
                    db.session.expunge(user)
                    user = User.query.get(int(user_id))
                    logger.info(f"After refresh - Has has_admin_access method: {hasattr(user, 'has_admin_access')}")
            return user
        except Exception as e:
            logger.error(f"Error loading user {user_id}: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return None

    # Helper: get latest Instagram post (server-side, cached)
    def get_latest_instagram_post():
        try:
            access_token = os.environ.get('INSTAGRAM_ACCESS_TOKEN') or app.config.get('INSTAGRAM_ACCESS_TOKEN')
            now = time.time()
            # Use cache when warm
            if _ig_cache['data'] and now - _ig_cache['ts'] < 600:
                return _ig_cache['data'][0] if _ig_cache['data'] else None

            if not access_token:
                return None

            fields = 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp'
            url = f'https://graph.instagram.com/me/media?fields={fields}&access_token={access_token}&limit=1'
            with httpx.Client(timeout=10) as client:
                r = client.get(url)
                payload = r.json()
            items = payload.get('data', []) if isinstance(payload, dict) else []
            if not items:
                return None

            it = items[0]
            latest = {
                'id': it.get('id'),
                'caption': it.get('caption'),
                'type': it.get('media_type'),
                'url': it.get('media_url'),
                'thumb': it.get('thumbnail_url') or it.get('media_url'),
                'permalink': it.get('permalink'),
                'timestamp': it.get('timestamp'),
            }
            return latest
        except Exception as e:
            app.logger.error(f"get_latest_instagram_post error: {e}")
            return None

    # Route: Home page
    @app.route('/')
    def index():
        latest_ig = get_latest_instagram_post()
        return render_template('index.html', latest_ig=latest_ig)

    # Route: Static files
    @app.route('/<path:filename>')
    def serve_static(filename):
        if filename.endswith('.html') and not filename.startswith('templates/'):
            return render_template(filename)
        return send_from_directory(app.static_folder, filename)

    # Heuristic fallback for coach tips when the AI model/key is unavailable
    def _heuristic_coach_suggestions(content: str, mode: str) -> tuple[list, str]:
        text = (content or '').strip()
        if not text:
            return [
                "It's okay to be brief — start with one thought.",
                "Share feelings, not just events.",
                "Write as if to a caring friend — no need to be perfect."
            ], "What feels most important to share right now?"

        # Analyze the entire content for better suggestions
        lower = text.lower()
        sentences = [s.strip() for s in text.split('.') if s.strip()][:3]  # First 3 sentences
        words = [w for w in text.split() if w.isalpha()][:8]  # More words for analysis
        key_phrases = ' '.join(words[:4]) if words else ''

        # Enhanced tone detection based on full content
        if any(k in lower for k in ['sad', 'down', 'lonely', 'anxious', 'stress', 'worried', 'depressed', 'hopeless']):
            ack = "It sounds like you're carrying a lot right now."
        elif any(k in lower for k in ['angry', 'mad', 'frustrat', 'annoyed', 'irritated']):
            ack = "Your frustration comes through — that's valid."
        elif any(k in lower for k in ['happy', 'grateful', 'excited', 'hopeful']):
            ack = "It's great to hear some positive feelings too."
        elif any(k in lower for k in ['confused', 'lost', 'unsure', 'dont know']):
            ack = "It's okay to feel uncertain — many people do."
        else:
            ack = "Thanks for sharing — I'm listening."

        # Dynamic tips based on content length and mode
        if mode == 'rephrase':
            tips = [
                ack,
                f"I'm noticing '{key_phrases}' — would you like to say a bit more about that?" if key_phrases else "Reflect one small detail that matters to you.",
                "Try softening strong words and stating the feeling + request."
            ]
            question = "What would be a kinder, clearer way to say what you mean?"
        else:
            if len(text) < 50:
                tips = [
                    ack,
                    f"I'm noticing '{key_phrases}' — would you like to say a bit more?" if key_phrases else "Reflect one small detail that matters to you.",
                    "One gentle next step: write one sentence about what support would feel helpful."
                ]
            elif len(text) < 150:
                tips = [
                    ack,
                    f"I'm noticing '{key_phrases}' — would you like to say a bit more?" if key_phrases else "Reflect one small detail that matters to you.",
                    "Consider sharing how this situation is affecting you emotionally."
                ]
            else:
                tips = [
                    ack,
                    "You've shared quite a bit — that's brave.",
                    "One gentle next step: write one sentence about what support would feel helpful."
                ]

            question = "If you'd like, what support would feel helpful right now?"

        return tips, question

    # API: Gentle AI coach for writing guidance (does not change user's words)
    @app.route('/api/coach', methods=['POST'])
    def api_coach():
        try:
            payload = request.get_json(silent=True) or {}
            content = (payload.get('content') or '').strip()
            mode = (payload.get('mode') or 'reply').strip()  # 'reply' | 'rephrase'

            app.logger.info(f"Coach API called: content='{content[:50]}...', mode={mode}")

            # Always generate dynamic tips based on content, even if no API key
            tips, question = _heuristic_coach_suggestions(content, mode)
            app.logger.info(f"Generated tips: {tips[:2]}..., question: {question}")

            # Try to enhance with AI if key is available and content is substantial
            if len(content) >= 10:  # Only try AI for longer content
                _api_key_present = bool(app.config.get('GEMINI_API_KEY') or os.getenv('GEMINI_API_KEY'))
                if _api_key_present:
                    try:
                        # Ask the model for gentle prompts; never rewrite user's text
                        if mode == 'rephrase':
                            prompt = (
                                "You are assisting an admin reviewing a flagged letter on E.C.H.O.E.\n"
                                "Provide 3 concise bullet suggestions to help the user rephrase problematic wording while preserving their feelings.\n"
                                "Be non-judgmental. Do NOT write the text for them.\n"
                                "User letter excerpt (do not quote back):\n" + content[:1500] + "\n\n"
                                "Output bullets only."
                            )
                        else:
                            prompt = (
                                "You are a supportive reply assistant for volunteers on E.C.H.O.E.\n"
                                "Given the user's letter excerpt (do not quote back), provide 3 concise reply tips focusing on empathy, reflection, and one gentle next step.\n"
                                "No diagnoses or medical advice.\n"
                                "Letter excerpt:\n" + content[:1500]
                            )

                        suggestions_text = generate_ai_response_with_type(prompt, 'supportive')
                        if suggestions_text:
                            lines = [l.strip() for l in suggestions_text.splitlines() if l.strip()]
                            ai_tips = []
                            for l in lines:
                                # Accept common bullet characters or numeric lists
                                if l.startswith(('- ', '• ', '* ', '– ')) or l[:2].isdigit():
                                    ai_tips.append(l.lstrip('•*-– ').split(' ', 1)[-1].strip())
                                elif l.lower().startswith('one question:'):
                                    question = l.split(':', 1)[-1].strip() or question
                            if ai_tips:
                                tips = ai_tips[:3]  # Use AI tips if available
                                app.logger.info(f"Using AI tips: {tips[:2]}...")
                    except Exception as e:
                        app.logger.warning(f"AI coach enhancement failed: {e}")

            return jsonify({'tips': tips[:3], 'question': question})
        except Exception as e:
            app.logger.error(f"api_coach error: {e}")
            # Fallback even on error
            tips, question = _heuristic_coach_suggestions(content, mode)
            return jsonify({'tips': tips[:3], 'question': question}), 200

    # --- Moderation helpers ---
    def _deterministic_match(text: str) -> tuple[bool, str]:
        lower = (text or '').lower()
        hard_keywords = [
            # Self-harm / violence / sexual violence
            'kill myself','suicide','end my life','hurt myself','self-harm','rape',
            'kill you','shoot','bomb','terrorist','execute','hang myself','overdose',
            # Doxxing / illegal
            'dox','leak address','credit card number','ssn','social security',
            # Hate slurs (subset)
            'nigger','faggot','kike','chink','spic',
            # Pornographic/minors
            'child porn','cp ','cp\n','loli',
            # Profanity
            'fuck','fuck you','motherfucker','cunt','shit',
        ]
        for kw in hard_keywords:
            if kw in lower:
                return True, kw
        return False, ''

    def ai_moderate_letter_content(text: str) -> tuple[bool, str]:
        """Return (flagged, reason). Deterministic keyword scan first, then AI JSON."""
        flagged_kw, kw = _deterministic_match(text)
        if flagged_kw:
            return True, f"keyword: {kw}"
        try:
            prompt = (
                "You are a strict but fair community safety checker. Read the user's entire letter.\n"
                "Decide if it should be suspended for admin review before volunteers see it.\n"
                "Reasons: hate/harassment, self-harm intent, explicit sexual content, doxxing, threats, spam/scams, minors sexual content, or severe profanity.\n"
                "Consider context; support-seeking mentions of self-harm without plan can pass.\n"
                "Respond ONLY in JSON with keys flagged (true/false) and reason (short).\n"
                f"Letter: '''{text[:6000]}'''\n"
            )
            result = generate_ai_response_with_type(prompt, 'moderation')
            if result:
                try:
                    data = json.loads(result)
                    flagged = bool(data.get('flagged'))
                    reason = (data.get('reason') or '').strip()
                    return flagged, reason
                except Exception:
                    pass
        except Exception:
            pass
        return False, ''

    # Route: Submit letter
    @app.route('/submit', methods=['GET', 'POST'])
    def submit():
        try:
            # Debug information
            app.logger.info(f"Request language: {request.headers.get('Accept-Language', 'None')}")
            app.logger.info(f"Template folder: {app.template_folder}")
            app.logger.info(f"Available templates: {os.listdir(app.template_folder)}")
            
            form = LetterForm()
            mailboxes = PhysicalMailbox.query.filter_by(status='active').all()
            
            if form.validate_on_submit():
                # Create new letter
                letter = Letter(
                    title=None,
                    topic=form.topic.data,
                    content=form.content.data,
                    reply_method=form.reply_method.data,
                    anonymous_email=form.anonymous_email.data if form.reply_method.data == 'anonymous-email' else None
                )
                # Anonymous inbox linkage
                anon_cookie = request.cookies.get('echoe_anon')
                if not anon_cookie:
                    anon_cookie = str(uuid.uuid4()).replace('-', '')
                letter.anon_user_id = anon_cookie
                
                # Save to database (but decide moderation status first)
                flagged, reason = ai_moderate_letter_content(letter.content)
                letter.is_flagged = True if flagged else False
                letter.moderation_reason = reason
                letter.moderation_checked = True
                db.session.add(letter)
                # Before commit, optionally generate a concise title
                try:
                    generated = generate_ai_response_with_type(
                        f"Create a short, human, gentle 3-6 word title for this anonymous journal entry. Avoid quotes and weird phrasing. Entry: {letter.content}",
                        'supportive'
                    )
                    if generated:
                        # Clean up to a single line, truncate
                        clean = (generated or '').split('\n')[0].strip().strip('"\' ')
                        letter.title = (clean[:140] if clean else None)
                except Exception:
                    pass
                db.session.commit()
                
                # AI instant reply path removed per new product decision
                
                # Otherwise show confirmation page (Inbox-based)
                if letter.is_flagged:
                    flash("Thanks for sharing. Your letter is under review by our admins to keep the community safe. You'll be notified in your Inbox.")
                else:
                    flash('Your letter has been submitted. Please check your Inbox for replies.')
                resp = make_response(redirect(url_for('confirmation', letter_id=letter.unique_id)))
                resp.set_cookie('echoe_anon', anon_cookie, max_age=60*60*24*730, httponly=True, samesite='Lax', secure=True)
                return resp
            
            # Ensure anon cookie even on GET so next submit links to inbox owner
            anon_cookie = request.cookies.get('echoe_anon')
            if not anon_cookie:
                anon_cookie = str(uuid.uuid4()).replace('-', '')
                resp = make_response(render_template('submit.html', form=form, mailboxes=mailboxes))
                resp.set_cookie('echoe_anon', anon_cookie, max_age=60*60*24*730, httponly=True, samesite='Lax', secure=True)
                return resp
            return render_template('submit.html', form=form, mailboxes=mailboxes)
        except Exception as e:
            logger.error(f"Error in submit route: {str(e)}")
            logger.error(traceback.format_exc())
            flash('An error occurred while processing your request. Please try again.')
            return redirect(url_for('index'))

    # Route: Letter submission confirmation
    @app.route('/confirmation/<letter_id>')
    def confirmation(letter_id):
        letter = Letter.query.filter_by(unique_id=letter_id).first_or_404()
        return render_template('confirmation.html', letter=letter)

    # Route: View response
    @app.route('/response/<letter_id>')
    def view_response(letter_id):
        letter = Letter.query.filter_by(unique_id=letter_id).first_or_404()
        responses = letter.responses.order_by(Response.created_at).all()
        # If the viewer is the anon owner, mark read
        anon_cookie = request.cookies.get('echoe_anon')
        if anon_cookie and letter.anon_user_id == anon_cookie and letter.has_unread:
            letter.has_unread = False
            db.session.commit()
        return render_template('response.html', letter=letter, responses=responses)

    # -------- Anonymous Inbox --------
    @app.route('/inbox')
    def inbox():
        anon_cookie = request.cookies.get('echoe_anon')
        if not anon_cookie:
            # empty state
            return render_template('inbox.html', letters=[], empty=True)
        letters = Letter.query.filter_by(anon_user_id=anon_cookie).order_by(Letter.created_at.desc()).all()
        return render_template('inbox.html', letters=letters, empty=len(letters)==0)

    @app.route('/inbox/letter/<letter_id>')
    def inbox_letter(letter_id):
        anon_cookie = request.cookies.get('echoe_anon')
        letter = Letter.query.filter_by(unique_id=letter_id).first_or_404()
        is_owner = bool(anon_cookie and letter.anon_user_id == anon_cookie)
        responses = letter.responses.order_by(Response.created_at).all()
        if is_owner and letter.has_unread:
            letter.has_unread = False
            db.session.commit()
        return render_template('inbox_thread.html', letter=letter, responses=responses, is_owner=is_owner)

    @app.route('/api/inbox/unread-count')
    def inbox_unread_count():
        anon_cookie = request.cookies.get('echoe_anon')
        if not anon_cookie:
            return jsonify({ 'count': 0 })
        count = Letter.query.filter_by(anon_user_id=anon_cookie, has_unread=True).count()
        return jsonify({ 'count': count })

    # Internal function: Generate AI response
    def generate_ai_response(message):
        try:
            api_key = app.config.get('GEMINI_API_KEY') or os.getenv('GEMINI_API_KEY')
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
            
            payload = {
                "contents": [{
                    "parts": [{
                        "text": f"You are a supportive AI companion for the E.C.H.O.E mental health platform (Empathy, Connection, Hope, Outreach, Empowerment). "
                               f"Respond with empathy and care. Do not diagnose or provide medical advice. "
                               f"Keep responses supportive, thoughtful and relatively brief. "
                               f"User message: {message}"
                    }]
                }]
            }
            
            # Use httpx to avoid eventlet/requests recursion issues and add a timeout
            with httpx.Client(timeout=15) as client:
                response = client.post(url, json=payload)
                data = response.json()
            
            if data and 'candidates' in data and len(data['candidates']) > 0:
                ai_response = " ".join([part['text'] for part in data['candidates'][0]['content']['parts']])
                return ai_response
            else:
                return "I'm sorry, I'm having trouble generating a response right now. A human volunteer will review your letter soon."
        
        except Exception as e:
            app.logger.error(f"Error generating AI response: {str(e)}")
            return "I'm sorry, I'm having trouble generating a response right now. A human volunteer will review your letter soon."

    # Route: Content moderation API endpoint
    @app.route('/api/moderate', methods=['POST'])
    def moderate_content():
        data = request.json
        
        if not data or 'content' not in data:
            return jsonify({'error': 'No content provided'}), 400
        
        content = data['content']
        
        # Simple moderation logic (in a real application, you might use a more complex AI service)
        flagged_keywords = ['suicide', 'kill myself', 'end my life', 'hurt myself', 'self-harm']
        is_flagged = any(keyword in content.lower() for keyword in flagged_keywords)
        
        # Build response
        if is_flagged:
            response = {
                'status': 'flagged',
                'message': "I notice you've mentioned something concerning. If you're in crisis, please call your local crisis line immediately. In Canada, you can call 1-833-456-4566, or text 45645. Would you like me to provide more support resources?"
            }
        else:
            response = {
                'status': 'approved',
                'message': None
            }
        
        return jsonify(response)

    # Route: Registration
    @app.route('/register', methods=['GET', 'POST'])
    def register():
        if current_user.is_authenticated:
            return redirect(url_for('index'))
        
        form = RegistrationForm()
        if form.validate_on_submit():
            try:
                # Check if username exists
                if User.query.filter_by(username=form.username.data).first():
                    flash('Username is already taken. Please choose another one.', 'error')
                    return render_template('signup.html', form=form)
                
                # Check if email exists
                if User.query.filter_by(email=form.email.data).first():
                    flash('Email is already registered. Please use another email.', 'error')
                    return render_template('signup.html', form=form)
                
                user = User(
                    username=form.username.data,
                    email=form.email.data,
                    is_volunteer=True  # Default to volunteer
                )
                user.set_password(form.password.data)
                db.session.add(user)
                db.session.commit()
                
                flash('Registration successful! Please log in.', 'success')
                return redirect(url_for('login'))
            except Exception as e:
                db.session.rollback()
                logger.error(f"Registration error: {str(e)}")
                flash('An error occurred during registration. Please try again later.', 'error')
                return render_template('signup.html', form=form)
        
        return render_template('signup.html', form=form)

    # Route: Login
    @app.route('/login', methods=['GET', 'POST'])
    def login():
        try:
            logger.info("Login route accessed")
            logger.info(f"Request method: {request.method}")
            logger.info(f"Request form data: {request.form}")
            logger.info(f"Current user authenticated: {current_user.is_authenticated}")
            
            if current_user.is_authenticated:
                logger.info(f"User {current_user.username} is already authenticated, redirecting to index")
                return redirect(url_for('index'))
            
            if request.method == 'POST':
                email = request.form.get('email')
                password = request.form.get('password')
                remember_me = request.form.get('remember_me') == 'on'
                
                logger.info(f"Login attempt for email: {email}")
                
                if not email or not password:
                    logger.warning("Missing email or password")
                    flash('Please enter both email and password', 'error')
                    return render_template('login.html')
                
                user = User.query.filter_by(email=email).first()
                if not user:
                    logger.warning(f"User not found: {email}")
                    flash('Invalid email or password', 'error')
                    return render_template('login.html')
                
                if user.check_password(password):
                    login_user(user, remember=remember_me)
                    logger.info(f"User {user.username} logged in successfully")
                    next_page = request.args.get('next')
                    if not next_page or urlparse(next_page).netloc != '':
                        next_page = url_for('index')
                    return redirect(next_page)
                else:
                    logger.warning(f"Invalid password for user: {email}")
                    flash('Invalid email or password', 'error')
                    return render_template('login.html')
            
            return render_template('login.html')
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            logger.error(traceback.format_exc())
            flash('An error occurred during login. Please try again later.', 'error')
            return render_template('login.html')

    # Route: Logout
    @app.route('/logout', methods=['GET', 'POST'])
    def logout():
        logout_user()
        return redirect(url_for('index'))

    # Volunteer route: Dashboard
    @app.route('/volunteer/dashboard')
    @volunteer_required
    def volunteer_dashboard():
        # Exclude anything flagged (including potential NULLs) from unprocessed list
        unprocessed_letters = Letter.query.filter(
            (Letter.is_processed == False) & ((Letter.is_flagged == False) | (Letter.is_flagged.is_(None)))
        ).order_by(Letter.created_at).all()
        # Volunteers no longer see flagged letters at all
        return render_template('volunteer/dashboard.html', 
                              unprocessed_letters=unprocessed_letters)

    # Volunteer route: Respond to letter
    @app.route('/volunteer/letter/<letter_id>', methods=['GET', 'POST'])
    @volunteer_required
    def respond_to_letter(letter_id):
        
        letter = Letter.query.filter_by(unique_id=letter_id).first_or_404()
        previous_responses = letter.responses.order_by(Response.created_at).all()
        
        form = ResponseForm()
        if form.validate_on_submit():
            # If it's AI-assisted or hybrid response
            ai_content = None
            if form.response_type.data in ['ai-assisted', 'hybrid']:
                ai_content = generate_ai_response(letter.content)
            
            # Create volunteer response
            human_response = Response(
                content=form.content.data,
                response_type='human' if form.response_type.data == 'human' else 'hybrid',
                letter_id=letter.id
            )
            
            db.session.add(human_response)
            
            # If it's hybrid reply, add AI part
            if form.response_type.data == 'hybrid' and ai_content:
                ai_response = Response(
                    content=ai_content,
                    response_type='ai',
                    letter_id=letter.id,
                    ai_model='gemini-2.0-flash'
                )
                db.session.add(ai_response)
            
            # Update letter status and notify anon owner
            letter.is_processed = True
            # If an admin or volunteer replies to a flagged letter during review,
            # consider it resolved from the suspension queue so the red dot clears.
            if letter.is_flagged:
                letter.is_flagged = False
            letter.has_unread = True
            letter.responder_id = current_user.id
            
            db.session.commit()
            
            flash('Your response has been sent!')
            return redirect(url_for('volunteer_dashboard'))
        
        return render_template('volunteer/respond.html', letter=letter, 
                              previous_responses=previous_responses, form=form)

    # Blog routes
    @app.route('/blog')
    def blog_index():
        posts = Post.query.order_by(Post.created_at.desc()).all()
        return render_template('blog/index.html', posts=posts)

    @app.route('/blog/post/<int:post_id>')
    def view_post(post_id):
        post = Post.query.get_or_404(post_id)
        return render_template('blog/post_detail.html', post=post)

    # Event routes
    @app.route('/events')
    def events_index():
        events = Event.query.order_by(Event.event_date.desc()).all()
        return render_template('events/index.html', events=events)

    @app.route('/events/<int:event_id>')
    def event_detail(event_id):
        event = Event.query.get_or_404(event_id)
        return render_template('events/event_detail.html', event=event)

    # Privacy policy route
    @app.route('/privacy')
    def privacy():
        return render_template('privacy.html')

    # Route: Terms of service
    @app.route('/terms')
    def terms():
        return render_template('terms.html')

    # Route: Contact us
    @app.route('/contact', methods=['GET', 'POST'])
    def contact():
        if request.method == 'POST':
            # In a real application, you would handle the form data (e.g., send an email)
            # For now, we'll just flash a confirmation message.
            flash('Thank you for your message! We will get back to you soon.', 'success')
            return redirect(url_for('contact'))
        return render_template('contact.html')

    # Legacy route: redirect to Inbox (code system removed)
    @app.route('/check-reply', methods=['GET', 'POST'])
    def check_letter_reply():
        flash('Replies are now available in your Inbox.', 'info')
        return redirect(url_for('inbox'))

    # API route: Get AI response
    @app.route('/api/chat', methods=['POST'])
    def chat_with_ai():
        data = request.json
        
        if not data or 'message' not in data:
            return jsonify({'error': 'No message provided'}), 400
        
        message = data['message']
        response_type = data.get('type', 'supportive')
        
        # First perform content moderation
        moderation_result = moderate_content_internal(message)
        
        if moderation_result['status'] == 'flagged':
            return jsonify({
                'status': 'flagged',
                'message': moderation_result['message']
            })
        
        # Generate AI response
        ai_response = generate_ai_response_with_type(message, response_type)
        
        return jsonify({
            'status': 'success',
            'message': ai_response
        })

    # Internal function: Generate AI response of specified type
    def generate_ai_response_with_type(message, response_type):
        try:
            api_key = app.config.get('GEMINI_API_KEY') or os.getenv('GEMINI_API_KEY')
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
            
            prompt_prefix = "You are a supportive AI companion for the E.C.H.O.E mental health platform (Empathy, Connection, Hope, Outreach, Empowerment). "
            
            if response_type == 'practical':
                prompt_prefix += "Offer concrete, actionable advice while being supportive and compassionate. "
                prompt_prefix += "Focus on small, manageable steps the user can take. "
            elif response_type == 'reflective':
                prompt_prefix += "Ask thoughtful questions to help the user explore their feelings and situation more deeply. "
                prompt_prefix += "Help them gain insight through gentle reflection rather than direct advice. "
            else:  # supportive
                prompt_prefix += "Respond with empathy and care. Focus on emotional support and validation of feelings. "
            
            prompt_prefix += "Do not diagnose or provide medical advice. Keep responses supportive and relatively brief. "
            
            payload = {
                "contents": [{
                    "parts": [{
                        "text": f"{prompt_prefix} User message: {message}"
                    }]
                }]
            }
            
            with httpx.Client(timeout=15) as client:
                response = client.post(url, json=payload)
                data = response.json()
            
            if data and 'candidates' in data and len(data['candidates']) > 0:
                ai_response = " ".join([part['text'] for part in data['candidates'][0]['content']['parts']])
                return ai_response
            else:
                return "I'm sorry, I'm having trouble generating a response right now."
        
        except Exception as e:
            app.logger.error(f"Error generating AI response: {str(e)}")
            return "I'm sorry, I'm having trouble generating a response right now."

    # Internal function: Content moderation
    def moderate_content_internal(content):
        # Simple moderation logic (in a real application, you might use a more complex AI service)
        flagged_keywords = ['suicide', 'kill myself', 'end my life', 'hurt myself', 'self-harm']
        is_flagged = any(keyword in content.lower() for keyword in flagged_keywords)
        
        if is_flagged:
            return {
                'status': 'flagged',
                'message': "I notice you've mentioned something concerning. If you're in crisis, please call your local crisis line immediately. In Canada, you can call 1-833-456-4566, or text 45645. Would you like me to provide more support resources?"
            }
        else:
            return {
                'status': 'approved',
                'message': None
            }

    # Route: Community Chat (redirect to home since chat is now a widget)
    @app.route('/chat')
    def chat():
        return redirect(url_for('index'))

    # Route: Test (redirect to chat for backward compatibility)
    @app.route('/test')
    def test():
        return redirect(url_for('chat'))

    # Route: About us
    @app.route('/about')
    def about():
        return render_template('about.html')

    # Route: Resources
    @app.route('/resources')
    def resources():
        return render_template('resources.html')

    # Route: Volunteer information
    @app.route('/volunteer-info')
    def volunteer_info():
        return render_template('volunteer_info.html')

    # Route: Donate
    @app.route('/donate')
    def donate():
        return render_template('donate.html')

    # Route: Social Hub
    @app.route('/social')
    def social():
        return render_template('social.html')

    # Route: Team
    @app.route('/team')
    def team():
        return render_template('team.html')

    # Admin routes
    @app.route('/admin')
    @admin_required
    def admin_dashboard():
        """Main admin dashboard with overview statistics"""
        # Get statistics
        total_users = User.query.count()
        total_letters = Letter.query.count()
        total_responses = Response.query.count()
        unprocessed_letters = Letter.query.filter_by(is_processed=False).count()
        flagged_letters = Letter.query.filter_by(is_flagged=True).count()
        total_volunteers = User.query.filter_by(is_volunteer=True).count()
        total_admins = User.query.filter(User.role.in_([UserRole.ADMIN, UserRole.ULTIMATE_ADMIN])).count()
        
        # Recent activity
        recent_letters = Letter.query.order_by(Letter.created_at.desc()).limit(5).all()
        recent_responses = Response.query.order_by(Response.created_at.desc()).limit(5).all()
        
        return render_template('admin/dashboard.html',
                             total_users=total_users,
                             total_letters=total_letters,
                             total_responses=total_responses,
                             unprocessed_letters=unprocessed_letters,
                             flagged_letters=flagged_letters,
                             total_volunteers=total_volunteers,
                             total_admins=total_admins,
                             recent_letters=recent_letters,
                             recent_responses=recent_responses)

    @app.route('/admin/users')
    @ultimate_admin_required
    def admin_users():
        """User management - Ultimate Admin only"""
        users = User.query.order_by(User.created_at.desc()).all()
        return render_template('admin/users.html', users=users, UserRole=UserRole)

    @app.route('/admin/users/<int:user_id>/promote', methods=['POST'])
    @ultimate_admin_required
    def promote_user(user_id):
        """Promote user to admin"""
        user = User.query.get_or_404(user_id)
        
        # Prevent self-promotion/demotion
        if user.id == current_user.id:
            flash('You cannot change your own role.', 'error')
            return redirect(url_for('admin_users'))
        
        # Prevent changing other Ultimate Admins
        if user.role == UserRole.ULTIMATE_ADMIN and current_user.id != user.id:
            flash('You cannot change the role of other Ultimate Administrators.', 'error')
            return redirect(url_for('admin_users'))
        
        if user.role == UserRole.USER:
            user.role = UserRole.ADMIN
            user.is_admin = True  # For backward compatibility
            db.session.commit()
            flash(f'{user.username} has been promoted to Administrator.', 'success')
        else:
            flash(f'{user.username} is already an Administrator or higher.', 'info')
        
        return redirect(url_for('admin_users'))

    @app.route('/admin/users/<int:user_id>/demote', methods=['POST'])
    @ultimate_admin_required
    def demote_user(user_id):
        """Demote admin to regular user"""
        user = User.query.get_or_404(user_id)
        
        # Prevent self-demotion
        if user.id == current_user.id:
            flash('You cannot change your own role.', 'error')
            return redirect(url_for('admin_users'))
        
        # Prevent demoting Ultimate Admins
        if user.role == UserRole.ULTIMATE_ADMIN:
            flash('Ultimate Administrators cannot be demoted through this interface.', 'error')
            return redirect(url_for('admin_users'))
        
        if user.role == UserRole.ADMIN:
            user.role = UserRole.USER
            user.is_admin = False  # For backward compatibility
            db.session.commit()
            flash(f'{user.username} has been demoted to regular User.', 'success')
        else:
            flash(f'{user.username} is not currently an Administrator.', 'info')
        
        return redirect(url_for('admin_users'))

    @app.route('/admin/users/<int:user_id>/make-ultimate', methods=['POST'])
    @ultimate_admin_required
    def make_ultimate_admin(user_id):
        """Promote user to Ultimate Administrator"""
        user = User.query.get_or_404(user_id)
        
        # Prevent self-promotion (though they're already ultimate admin)
        if user.id == current_user.id:
            flash('You are already an Ultimate Administrator.', 'info')
            return redirect(url_for('admin_users'))
        
        if user.role != UserRole.ULTIMATE_ADMIN:
            user.role = UserRole.ULTIMATE_ADMIN
            user.is_admin = True  # For backward compatibility
            user.is_volunteer = True  # Ultimate admins can do everything
            db.session.commit()
            flash(f'{user.username} has been promoted to Ultimate Administrator.', 'success')
        else:
            flash(f'{user.username} is already an Ultimate Administrator.', 'info')
        
        return redirect(url_for('admin_users'))

    @app.route('/admin/users/<int:user_id>/delete', methods=['POST'])
    @ultimate_admin_required
    def delete_user(user_id):
        """Delete a user (Ultimate Admin only)"""
        user = User.query.get_or_404(user_id)
        
        # Prevent self-deletion
        if user.id == current_user.id:
            flash('You cannot delete your own account.', 'error')
            return redirect(url_for('admin_users'))
        
        # Prevent deleting other Ultimate Admins
        if user.role == UserRole.ULTIMATE_ADMIN and current_user.id != user.id:
            flash('You cannot delete other Ultimate Administrators.', 'error')
            return redirect(url_for('admin_users'))
        
        username = user.username
        
        # First, find all letters that this user responded to
        letters_responded = Letter.query.filter_by(responder_id=user.id).all()
        
        # Delete all responses by this user for those letters
        for letter in letters_responded:
            # Delete responses for letters this user responded to
            Response.query.filter_by(letter_id=letter.id).delete()
            # Reset letter status
            letter.responder_id = None
            letter.is_processed = False
        
        # Delete the user
        db.session.delete(user)
        db.session.commit()
        
        flash(f'User {username} has been permanently deleted.', 'success')
        return redirect(url_for('admin_users'))

    @app.route('/admin/content')
    @admin_required
    def admin_content():
        """Content moderation dashboard"""
        letters = Letter.query.order_by(Letter.created_at.desc()).all()
        responses = Response.query.order_by(Response.created_at.desc()).all()
        posts = Post.query.order_by(Post.created_at.desc()).all()
        events = Event.query.order_by(Event.event_date.desc()).all()
        
        flagged_letters = Letter.query.filter_by(is_flagged=True).order_by(Letter.created_at.desc()).all()
        return render_template('admin/content.html',
                             letters=letters,
                             responses=responses,
                             posts=posts,
                             events=events,
                             flagged_letters=flagged_letters)

    @app.route('/admin/letters/<letter_id>/delete', methods=['POST'])
    @admin_required
    def admin_delete_letter(letter_id):
        """Delete a letter (admin only)"""
        letter = Letter.query.filter_by(unique_id=letter_id).first_or_404()
        
        # Delete all associated responses first
        Response.query.filter_by(letter_id=letter.id).delete()
        
        db.session.delete(letter)
        db.session.commit()
        
        flash('Letter and all associated responses have been deleted.', 'success')
        return redirect(url_for('admin_content'))

    @app.route('/admin/responses/<int:response_id>/delete', methods=['POST'])
    @admin_required
    def admin_delete_response(response_id):
        """Delete a response (admin only)"""
        response = Response.query.get_or_404(response_id)
        
        db.session.delete(response)
        db.session.commit()
        
        flash('Response has been deleted.', 'success')
        return redirect(url_for('admin_content'))

    # Admin moderation helpers
    @app.route('/admin/letters/<letter_id>/flag', methods=['POST'])
    @admin_required
    def admin_flag_letter(letter_id):
        """Flag a letter for review (admin only)"""
        letter = Letter.query.filter_by(unique_id=letter_id).first_or_404()
        letter.is_flagged = True
        db.session.commit()
        flash('Letter has been flagged for review.', 'success')
        return redirect(url_for('admin_content'))

    @app.route('/admin/letters/<letter_id>/approve', methods=['POST'])
    @admin_required
    def admin_approve_letter(letter_id):
        """Approve letter for volunteers: unflag and mark unprocessed so it shows up."""
        letter = Letter.query.filter_by(unique_id=letter_id).first_or_404()
        letter.is_flagged = False
        letter.is_processed = False
        db.session.commit()
        flash('Letter approved and sent to volunteers.', 'success')
        return redirect(url_for('admin_content'))

    @app.route('/admin/letters/<letter_id>')
    @admin_required
    def view_letter_detail(letter_id):
        """Redirect to the volunteer respond view for detailed review"""
        return redirect(url_for('respond_to_letter', letter_id=letter_id))

    @app.route('/admin/users/<int:user_id>/grant-volunteer', methods=['POST'])
    @admin_required
    def grant_volunteer(user_id):
        """Grant volunteer access to a user"""
        user = User.query.get_or_404(user_id)
        
        # Prevent modifying own account
        if user.id == current_user.id:
            flash('You cannot change your own volunteer status.', 'error')
            return redirect(url_for('admin_users'))
        
        # Prevent changing other Ultimate Admins (unless you are one)
        if user.role == UserRole.ULTIMATE_ADMIN and current_user.role != UserRole.ULTIMATE_ADMIN:
            flash('You cannot change the volunteer status of Ultimate Administrators.', 'error')
            return redirect(url_for('admin_users'))
        
        if not user.is_volunteer:
            user.is_volunteer = True
            db.session.commit()
            flash(f'{user.username} has been granted volunteer access.', 'success')
        else:
            flash(f'{user.username} is already a volunteer.', 'info')
        
        return redirect(url_for('admin_users'))

    @app.route('/admin/users/<int:user_id>/revoke-volunteer', methods=['POST'])
    @admin_required
    def revoke_volunteer(user_id):
        """Revoke volunteer access from a user"""
        user = User.query.get_or_404(user_id)
        
        # Prevent modifying own account
        if user.id == current_user.id:
            flash('You cannot change your own volunteer status.', 'error')
            return redirect(url_for('admin_users'))
        
        # Prevent changing other Ultimate Admins (unless you are one)
        if user.role == UserRole.ULTIMATE_ADMIN and current_user.role != UserRole.ULTIMATE_ADMIN:
            flash('You cannot change the volunteer status of Ultimate Administrators.', 'error')
            return redirect(url_for('admin_users'))
        
        if user.is_volunteer:
            user.is_volunteer = False
            db.session.commit()
            flash(f'Volunteer access has been revoked from {user.username}.', 'success')
        else:
            flash(f'{user.username} is not currently a volunteer.', 'info')
        
        return redirect(url_for('admin_users'))

    # Context processor: Add current year to all templates
    @app.context_processor
    def inject_now():
        return {'now': datetime.utcnow()}

    # Error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return render_template('errors/404.html'), 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return render_template('errors/500.html'), 500

    # Route: Test submit
    @app.route('/test-submit')
    def test_submit():
        return render_template('test-submit.html')

    # 健康检查端点
    @app.route('/health-check')
    def health_check():
        return jsonify({'status': 'ok'})

    # 语音识别设置端点
    @app.route('/voice-settings', methods=['GET'])
    def get_voice_settings():
        return jsonify({
            'available_voices': [
                {'name': 'en-US-Standard-A', 'label': 'Female (Standard)'},
                {'name': 'en-US-Standard-B', 'label': 'Male (Standard)'},
                {'name': 'en-US-Wavenet-A', 'label': 'Female (Natural)'},
                {'name': 'en-US-Wavenet-B', 'label': 'Male (Natural)'}
            ],
            'default_voice': 'en-US-Standard-A'
        })

    # 保存聊天记录
    @app.route('/save-chat', methods=['POST'])
    def save_chat():
        data = request.json
        user_id = data.get('user_id')
        message = data.get('message')
        response = data.get('response')
        
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        
        try:
            c.execute('''
                INSERT INTO chat_history (user_id, message, response)
                VALUES (?, ?, ?)
            ''', (user_id, message, response))
            conn.commit()
            return jsonify({'success': True})
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)})
        finally:
            conn.close()

    @socketio.on('message')
    def handle_message(data):
        message_text = data.get('text', '')
        user_name = session.get('anonymous_name', 'Anonymous')

        moderation_result = moderate_content_internal(message_text)
        
        if moderation_result['status'] == 'flagged':
            emit('moderation_warning', {
                'text': moderation_result['message']
            })
        else:
            emit('message', {
                'user': user_name,
                'text': message_text
            }, broadcast=True)

    # Run application (development environment)
    if __name__ == '__main__':
        logger.info("Starting Flask application...")
        logger.info(f"Database URI: {app.config['SQLALCHEMY_DATABASE_URI']}")
        logger.info(f"Instance folder: {app.instance_path}")
        socketio.run(app, debug=True, use_reloader=False)

except Exception as e:
    logger.error("Error during application startup:")
    logger.error(traceback.format_exc())
    sys.exit(1) 