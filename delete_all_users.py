#!/usr/bin/env python3
"""
Script to delete all users from the Postgres database
"""
import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Database connection
DATABASE_URL = "postgresql://echoe:ubYSOYesPdHjkfz9pwkLdEvKTJ3pUXn5@dpg-d3pf6ml6ubrc73f48fs0-a.oregon-postgres.render.com/echoe"

def delete_all_users():
    print("🔍 Connecting to database...")
    try:
        # Create engine and session
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind=engine)
        session = Session()
        print("✅ Connected to database")

        # Delete all users
        print("🗑️ Deleting all users...")
        result = session.execute(text("DELETE FROM \"user\""))
        deleted_count = result.rowcount
        session.commit()

        print(f"✅ Deleted {deleted_count} users from database")

    except Exception as e:
        print(f"❌ Error deleting users: {e}")
        import traceback
        traceback.print_exc()
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    delete_all_users()
