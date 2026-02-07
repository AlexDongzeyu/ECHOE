"""
Vercel entrypoint.

Vercel's Python runtime expects a module-level `app` for WSGI frameworks
(Flask). Our Flask code lives under the historical `NPO-SCA/` folder, so we
extend `sys.path` to import it cleanly.
"""

import os
import sys


BASE_DIR = os.path.dirname(os.path.dirname(__file__))
APP_DIR = os.path.join(BASE_DIR, "NPO-SCA")

# Ensure `import app` resolves to `NPO-SCA/app.py`
if APP_DIR not in sys.path:
    sys.path.insert(0, APP_DIR)

from app import app as app  # noqa: E402,F401

