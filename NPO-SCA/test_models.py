#!/usr/bin/env python3

"""Test script to verify User model and database functionality"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask
from models import db, User, UserRole
from config import Config

def test_user_model():
    """Test the User model functionality"""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    
    with app.app_context():
        try:
            # Query the user
            admin_email = os.environ.get('ADMIN_EMAIL', 'admin@example.com')
            user = User.query.filter_by(email=admin_email).first()
            
            if not user:
                print(f"❌ User {admin_email} not found in database")
                return False
            
            print(f"✓ Found user: {user.username} ({user.email})")
            print(f"  Role: {user.role}")
            print(f"  Role value: {user.role.value if user.role else 'None'}")
            
            # Test all the role methods
            methods_to_test = [
                'is_user', 'is_administrator', 'is_ultimate_administrator',
                'has_admin_access', 'can_manage_users', 'get_role_display'
            ]
            
            print("\n🧪 Testing role methods:")
            for method_name in methods_to_test:
                try:
                    method = getattr(user, method_name)
                    result = method()
                    print(f"  {method_name}(): {result}")
                except AttributeError as e:
                    print(f"  ❌ {method_name}(): Method not found - {e}")
                    return False
                except Exception as e:
                    print(f"  ❌ {method_name}(): Error - {e}")
                    return False
            
            print("\n🎉 All tests passed! User model is working correctly.")
            return True
            
        except Exception as e:
            print(f"❌ Error testing user model: {e}")
            import traceback
            traceback.print_exc()
            return False

if __name__ == '__main__':
    print("🔍 Testing User model and database...")
    success = test_user_model()
    sys.exit(0 if success else 1) 