#!/usr/bin/env python3
"""
Light in Silence - Deployment Verification Script
Tests the deployed Cloudflare Workers site for navigation and functionality
"""

import requests
import sys
from datetime import datetime

def test_site_health():
    """Test the basic health of the deployed site"""
    print("🔍 Testing site health...")
    
    try:
        # Test health endpoint
        response = requests.get('https://light-in-silence.your-subdomain.workers.dev/health', timeout=10)
        if response.status_code == 200:
            print("✅ Health endpoint working")
            return True
        else:
            print(f"❌ Health endpoint returned {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_navigation():
    """Test the main site navigation"""
    print("\n🔍 Testing navigation...")
    
    try:
        response = requests.get('https://light-in-silence.your-subdomain.workers.dev/', timeout=10)
        
        if response.status_code == 200:
            content = response.text
            
            # Check for navigation elements
            checks = {
                "Logo present": "Light in Silence" in content,
                "Discover dropdown": "Discover" in content,
                "About dropdown": "About" in content,
                "SPA navigation": "app.navigate" in content,
                "Mobile menu": "mobile-menu-toggle" in content,
                "CSS imports": "global.css" in content,
                "Font Awesome": "font-awesome" in content,
                "Nunito font": "Nunito" in content
            }
            
            all_passed = True
            for check_name, passed in checks.items():
                status = "✅" if passed else "❌"
                print(f"{status} {check_name}")
                if not passed:
                    all_passed = False
            
            return all_passed
        else:
            print(f"❌ Main page returned {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Navigation test failed: {e}")
        return False

def test_static_files():
    """Test static file serving"""
    print("\n🔍 Testing static files...")
    
    static_files = [
        "/static/css/global.css",
        "/static/css/chat.css",
        "/static/js/app.js"
    ]
    
    all_passed = True
    for file_path in static_files:
        try:
            response = requests.get(f'https://light-in-silence.your-subdomain.workers.dev{file_path}', timeout=10)
            if response.status_code == 200:
                print(f"✅ {file_path}")
            else:
                print(f"❌ {file_path} - Status: {response.status_code}")
                all_passed = False
        except Exception as e:
            print(f"❌ {file_path} - Error: {e}")
            all_passed = False
    
    return all_passed

def main():
    """Main verification function"""
    print("🚀 Light in Silence - Deployment Verification")
    print("=" * 50)
    print(f"📅 Test run: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Run all tests
    health_ok = test_site_health()
    navigation_ok = test_navigation()
    static_ok = test_static_files()
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 VERIFICATION SUMMARY")
    print("=" * 50)
    
    tests = [
        ("Site Health", health_ok),
        ("Navigation", navigation_ok),
        ("Static Files", static_ok)
    ]
    
    all_passed = True
    for test_name, passed in tests:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} {test_name}")
        if not passed:
            all_passed = False
    
    print()
    if all_passed:
        print("🎉 ALL TESTS PASSED!")
        print("✅ Deployment is working correctly")
        print("✅ Navigation is properly organized")
        print("✅ Static files are being served")
        return 0
    else:
        print("⚠️  SOME TESTS FAILED")
        print("❌ Please check the deployment")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 