import psycopg2
import sys

try:
    conn = psycopg2.connect('postgresql://echoe:ubYSOYesPdHjkfz9pwkLdEvKTJ3pUXn5@dpg-d3pf6ml6ubrc73f48fs0-a.oregon-postgres.render.com/echoe')
    cur = conn.cursor()
    
    print('=== CURRENT USERS ===')
    cur.execute('SELECT id, username, email, role, is_admin, is_volunteer FROM "user"')
    users = cur.fetchall()
    
    if users:
        for user in users:
            print(f'ID: {user[0]}, Username: {user[1]}, Email: {user[2]}, Role: {user[3]}, is_admin: {user[4]}, is_volunteer: {user[5]}')
    else:
        print('No users found')
    
    print('\n=== DELETING ALL USERS ===')
    cur.execute('DELETE FROM "user"')
    deleted = cur.rowcount
    print(f'Deleted {deleted} users')
    
    print('\n=== CREATING ADMIN USER ===')
    cur.execute('''
        INSERT INTO "user" (username, email, password_hash, role, is_admin, is_volunteer, created_at)
        VALUES (%s, %s, %s, %s, %s, %s, NOW())
    ''', ('dongzeyu', 'dongzeyu123@outlook.com', 'scrypt:32768:8:1$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5vJz4vK4aO', 'ULTIMATE_ADMIN', True, True))
    
    conn.commit()
    print('Admin user created successfully')
    
    print('\n=== VERIFYING ADMIN USER ===')
    cur.execute('SELECT id, username, email, role, is_admin, is_volunteer FROM "user" WHERE email = %s', ('dongzeyu123@outlook.com',))
    admin = cur.fetchone()
    
    if admin:
        print(f'✅ Admin user verified: ID={admin[0]}, Username={admin[1]}, Email={admin[2]}, Role={admin[3]}, is_admin={admin[4]}, is_volunteer={admin[5]}')
    else:
        print('❌ Admin user not found')
    
    cur.close()
    conn.close()
    
except Exception as e:
    print(f'Error: {e}')
    sys.exit(1)
