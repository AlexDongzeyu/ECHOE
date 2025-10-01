import os
import sys
from flask import Flask

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'NPO-SCA'))

from app import app, db  # type: ignore

def ensure_sqlite_dirs():
    uri = app.config.get('SQLALCHEMY_DATABASE_URI', '')
    if uri.startswith('sqlite:///'):
        path = uri.replace('sqlite:///', '')
        d = os.path.dirname(path)
        if d and not os.path.exists(d):
            os.makedirs(d, exist_ok=True)

def run():
    ensure_sqlite_dirs()
    with app.app_context():
        # Use Flask-Migrate if migration repo exists; otherwise, safe create_all
        try:
            from flask_migrate import upgrade
            upgrade()  # no args uses head
            print('Applied database migrations (alembic upgrade head).')
        except Exception as e:
            print(f'No migrations or upgrade failed: {e}. Falling back to create_all.')
            db.create_all()
            print('Ensured tables via create_all().')

if __name__ == '__main__':
    run()


