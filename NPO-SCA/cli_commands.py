"""
PROJECT: ECHOE Mental Health Digital Platform
AUTHOR: Alex Dong (Co-Founder and Lead IT Developer)
LICENSE: GNU General Public License v3.0

Copyright (c) 2026 Alex Dong. All Rights Reserved.
This file is part of the ECHOE project. Unauthorized removal of
author credits is a violation of the GPL license.
"""

import click
from flask.cli import with_appcontext
from models import db, User, UserRole
import os # Added import for os

@click.command('seed-admin')
@with_appcontext
def seed_admin():
    """Create the initial Ultimate Administrator from ADMIN_EMAIL environment variable"""
    try:
        admin_email = os.environ.get('ADMIN_EMAIL', 'admin@example.com')
        # Find user by email
        user = User.query.filter_by(email=admin_email).first()
        
        if not user:
            click.echo(f'❌ Error: User with email {admin_email} not found.')
            click.echo('   Please ensure this user is registered first.')
            return
        
        # Check if already Ultimate Admin
        if user.role == UserRole.ULTIMATE_ADMIN:
            click.echo(f'✓ User {user.username} ({user.email}) is already an Ultimate Administrator.')
            return
        
        # Update role to Ultimate Admin
        old_role = user.get_role_display()
        user.role = UserRole.ULTIMATE_ADMIN
        
        # Also update legacy fields for backward compatibility
        user.is_admin = True
        user.is_volunteer = True
        
        db.session.commit()
        
        click.echo('🎉 Success! Ultimate Administrator created:')
        click.echo(f'   Username: {user.username}')
        click.echo(f'   Email: {user.email}')
        click.echo(f'   Previous Role: {old_role}')
        click.echo(f'   New Role: {user.get_role_display()}')
        click.echo('')
        click.echo('The user can now access the admin panel at /admin')
        
    except Exception as e:
        click.echo(f'❌ Error creating Ultimate Administrator: {str(e)}')
        db.session.rollback()

@click.command('list-admins')
@with_appcontext
def list_admins():
    """List all administrators and ultimate administrators"""
    try:
        admins = User.query.filter(User.role.in_([UserRole.ADMIN, UserRole.ULTIMATE_ADMIN])).all()
        
        if not admins:
            click.echo('No administrators found.')
            return
        
        click.echo('Current Administrators:')
        click.echo('=' * 50)
        
        for admin in admins:
            click.echo(f'{admin.username} ({admin.email}) - {admin.get_role_display()}')
            
    except Exception as e:
        click.echo(f'❌ Error listing administrators: {str(e)}')

@click.command('migrate-roles')
@with_appcontext
def migrate_roles():
    """Migrate existing is_admin flags to new role system"""
    try:
        users = User.query.all()
        updated_count = 0
        
        for user in users:
            old_role = user.role
            
            # Only migrate if still using default USER role
            if user.role == UserRole.USER:
                if user.is_admin:
                    user.role = UserRole.ADMIN
                    updated_count += 1
                    click.echo(f'Migrated {user.username} from USER to ADMIN')
        
        if updated_count > 0:
            db.session.commit()
            click.echo(f'✓ Successfully migrated {updated_count} users to new role system.')
        else:
            click.echo('No users needed migration.')
            
    except Exception as e:
        click.echo(f'❌ Error migrating roles: {str(e)}')
        db.session.rollback()

def register_commands(app):
    """Register all CLI commands with the Flask app"""
    app.cli.add_command(seed_admin)
    app.cli.add_command(list_admins)
    app.cli.add_command(migrate_roles) 

# -------------------- User utilities --------------------
@click.command('create-user')
@click.option('--username', prompt=True, help='Username for the new user')
@click.option('--email', prompt=True, help='Email for the new user')
@click.option('--password', prompt=True, hide_input=True, confirmation_prompt=True, help='Password for the new user')
@click.option('--role', type=click.Choice(['user','admin','ultimate'], case_sensitive=False), default='user', show_default=True, help='Role to assign')
@click.option('--volunteer/--no-volunteer', default=False, show_default=True, help='Grant volunteer flag')
@with_appcontext
def create_user(username, email, password, role, volunteer):
    """Create a user with specified credentials and role."""
    try:
        # Uniqueness checks
        if User.query.filter_by(username=username).first():
            click.echo(f'❌ Username already exists: {username}')
            return
        if User.query.filter_by(email=email).first():
            click.echo(f'❌ Email already exists: {email}')
            return

        user = User(username=username, email=email)
        user.set_password(password)
        user.is_volunteer = bool(volunteer)

        if role.lower() == 'admin':
            user.role = UserRole.ADMIN
            user.is_admin = True
        elif role.lower() == 'ultimate':
            user.role = UserRole.ULTIMATE_ADMIN
            user.is_admin = True
            user.is_volunteer = True
        else:
            user.role = UserRole.USER

        db.session.add(user)
        db.session.commit()
        click.echo('✅ User created:')
        click.echo(f'   Username: {user.username}')
        click.echo(f'   Email:    {user.email}')
        click.echo(f'   Role:     {user.get_role_display()}')
        click.echo(f'   Volunteer:{"Yes" if user.is_volunteer else "No"}')
    except Exception as e:
        db.session.rollback()
        click.echo(f'❌ Error creating user: {e}')

@click.command('set-password')
@click.option('--email', prompt=True, help='Email of existing user')
@click.option('--password', prompt=True, hide_input=True, confirmation_prompt=True, help='New password')
@with_appcontext
def set_password(email, password):
    """Reset password for a user by email."""
    try:
        user = User.query.filter_by(email=email).first()
        if not user:
            click.echo(f'❌ User not found: {email}')
            return
        user.set_password(password)
        db.session.commit()
        click.echo(f'✅ Password updated for {email}')
    except Exception as e:
        db.session.rollback()
        click.echo(f'❌ Error updating password: {e}')

def register_commands(app):  # type: ignore[no-redef]
    """Register all CLI commands with the Flask app"""
    app.cli.add_command(seed_admin)
    app.cli.add_command(list_admins)
    app.cli.add_command(migrate_roles)
    app.cli.add_command(create_user)
    app.cli.add_command(set_password)