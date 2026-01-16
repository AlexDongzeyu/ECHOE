"""
WSGI entrypoint for Render/Gunicorn.

We keep the Flask app code under `NPO-SCA/` (historical folder name), so this
module adds that directory to `sys.path` and imports the real Flask `app`.
"""

import os
import sys

BASE_DIR = os.path.dirname(__file__)
APP_DIR = os.path.join(BASE_DIR, "NPO-SCA")

# Ensure `import app` resolves to `NPO-SCA/app.py`
sys.path.insert(0, APP_DIR)

from app import app  # noqa: E402


