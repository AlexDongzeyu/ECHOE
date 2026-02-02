"""
PROJECT: ECHOE Mental Health Digital Platform
AUTHOR: Alex Dong (Founder and Lead IT Developer)
LICENSE: GNU General Public License v3.0

Copyright (c) 2026 Alex Dong. All Rights Reserved.
This file is part of the ECHOE project. Unauthorized removal of
author credits is a violation of the GPL license.
"""

import os
from sqlalchemy.pool import NullPool

class Config:
    # Security configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-please-change-in-production'
    
    # Database configuration
    basedir = os.path.abspath(os.path.dirname(__file__))
    _env_db_url = os.environ.get('DATABASE_URL')
    # Normalize legacy postgres scheme if present
    if _env_db_url and _env_db_url.startswith('postgres://'):
        _env_db_url = _env_db_url.replace('postgres://', 'postgresql+psycopg2://', 1)
    SQLALCHEMY_DATABASE_URI = _env_db_url or 'sqlite:///' + os.path.join(basedir, 'instance', 'database.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Use a safe engine configuration for SQLite under async/eventlet workers
    if SQLALCHEMY_DATABASE_URI.startswith('sqlite'):
        SQLALCHEMY_ENGINE_OPTIONS = {
            'poolclass': NullPool,
            'connect_args': {
                'check_same_thread': False,
            },
        }
    
    # Email configuration (if needed)
    MAIL_SERVER = os.environ.get('MAIL_SERVER')
    MAIL_PORT = os.environ.get('MAIL_PORT')
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS')
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    
    # AI API configuration
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY') 

    # Anti-abuse / CAPTCHA (optional)
    # Google reCAPTCHA v2 checkbox keys – prefer environment variables; these can be
    # overridden in production without changing code.
    RECAPTCHA_SITE_KEY = os.environ.get('RECAPTCHA_SITE_KEY') or "6LepaRosAAAAACZ8xG4DPq0iz-YiWvOEiYOv_ZsZ"
    RECAPTCHA_SECRET = os.environ.get('RECAPTCHA_SECRET') or "6LepaRosAAAAAE4yLJFalKc-r5lvfVCNawQNp-Fk"