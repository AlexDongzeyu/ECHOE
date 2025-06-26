import click
from flask.cli import with_appcontext
from models import db, User, UserRole

@click.command('seed-admin')
@with_appcontext
def seed_admin():
    """Create the initial Ultimate Administrator from dongzeyu123@outlook.com"""
    try:
        # Find user by email
        user = User.query.filter_by(email='dongzeyu123@outlook.com').first()
        
        if not user:
            click.echo('❌ Error: User with email dongzeyu123@outlook.com not found.')
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