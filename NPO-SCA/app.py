import eventlet
eventlet.monkey_patch()
from flask import Flask, render_template, redirect, url_for, flash, request, jsonify, abort, send_from_directory, session, make_response
from sqlalchemy import inspect, text, func
from flask_login import LoginManager, login_user, logout_user, current_user, login_required
from urllib.parse import urlparse
import os
from datetime import datetime, timedelta
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
import re
import xml.etree.ElementTree as ET

from config import Config
from models import db, User, Letter, Response, UserReply, PhysicalMailbox, Post, Event, UserRole
from forms import LetterForm, ResponseForm, LoginForm, RegistrationForm, PhysicalLetterForm, UserReplyForm
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

    # In-memory, short-lived IP buckets for basic rate limiting (per process)
    LETTER_IP_BUCKETS = {}
    IP_WINDOW_SECONDS = 60
    IP_MAX_REQUESTS = 30  # per minute per IP for /submit

    def _ip_limited(ip: str) -> bool:
        """Return True if IP exceeded short-term limit; keep only recent timestamps."""
        if not ip:
            return False
        now = time.time()
        bucket = LETTER_IP_BUCKETS.get(ip, [])
        # keep only events within window
        bucket = [t for t in bucket if now - t < IP_WINDOW_SECONDS]
        if len(bucket) >= IP_MAX_REQUESTS:
            LETTER_IP_BUCKETS[ip] = bucket
            return True
        bucket.append(now)
        # cap stored history to avoid unbounded growth
        if len(bucket) > IP_MAX_REQUESTS * 2:
            bucket = bucket[-IP_MAX_REQUESTS * 2:]
        LETTER_IP_BUCKETS[ip] = bucket
        return False

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
            # Suspicious anon IDs: many letters in last 24h (for admin dashboard)
            day_ago = datetime.utcnow() - timedelta(days=1)
            suspicious_raw = (db.session.query(Letter.anon_user_id, func.count(Letter.id).label('cnt'))
                              .filter(Letter.created_at >= day_ago)
                              .filter(Letter.anon_user_id.isnot(None))
                              .group_by(Letter.anon_user_id)
                              .having(func.count(Letter.id) >= 10)
                              .order_by(func.count(Letter.id).desc())
                              .limit(20)
                              .all())
            suspicious_anon = [{'anon_id': row[0], 'count': row[1]} for row in suspicious_raw]
        except Exception:
            flagged_cnt = 0
            unprocessed_cnt = 0
            suspicious_anon = []
        return dict(flagged_count=flagged_cnt, unprocessed_count=unprocessed_cnt,
                    suspicious_anon=suspicious_anon)
    
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
            db_uri = app.config['SQLALCHEMY_DATABASE_URI']
            if db_uri.startswith('sqlite:///'):
                os.makedirs(os.path.dirname(db_uri.replace('sqlite:///', '')), exist_ok=True)
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

        # Focus on the most recent part of the text so guidance evolves as user types
        lower = text.lower()
        recent = lower[-160:]
        # Try last sentence-like clause from ., !, ? or newline
        for sep in ['\n', '.', '!', '?']:
            if sep in recent:
                recent = recent.split(sep)[-1]
        # Basic keyword extraction from recent clause
        tokens = re.findall(r"[a-zA-Z']+", recent)
        stop = {
            'the','and','a','to','of','is','in','it','i','im','am','are','was','were','be','for','on','at','this','that','with','as','but','so','just','very','really','now','about','my','me','we','you','they'
        }
        key_words = [t for t in tokens if t not in stop][:6]
        key_phrases = ' '.join(key_words[:4]) if key_words else ''

        # Enhanced tone detection based on full content
        if any(k in lower for k in ['sad', 'down', 'lonely', 'anxious', 'anxiety', 'stress', 'stressed', 'worried', 'depressed', 'hopeless']):
            ack = "It sounds like you're carrying a lot right now."
        elif any(k in lower for k in ['angry', 'mad', 'frustrat', 'annoyed', 'irritated']):
            ack = "Your frustration comes through — that's valid."
        elif any(k in lower for k in ['happy', 'grateful', 'excited', 'hopeful']):
            ack = "It's great to hear some positive feelings too."
        elif any(k in lower for k in ['confused', 'lost', 'unsure', 'dont know']):
            ack = "It's okay to feel uncertain — many people do."
        else:
            ack = "Thanks for sharing — I'm listening."

        # Domain hints for more specific next-step guidance
        domain = None
        if any(k in lower for k in ['exam','exams','test','tests','school','teacher','class','homework','assignment']):
            domain = 'school'
        elif any(k in lower for k in ['friend','friends','alone','bully','bullying','relationship']):
            domain = 'social'
        elif any(k in lower for k in ['parent','parents','mom','dad','family','home']):
            domain = 'family'
        elif any(k in lower for k in ['panic','anxiety','overwhelmed','worry']):
            domain = 'anxiety'

        def domain_next_step() -> str:
            if domain == 'school':
                return "One gentle next step: write one sentence about what would make school feel a little safer or easier this week."
            if domain == 'social':
                return "Consider one small connection you might want — a message to a friend or a question you'd like to ask."
            if domain == 'family':
                return "If you're comfortable, name one feeling you'd like your family to understand about your situation."
            if domain == 'anxiety':
                return "Try a grounding step: describe one sensation you notice (sight, sound, touch) and how it affects you."
            return "One gentle next step: write one sentence about what support would feel helpful."

        def domain_question() -> str:
            if domain == 'school':
                return "What's one small change at school that might help you breathe a bit easier?"
            if domain == 'social':
                return "Is there someone you'd feel okay reaching out to, even with a short message?"
            if domain == 'family':
                return "If you could tell your family one sentence about how you're feeling, what would it be?"
            if domain == 'anxiety':
                return "When anxiety rises, what helps even a tiny bit — breath, movement, or a reassuring thought?"
            return "If you'd like, what support would feel helpful right now?"

        # Dynamic tips based on content length and mode
        if mode == 'write':
            tips = [
                "It's okay to be brief — start with one thought.",
                (f"I'm noticing '{key_phrases}' — would you like to say a bit more?" if key_phrases else "Share feelings, not just events."),
                "Write as if to a caring friend — no need to be perfect."
            ]
            question = domain_question()
        elif mode == 'rephrase':
            # Acknowledge phrasing variety by hashing recent text
            ack_templates = [
                "It sounds like you're carrying a lot right now.",
                "I hear the weight in what you're sharing.",
                "Thank you for trusting us with this — it's a lot to hold."
            ]
            ack = ack_templates[abs(hash(recent)) % len(ack_templates)]
            tips = [
                ack,
                (f"I'm noticing '{key_phrases}' — would you like to say a bit more about that?" if key_phrases else "Reflect one small detail that matters to you."),
                "Try softening strong words and stating the feeling + request."
            ]
            question = "What would be a kinder, clearer way to say what you mean?"
        else:
            ack_templates = [
                ack,
                "Thanks for sharing — I'm listening.",
                "You're not alone in feeling this way; I'm here with you."
            ]
            ack = ack_templates[abs(hash(recent)) % len(ack_templates)]
            if len(text) < 50:
                tips = [
                    ack,
                    (f"I'm noticing '{key_phrases}' — would you like to say a bit more?" if key_phrases else "Reflect one small detail that matters to you."),
                    domain_next_step()
                ]
            elif len(text) < 150:
                tips = [
                    ack,
                    (f"I'm noticing '{key_phrases}' — would you like to say a bit more?" if key_phrases else "Reflect one small detail that matters to you."),
                    ("Consider sharing how this situation is affecting you emotionally." if domain is None else domain_next_step())
                ]
            else:
                tips = [
                    ack,
                    "You've shared quite a bit — that's brave.",
                    domain_next_step()
                ]

            question = domain_question()

        return tips, question

    # API: Gentle AI coach for writing guidance (does not change user's words)
    @app.route('/api/coach', methods=['POST'])
    def api_coach():
        try:
            payload = request.get_json(silent=True) or {}
            content = (payload.get('content') or '').strip()
            mode = (payload.get('mode') or 'reply').strip()  # 'reply' | 'rephrase' | 'write'

            app.logger.info(f"Coach API called: content='{content[:50]}...', mode={mode}")

            # Baseline dynamic tips
            tips, question = _heuristic_coach_suggestions(content, mode)

            # Prefer Gemini when available; emphasize most-recent lines but include full context
            _api_key_present = bool(app.config.get('GEMINI_API_KEY') or os.getenv('GEMINI_API_KEY'))
            if _api_key_present and content:
                try:
                    recent = content[-600:]
                    letter_ctx = (payload.get('letter') or '')[:4000]
                    if mode == 'rephrase':
                        prompt = (
                            "You are a gentle rephrasing guide for the E.C.H.O.E. platform.\n"
                            "Task: Offer guidance so the WRITER can rephrase their own words respectfully.\n"
                            "Rules: Never rewrite text; give coaching prompts only.\n"
                            "Output EXACTLY 3 short, actionable bullet tips (no intro/outro), <= 18 words each.\n"
                            f"Original letter (context for issues):\n'''{letter_ctx}'''\n\n"
                            f"Reviewer notes / latest typing (focus):\n'''{recent}'''\n"
                        )
                    elif mode == 'write':
                        prompt = (
                            "You are a gentle, non-judgmental writing coach for the E.C.H.O.E. platform.\n"
                            "Task: Kindly guide the WRITER with soft, collaborative suggestions.\n"
                            "Tone: warm, supportive, never corrective; avoid judgment, avoid teacher-like phrasing.\n"
                            "Style: use hedging like 'you might', 'perhaps', 'if you'd like', 'could'.\n"
                            "Rules: Do NOT rewrite their words; give coaching prompts only.\n"
                            "Output 3-4 short bullet tips (no intro/outro), <= 18 words each.\n"
                            f"What they've written so far (full context):\n'''{letter_ctx}'''\n\n"
                            f"Latest typing (focus first):\n'''{recent}'''\n"
                        )
                    else:  # reply
                        prompt = (
                            "You are a gentle reply coach for E.C.H.O.E. volunteers.\n"
                            "Task: Offer soft, practical prompts that help craft an empathetic reply.\n"
                            "Tone: kind, collaborative, not directive; avoid judging or sounding like a teacher.\n"
                            "Style: use hedging like 'you could', 'perhaps', 'consider', 'one option is'.\n"
                            "Rules: Do NOT write the reply; give coaching prompts only.\n"
                            "Output 3-4 short bullet tips (no intro/outro), <= 18 words each.\n"
                            f"Original letter (reader context):\n'''{letter_ctx}'''\n\n"
                            f"Volunteer draft / latest typing (focus):\n'''{recent}'''\n"
                        )
                    api_key = app.config.get('GEMINI_API_KEY') or os.getenv('GEMINI_API_KEY')
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
                    payload = {"contents": [{"parts": [{"text": prompt}]}], "generationConfig": {"temperature": 0.6, "topP": 0.9}}
                    with httpx.Client(timeout=15) as client:
                        resp = client.post(url, json=payload)
                        data = resp.json()
                    ai_text = None
                    if isinstance(data, dict) and data.get('candidates'):
                        ai_text = " ".join([p.get('text','') for p in data['candidates'][0]['content']['parts']]).strip()
                    ai_tips = []
                    if ai_text:
                        lines = [ln.strip() for ln in ai_text.splitlines() if ln.strip()]
                        for ln in lines:
                            if ln.startswith(('- ', '• ', '* ', '– ')) or re.match(r"^\d+[\).]\s", ln):
                                cleaned = re.sub(r"^(?:[-•*–]\s|\d+[\).]\s)", '', ln).strip()
                                if cleaned:
                                    ai_tips.append(cleaned)
                        if not ai_tips and '•' in ai_text:
                            ai_tips = [seg.strip() for seg in ai_text.split('•') if seg.strip()]
                    if ai_tips:
                        tips = ai_tips[:4]
                except Exception as e:
                    app.logger.warning(f"Gemini coach call failed: {e}")

            # Return up to 4 bullets to support denser guidance
            return jsonify({'tips': tips[:4], 'question': question})
        except Exception as e:
            app.logger.error(f"api_coach error: {e}")
            # Fallback even on error
            tips, question = _heuristic_coach_suggestions(content, mode)
            return jsonify({'tips': tips[:4], 'question': question}), 200

    # --- Moderation helpers ---
    def _normalize_for_moderation(text: str) -> tuple[str, str]:
        """Return (simple_norm, ascii_norm) for leetspeak/spacing obfuscation checks."""
        t = (text or '').lower()
        # Replace common leetspeak digits
        t = (t
             .replace('0', 'o')
             .replace('1', 'i')
             .replace('3', 'e')
             .replace('4', 'a')
             .replace('5', 's')
             .replace('7', 't')
             .replace('8', 'b'))
        # Remove non-letters/digits to defeat inserted punctuation/spaces
        simple = re.sub(r"[^\w\u0080-\uffff]+", "", t)
        # Collapse 3+ repeats to 2
        simple = re.sub(r"(.)\1{2,}", r"\1\1", simple)
        try:
            import unicodedata
            ascii_norm = unicodedata.normalize('NFKD', simple).encode('ascii', 'ignore').decode('ascii')
        except Exception:
            ascii_norm = simple
        return simple, ascii_norm

    def _deterministic_match(text: str) -> tuple[bool, str]:
        lower = (text or '').lower()
        simple, ascii_norm = _normalize_for_moderation(text)
        # Core categories across languages (stems/keywords)
        hard_keywords = [
            # Self-harm / suicide (multi-lang, stems)
            'suicide','selfharm','endmylife','hangmyself','overdose','kms','killmyself',
            'tuersoi','seppuku','suicidio','suicidar','suicidarse','suicid', 'самоубий', 'суицид', '죽다', '自杀', '自殺', '自殺',
            # Threats / violence
            'killyou','shoot','bomb','terrorist','execute','stab','toten','toten','tuer','matar','убью','殺す','korosu','杀了你','죽여',
            # Sexual violence
            'rape','rapist','vergewaltig','viol', 'violar','강간','レイプ','强奸','اغتصاب',
            # Doxxing / illegal
            'dox','leakaddress','creditcard','ssn','socialsecurity',
            # Hate slurs/profanity (representative; not exhaustive)
            'nigger','faggot','kike','chink','spic','retard','tranny',
            'puta','pendejo','mierda','cabron','putain','salope','encule','merde','scheisse','arschloch','hurensohn',
            'blyat','suka','сука','бляд',
            'fuck','motherfucker','cunt','shit','bitch','asshole',
            '操','傻逼','妈的','去死','滚','垃圾',
            '死ね','くそ','畜生',
            '씨발','좆','병신'
        ]
        haystacks = [lower, simple, ascii_norm]
        for kw in hard_keywords:
            for h in haystacks:
                if kw in h:
                    return True, kw
        return False, ''

    def ai_moderate_letter_content(text: str) -> tuple[bool, str]:
        """Return (flagged, reason). Deterministic scan first, then AI JSON (multi‑lingual)."""
        flagged_kw, kw = _deterministic_match(text)
        if flagged_kw:
            return True, f"keyword: {kw}"
        try:
            prompt = (
                "You are a strict but fair community safety checker. The text may be in ANY language.\n"
                "Decide if it should be suspended for admin review before volunteers see it.\n"
                "Reasons: hate/harassment, self-harm intent, explicit sexual content, doxxing, threats, spam/scams, minors sexual content, or severe profanity.\n"
                "Be robust to obfuscation: leetspeak (e.g., 5u1c1d3), repeated letters, inserted punctuation/spaces, transliteration, and emojis implying violence/sex.\n"
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
            recaptcha_site_key = app.config.get('RECAPTCHA_SITE_KEY')
            recaptcha_secret = app.config.get('RECAPTCHA_SECRET')

            # Basic IP-level rate limit to protect against automated abuse
            client_ip = (request.headers.get('X-Forwarded-For', request.remote_addr or '') or '').split(',')[0].strip()
            if _ip_limited(client_ip):
                flash('We are receiving a lot of traffic from your network. Please wait a minute and try again.', 'info')
                return render_template('submit.html', form=form, mailboxes=mailboxes,
                                       recaptcha_site_key=recaptcha_site_key)
            
            if form.validate_on_submit():
                # Best-effort Google reCAPTCHA v3 verification. To avoid blocking
                # legitimate letters when the widget/script fails, we treat missing
                # or unverifiable tokens as a soft signal rather than a hard error.
                if recaptcha_site_key and recaptcha_secret:
                    token = request.form.get('g-recaptcha-response')
                    if token:
                        try:
                            verify_resp = requests.post(
                                'https://www.google.com/recaptcha/api/siteverify',
                                data={
                                    'secret': recaptcha_secret,
                                    'response': token,
                                    'remoteip': client_ip,
                                },
                                timeout=5
                            )
                            data = {}
                            try:
                                data = verify_resp.json()
                            except Exception:
                                data = {}
                            if not data.get('success'):
                                logger.warning('reCAPTCHA check did not pass for submit; proceeding with other anti‑spam gates.')
                        except Exception as ce:
                            logger.warning(f'reCAPTCHA verification error (submit, non‑blocking): {ce}')

                # Prepare submit context and de-duplicate / rate‑limit posts
                content_clean = (form.content.data or '').strip()
                anon_cookie = request.cookies.get('echoe_anon')
                if not anon_cookie:
                    anon_cookie = str(uuid.uuid4()).replace('-', '')

                # Soft rate‑limit: prevent macros from sending many letters in a short burst
                # by the same anonymous user. This uses the existing anonymous ID cookie
                # (no extra identifying info) and a short time window.
                spam_window = datetime.utcnow() - timedelta(minutes=2)
                recent_count = (
                    Letter.query
                    .filter(Letter.anon_user_id == anon_cookie)
                    .filter(Letter.created_at >= spam_window)
                    .count()
                )
                if recent_count >= 5:
                    flash('You are sending letters very quickly. Please take a short break and try again in a few minutes.', 'info')
                    return redirect(url_for('submit'))

                # Block duplicates submitted within the last 3 minutes by same anon user and same content
                recent_window = datetime.utcnow() - timedelta(minutes=3)
                existing = (
                    Letter.query
                    .filter(Letter.anon_user_id == anon_cookie)
                    .filter(Letter.created_at >= recent_window)
                    .filter(Letter.content == content_clean)
                    .order_by(Letter.created_at.desc())
                    .first()
                )
                if existing:
                    flash('Looks like you already sent this letter. We saved your original submission.', 'info')
                    resp = make_response(redirect(url_for('confirmation', letter_id=existing.unique_id)))
                    resp.set_cookie('echoe_anon', anon_cookie, max_age=60*60*24*730, httponly=True, samesite='Lax', secure=True)
                    return resp

                # Create new letter
                letter = Letter(
                    title=None,
                    topic=form.topic.data,
                    content=content_clean,
                    reply_method=form.reply_method.data,
                    anonymous_email=form.anonymous_email.data if form.reply_method.data == 'anonymous-email' else None
                )
                letter.anon_user_id = anon_cookie
                
                # Save to database (but decide moderation status first)
                flagged, reason = ai_moderate_letter_content(letter.content)
                letter.is_flagged = True if flagged else False
                letter.moderation_reason = reason
                letter.moderation_checked = True
                db.session.add(letter)
                # Ensure the letter has an id/unique_id persisted before redirect
                db.session.flush()
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
                # Commit after possible title generation to ensure unique_id is saved
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
                resp = make_response(render_template('submit.html', form=form, mailboxes=mailboxes,
                                                     recaptcha_site_key=recaptcha_site_key))
                resp.set_cookie('echoe_anon', anon_cookie, max_age=60*60*24*730, httponly=True, samesite='Lax', secure=True)
                return resp
            return render_template('submit.html', form=form, mailboxes=mailboxes,
                                  recaptcha_site_key=recaptcha_site_key)
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
        
        # Create a form for each response to allow replies
        form = UserReplyForm()
        
        # Get user replies for each response
        response_replies = {}
        for response in responses:
            response_replies[response.id] = response.user_replies.order_by(UserReply.created_at).all()
        
        return render_template('response.html', 
                             letter=letter, 
                             responses=responses, 
                             form=form,
                             response_replies=response_replies)

    # Route: Submit user reply to a volunteer response
    @app.route('/response/<int:response_id>/reply', methods=['POST'])
    def submit_user_reply(response_id):
        """Allow users to reply to volunteer responses"""
        try:
            response_obj = Response.query.get_or_404(response_id)
            letter = response_obj.letter
            
            # Verify the user is the owner of the letter
            anon_cookie = request.cookies.get('echoe_anon')
            if not anon_cookie or letter.anon_user_id != anon_cookie:
                flash('You can only reply to responses on your own letters.', 'error')
                return redirect(url_for('index'))
            
            form = UserReplyForm()
            if form.validate_on_submit():
                user_reply = UserReply(
                    content=form.content.data,
                    response_id=response_id,
                    letter_id=letter.id,
                    anon_user_id=anon_cookie
                )
                db.session.add(user_reply)
                db.session.commit()
                
                flash('Your reply has been sent to the volunteer!', 'success')
                # Redirect back to inbox thread instead of separate response page
                return redirect(url_for('inbox_letter', letter_id=letter.unique_id))
            
            # If form validation fails, redirect back with error
            for field, errors in form.errors.items():
                for error in errors:
                    flash(f'{error}', 'error')
            return redirect(url_for('inbox_letter', letter_id=letter.unique_id))
        except Exception as e:
            logger.error(f"Error submitting user reply: {str(e)}")
            flash('An error occurred while submitting your reply. Please try again.', 'error')
            return redirect(url_for('inbox'))

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
        
        # Create a form for replies
        form = UserReplyForm()
        
        # Get user replies for each response
        response_replies = {}
        for response in responses:
            response_replies[response.id] = response.user_replies.order_by(UserReply.created_at).all()
        
        return render_template('inbox_thread.html', 
                             letter=letter, 
                             responses=responses, 
                             is_owner=is_owner,
                             response_replies=response_replies,
                             form=form)

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
        
        # Find letters with unread user replies
        letters_with_unread_replies = []
        processed_letters = Letter.query.filter(Letter.is_processed == True).all()
        for letter in processed_letters:
            total_unread = 0
            last_activity = None
            for response in letter.responses:
                unread_count = response.user_replies.filter_by(is_read=False).count()
                total_unread += unread_count
                # Get the most recent user reply timestamp
                latest_reply = response.user_replies.order_by(UserReply.created_at.desc()).first()
                if latest_reply and (not last_activity or latest_reply.created_at > last_activity):
                    last_activity = latest_reply.created_at
            
            if total_unread > 0:
                letters_with_unread_replies.append({
                    'letter': letter,
                    'unread_count': total_unread,
                    'last_activity': last_activity or letter.created_at
                })
        
        # Volunteers no longer see flagged letters at all
        return render_template('volunteer/dashboard.html', 
                              unprocessed_letters=unprocessed_letters,
                              letters_with_unread_replies=letters_with_unread_replies)

    # Volunteer route: Respond to letter
    @app.route('/volunteer/letter/<letter_id>', methods=['GET', 'POST'])
    @volunteer_required
    def respond_to_letter(letter_id):
        
        letter = Letter.query.filter_by(unique_id=letter_id).first_or_404()
        previous_responses = letter.responses.order_by(Response.created_at).all()
        
        # Mark all user replies as read when volunteer views this letter
        for response in previous_responses:
            for user_reply in response.user_replies.all():
                if not user_reply.is_read:
                    user_reply.is_read = True
        db.session.commit()

        form = ResponseForm()
        if form.validate_on_submit():
        recaptcha_site_key = app.config.get('RECAPTCHA_SITE_KEY')
        recaptcha_secret = app.config.get('RECAPTCHA_SECRET')

        if form.validate_on_submit():
            # Best-effort reCAPTCHA v3 check for volunteer responses. Missing/failed
            # tokens are logged but do not block responses; other guards still apply.
            if recaptcha_site_key and recaptcha_secret:
                token = request.form.get('g-recaptcha-response')
                if token:
                    client_ip = (request.headers.get('X-Forwarded-For', request.remote_addr or '') or '').split(',')[0].strip()
                    try:
                        verify_resp = requests.post(
                            'https://www.google.com/recaptcha/api/siteverify',
                            data={
                                'secret': recaptcha_secret,
                                'response': token,
                                'remoteip': client_ip,
                            },
                            timeout=5
                        )
                        data = {}
                        try:
                            data = verify_resp.json()
                        except Exception:
                            data = {}
                        if not data.get('success'):
                            logger.warning('reCAPTCHA check did not pass for volunteer response; proceeding with other guards.')
                    except Exception as ce:
                        logger.warning(f'reCAPTCHA verification error (volunteer respond, non‑blocking): {ce}')

            # Basic duplicate‑submission guard: if the most recent human/hybrid
            # response for this letter has identical content and was created very
            # recently, treat this as an accidental re‑submit instead of creating
            # another response (which can overload AI + UI).
            cleaned_content = (form.content.data or '').strip()
            recent_cutoff = datetime.utcnow() - timedelta(minutes=2)
            last_same = (Response.query
                         .filter(
                             Response.letter_id == letter.id,
                             Response.response_type.in_(['human', 'hybrid']),
                             Response.created_at >= recent_cutoff)
                         .order_by(Response.created_at.desc())
                         .first())
            if last_same and (last_same.content or '').strip() == cleaned_content:
                flash('This response was just sent. To avoid duplicates, it was not sent again.', 'info')
                return redirect(url_for('volunteer_dashboard'))

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
        
        return render_template('volunteer/respond.html',
                               letter=letter,
                               existing_responses=previous_responses,
                               form=form,
                               recaptcha_site_key=recaptcha_site_key)

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
        # Legacy page replaced by the new overview
        return redirect(url_for('events_overview'))

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
        """Unified moderation for chat/API using deterministic + AI (multilingual)."""
        flagged, reason = ai_moderate_letter_content(content)
        if flagged:
            return {
                'status': 'flagged',
                'message': "I notice something potentially harmful or unsafe. If you're in crisis, please call your local crisis line. In Canada: 1-833-456-4566 or text 45645.",
                'reason': reason
            }
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
        return redirect(url_for('helplines'))

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

    # --- New public pages ---
    @app.route('/risk-protective-factors')
    def risk_protective_factors():
        return render_template('risk_protective.html')

    @app.route('/helplines')
    def helplines():
        return render_template('helplines.html')

    @app.route('/calendar')
    def calendar_page():
        return render_template('calendar.html')

    @app.route('/events-overview')
    def events_overview():
        return render_template('events_overview.html')

    # Social Media Campaigns
    @app.route('/campaigns/feel-good-friday')
    def campaign_feel_good_friday():
        return render_template('campaigns/feel_good_friday.html')

    @app.route('/campaigns/recharge-week')
    def campaign_recharge_week():
        return render_template('campaigns/recharge_week.html')

    @app.route('/campaigns/holiday-messages')
    def campaign_holiday_messages():
        return render_template('campaigns/holiday_messages.html')

    @app.route('/campaigns/echo-of-the-month')
    def campaign_echo_of_month():
        return render_template('campaigns/echo_of_the_month.html')

    @app.route('/campaigns/echo-message')
    def campaign_echo_message():
        return render_template('campaigns/echo_message.html')

    @app.route('/campaigns/monthly-trivia')
    def campaign_monthly_trivia():
        return render_template('campaigns/monthly_trivia.html')

    @app.route('/campaigns/playlist')
    def campaign_playlist():
        return render_template('campaigns/playlist.html')

    @app.route('/campaigns/podcast')
    def campaign_podcast():
        return render_template('campaigns/podcast.html')

    @app.route('/research-study')
    def research_study():
        return render_template('research_study.html')

    @app.route('/next-steps')
    def next_steps():
        return render_template('next_steps.html')

    @app.route('/meet-the-team')
    def meet_the_team():
        return render_template('team.html')

    @app.route('/join')
    def join():
        return render_template('join.html')

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
        unprocessed_letters = Letter.query.filter_by(is_processed=False).order_by(Letter.created_at.desc()).all()
        processed_letters = Letter.query.filter_by(is_processed=True).order_by(Letter.created_at.desc()).all()
        
        total_letters = Letter.query.count()
        
        return render_template('admin/content.html',
                             letters=letters,
                             responses=responses,
                             posts=posts,
                             events=events,
                             flagged_letters=flagged_letters,
                             unprocessed_letters=unprocessed_letters,
                             processed_letters=processed_letters,
                             total_letters=total_letters)

    @app.route('/admin/letters/<letter_id>/delete', methods=['POST'])
    @admin_required
    def admin_delete_letter(letter_id):
        """Delete a letter (admin only)"""
        try:
            letter = Letter.query.filter_by(unique_id=letter_id).first_or_404()
            
            # Delete all associated data in correct order to avoid foreign key violations
            # 1. Delete all user replies to responses on this letter
            for response in letter.responses:
                UserReply.query.filter_by(response_id=response.id).delete()
            
            # 2. Delete all responses to this letter
            Response.query.filter_by(letter_id=letter.id).delete()
            
            # 3. Delete the letter itself
            db.session.delete(letter)
            db.session.commit()
            
            flash('Letter and all associated responses have been deleted.', 'success')
            return redirect(url_for('admin_content'))
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error deleting letter {letter_id}: {str(e)}")
            flash('An error occurred while deleting the letter. Please try again.', 'error')
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

    @app.route('/admin/letters/bulk-delete', methods=['POST'])
    @admin_required
    def admin_bulk_delete_letters():
        """Bulk delete letters: selected, all, or all except selected."""
        try:
            action = (request.form.get('action') or '').strip()
            selected_ids = request.form.getlist('selected_letters') or []

            # Determine target queryset
            letters_to_delete = []
            if action == 'delete_selected':
                if not selected_ids:
                    flash('No letters selected.', 'error')
                    return redirect(url_for('admin_content'))
                letters_to_delete = Letter.query.filter(Letter.unique_id.in_(selected_ids)).all()
            elif action == 'delete_all':
                letters_to_delete = Letter.query.all()
            elif action == 'delete_all_except':
                letters_to_delete = Letter.query.filter(~Letter.unique_id.in_(selected_ids)).all()
            else:
                flash('Invalid action.', 'error')
                return redirect(url_for('admin_content'))

            # Perform deletions including associated responses and user replies
            deleted_count = 0
            for letter in letters_to_delete:
                for response in letter.responses:
                    UserReply.query.filter_by(response_id=response.id).delete()
                Response.query.filter_by(letter_id=letter.id).delete()
                db.session.delete(letter)
                deleted_count += 1
            db.session.commit()

            flash(f'Deleted {deleted_count} letter(s).', 'success')
            return redirect(url_for('admin_content'))
        except Exception as e:
            db.session.rollback()
            logger.error(f"Bulk delete error: {str(e)}")
            flash('An error occurred while performing bulk delete.', 'error')
            return redirect(url_for('admin_content'))

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

    # Health check for frontend widget
    @app.route('/api/health')
    def api_health():
        return jsonify({'status': 'ok'}), 200

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
        # Avoid printing credentials
        _uri = app.config['SQLALCHEMY_DATABASE_URI']
        _safe_uri = _uri
        try:
            if '://' in _uri and '@' in _uri:
                scheme, rest = _uri.split('://', 1)
                if '@' in rest:
                    creds, hostpart = rest.split('@', 1)
                    _safe_uri = f"{scheme}://****:****@{hostpart}"
        except Exception:
            pass
        logger.info(f"Database URI: {_safe_uri}")
        logger.info(f"Instance folder: {app.instance_path}")
        socketio.run(app, debug=True, use_reloader=False)

except Exception as e:
    logger.error("Error during application startup:")
    logger.error(traceback.format_exc())
    sys.exit(1) 