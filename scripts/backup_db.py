import os
import shutil
import time

def main():
    db_url = os.environ.get('DATABASE_URL') or os.environ.get('SQLALCHEMY_DATABASE_URI')
    # Fallback to local dev path
    if not db_url:
        db_url = 'sqlite:///NPO-SCA/instance/database.db'
    if not db_url.startswith('sqlite:///'):
        print('Non-SQLite DB; external backups recommended.')
        return
    src = db_url.replace('sqlite:///', '')
    if not os.path.exists(src):
        print('Database not found, skipping backup.')
        return
    ts = time.strftime('%Y%m%d-%H%M%S')
    dest_dir = os.path.join(os.path.dirname(src), 'backups')
    os.makedirs(dest_dir, exist_ok=True)
    dest = os.path.join(dest_dir, f'database-{ts}.db')
    shutil.copy2(src, dest)
    print(f'Backup written to {dest}')

if __name__ == '__main__':
    main()


