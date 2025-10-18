#!/usr/bin/env python3
"""
Script to check user data in the database
"""
import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Database connection
DATABASE_URL = "postgresql://echoe:ubYSOYesPdHjkfz9pwkLdEvKTJ3pUXn5@dpg-d3pf6ml6ubrc73f48fs0-a.oregon-postgres.render.com/echoe"

def check_users():
    print("🔍 Connecting to database...")
    try:
        # Create engine and session
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind=engine)
        session = Session()
        print("✅ Connected to database")

        # Check all users
        print("\n=== ALL USERS IN DATABASE ===")
        result = session.execute(text("SELECT id, username, email, role, is_admin, is_volunteer FROM \"user\""))
        users = result.fetchall()
        
        if not users:
            print("❌ No users found in database")
        else:
            for user in users:
                print(f"ID: {user[0]}, Username: {user[1]}, Email: {user[2]}")
                print(f"  Role: {user[3]}, is_admin: {user[4]}, is_volunteer: {user[5]}")
                print()

        # Check specifically for the admin user
        print("=== CHECKING ADMIN USER ===")
        admin_result = session.execute(text("SELECT id, username, email, role, is_admin, is_volunteer FROM \"user\" WHERE email = 'dongzeyu123@outlook.com'"))
        admin_user = admin_result.fetchone()
        
        if admin_user:
            print("✅ Admin user found:")
            print(f"  ID: {admin_user[0]}")
            print(f"  Username: {admin_user[1]}")
            print(f"  Email: {admin_user[2]}")
            print(f"  Role: {admin_user[3]} (type: {type(admin_user[3])})")
            print(f"  is_admin: {admin_user[4]}")
            print(f"  is_volunteer: {admin_user[5]}")
        else:
            print("❌ Admin user NOT found")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        session.close()

if __name__ == "__main__":
    check_users()
