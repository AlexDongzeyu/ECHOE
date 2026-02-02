"""
PROJECT: ECHOE Mental Health Digital Platform
AUTHOR: Alex Dong (Co-Founder and Lead IT Developer)
LICENSE: GNU General Public License v3.0

Copyright (c) 2026 Alex Dong. All Rights Reserved.
This file is part of the ECHOE project. Unauthorized removal of
author credits is a violation of the GPL license.
"""

from functools import wraps
from flask import abort, flash, redirect, url_for
from flask_login import current_user
from models import UserRole

def admin_required(f):
    """Decorator to require admin access (ADMIN or ULTIMATE_ADMIN)"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            flash('Please log in to access this page.', 'error')
            return redirect(url_for('login'))
        
        if not current_user.has_admin_access():
            flash('Access denied. Administrator privileges required.', 'error')
            abort(403)
        
        return f(*args, **kwargs)
    return decorated_function

def ultimate_admin_required(f):
    """Decorator to require ultimate admin access (ULTIMATE_ADMIN only)"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            flash('Please log in to access this page.', 'error')
            return redirect(url_for('login'))
        
        if not current_user.can_manage_users():
            flash('Access denied. Ultimate Administrator privileges required.', 'error')
            abort(403)
        
        return f(*args, **kwargs)
    return decorated_function

def volunteer_required(f):
    """Decorator to require volunteer access (for backward compatibility)"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            flash('Please log in to access this page.', 'error')
            return redirect(url_for('login'))
        
        # Allow if user has admin access OR is a volunteer
        if not (current_user.has_admin_access() or current_user.is_volunteer):
            flash('Access denied. Volunteer privileges required.', 'error')
            abort(403)
        
        return f(*args, **kwargs)
    return decorated_function
