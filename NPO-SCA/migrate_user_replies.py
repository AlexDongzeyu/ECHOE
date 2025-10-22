"""
Migration script to add user_reply table
Run this once to update the database schema
"""
from app import app
from models import db

def migrate():
    with app.app_context():
        # This will create the user_reply table if it doesn't exist
        db.create_all()
        print("✅ Database migration complete - user_reply table created!")

if __name__ == '__main__':
    migrate()

