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