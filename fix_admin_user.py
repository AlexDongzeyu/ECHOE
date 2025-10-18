#!/usr/bin/env python3
"""
Script to delete all users and recreate admin user with proper role
"""
import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Database connection
DATABASE_URL = "postgresql://echoe:ubYSOYesPdHjkfz9pwkLdEvKTJ3pUXn5@dpg-d3pf6ml6ubrc73f48fs0-a.oregon-postgres.render.com/echoe"

def fix_admin_user():
    print("🔍 Connecting to database...")
    try:
        # Create engine and session
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind=engine)
        session = Session()
        print("✅ Connected to database")

        # Delete all users
        print("\n🗑️ Deleting all existing users...")
        result = session.execute(text("DELETE FROM \"user\""))
        deleted_count = result.rowcount
        session.commit()
        print(f"✅ Deleted {deleted_count} users")

        # Create admin user with proper role
        print("\n👤 Creating admin user...")
        admin_user_sql = """
        INSERT INTO "user" (username, email, password_hash, role, is_admin, is_volunteer, created_at)
        VALUES (
            'dongzeyu',
            'dongzeyu123@outlook.com',
            'scrypt:32768:8:1$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5vJz4vK4aO',
            'ULTIMATE_ADMIN',
            true,
            true,
            NOW()
        )
        """
        session.execute(text(admin_user_sql))
        session.commit()
        print("✅ Admin user created successfully")

        # Verify the user was created
        print("\n🔍 Verifying admin user...")
        verify_result = session.execute(text("SELECT id, username, email, role, is_admin, is_volunteer FROM \"user\" WHERE email = 'dongzeyu123@outlook.com'"))
        admin_user = verify_result.fetchone()
        
        if admin_user:
            print("✅ Admin user verified:")
            print(f"  ID: {admin_user[0]}")
            print(f"  Username: {admin_user[1]}")
            print(f"  Email: {admin_user[2]}")
            print(f"  Role: {admin_user[3]}")
            print(f"  is_admin: {admin_user[4]}")
            print(f"  is_volunteer: {admin_user[5]}")
        else:
            print("❌ Admin user verification failed")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    fix_admin_user()
