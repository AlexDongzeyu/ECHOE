#!/usr/bin/env python3
"""
Script to create a user account in the Postgres database
"""
import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from werkzeug.security import generate_password_hash

# Add the NPO-SCA directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'NPO-SCA'))

# Database connection
DATABASE_URL = "postgresql://echoe:ubYSOYesPdHjkfz9pwkLdEvKTJ3pUXn5@dpg-d3pf6ml6ubrc73f48fs0-a.oregon-postgres.render.com/echoe"

def create_user():
    print("🔍 Connecting to database...")
    try:
        # Create engine and session
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind=engine)
        session = Session()
        print("✅ Connected to database")
        
        # Check if user already exists
        print("🔍 Checking if user exists...")
        result = session.execute(text("SELECT id FROM \"user\" WHERE email = :email"), 
                                {"email": "dongzeyu123@outlook.com"})
        existing_user = result.fetchone()
        if existing_user:
            print("✅ User already exists: dongzeyu123@outlook.com")
            return
        
        # Create user
        print("🔍 Creating user...")
        password_hash = generate_password_hash("Dongzeyu1!")
        
        session.execute(text("""
            INSERT INTO "user" (username, email, password_hash, is_admin, is_volunteer, role, created_at)
            VALUES (:username, :email, :password_hash, :is_admin, :is_volunteer, :role, NOW())
        """), {
            "username": "dongzeyu",
            "email": "dongzeyu123@outlook.com", 
            "password_hash": password_hash,
            "is_admin": True,
            "is_volunteer": True,
            "role": "ultimate_admin"
        })
        
        session.commit()
        print("✅ User created successfully!")
        print("   Username: dongzeyu")
        print("   Email: dongzeyu123@outlook.com")
        print("   Role: Ultimate Admin")
        print("   Password: Dongzeyu1!")
        
    except Exception as e:
        print(f"❌ Error creating user: {e}")
        import traceback
        traceback.print_exc()
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    create_user()
