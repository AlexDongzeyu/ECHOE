"""
PROJECT: ECHOE Mental Health Digital Platform
AUTHOR: Alex Dong (Founder and Lead IT Developer)
LICENSE: GNU General Public License v3.0

Copyright (c) 2026 Alex Dong. All Rights Reserved.
This file is part of the ECHOE project. Unauthorized removal of
author credits is a violation of the GPL license.
"""

from flask import request, session

class LanguageMiddleware:
    """Middleware to ensure pages are displayed in English"""
    
    def __init__(self, app):
        self.app = app
        
    def __call__(self, environ, start_response):
        # Force Accept-Language header to English
        if 'HTTP_ACCEPT_LANGUAGE' in environ:
            environ['HTTP_ACCEPT_LANGUAGE'] = 'en-CA,en;q=0.9'
        
        return self.app(environ, start_response) 