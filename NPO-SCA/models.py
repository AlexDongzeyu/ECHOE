from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import enum

db = SQLAlchemy()

class UserRole(enum.Enum):
    USER = "USER"
    ADMIN = "ADMIN"
    ULTIMATE_ADMIN = "ULTIMATE_ADMIN"

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True)
    email = db.Column(db.String(120), unique=True)
    password_hash = db.Column(db.String(128))
    
    # New role-based system
    role = db.Column(db.Enum(UserRole), default=UserRole.USER, nullable=False)
    
    # Keep for backward compatibility during transition
    is_volunteer = db.Column(db.Boolean, default=False)
    is_admin = db.Column(db.Boolean, default=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 关系
    letters_responded = db.relationship('Letter', backref='responder', lazy='dynamic')
    posts = db.relationship('Post', backref='author', lazy='dynamic')
    
    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    # Role checking methods
    def is_user(self):
        return self.role == UserRole.USER
    
    def is_administrator(self):
        return self.role == UserRole.ADMIN
    
    def is_ultimate_administrator(self):
        return self.role == UserRole.ULTIMATE_ADMIN
    
    def has_admin_access(self):
        """Check if user has admin-level access (ADMIN or ULTIMATE_ADMIN)"""
        return self.role in [UserRole.ADMIN, UserRole.ULTIMATE_ADMIN]
    
    def can_manage_users(self):
        """Check if user can manage other users (only ULTIMATE_ADMIN)"""
        return self.role == UserRole.ULTIMATE_ADMIN
    
    def get_role_display(self):
        """Get human-readable role name"""
        role_names = {
            UserRole.USER: "User",
            UserRole.ADMIN: "Administrator", 
            UserRole.ULTIMATE_ADMIN: "Ultimate Administrator"
        }
        return role_names.get(self.role, "Unknown")
    
    def __repr__(self):
        return f'<User {self.username} ({self.role.value})>'


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    body = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<Post {self.title}>'


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    objective = db.Column(db.Text, nullable=False)
    event_date = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    structure = db.Column(db.Text)
    registration_link = db.Column(db.String(200))

    def __repr__(self):
        return f'<Event {self.title}>'


class Letter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    unique_id = db.Column(db.String(36), unique=True, default=lambda: str(uuid.uuid4()))
    topic = db.Column(db.String(100))
    content = db.Column(db.Text, nullable=False)
    anonymous_email = db.Column(db.String(120))
    reply_method = db.Column(db.String(20))
    # Anonymous user linkage (persistent but anonymous)
    anon_user_id = db.Column(db.String(64), index=True)
    has_unread = db.Column(db.Boolean, default=False)
    
    # 状态标记
    is_flagged = db.Column(db.Boolean, default=False)
    is_processed = db.Column(db.Boolean, default=False)
    
    # 时间戳
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    
    # 来源
    source = db.Column(db.String(20), default='online')  # 'online' or 'physical'
    location = db.Column(db.String(100))  # 适用于物理信件
    
    # 关系
    responder_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    responses = db.relationship('Response', backref='letter', lazy='dynamic')
    
    def __repr__(self):
        return f'<Letter {self.unique_id}>'


class Response(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 回复类型
    response_type = db.Column(db.String(20))  # 'human', 'ai', 'hybrid'
    
    # 关系
    letter_id = db.Column(db.Integer, db.ForeignKey('letter.id'), nullable=False)
    
    # AI 元数据
    ai_model = db.Column(db.String(50))
    moderation_score = db.Column(db.Float)
    
    def __repr__(self):
        return f'<Response to {self.letter_id}>'


class PhysicalMailbox(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    province = db.Column(db.String(50), nullable=False)
    postal_code = db.Column(db.String(20))
    description = db.Column(db.Text)
    operating_hours = db.Column(db.String(200))
    status = db.Column(db.String(20), default='active')  # 'active', 'inactive', 'pending'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Mailbox {self.name} - {self.city}>' 