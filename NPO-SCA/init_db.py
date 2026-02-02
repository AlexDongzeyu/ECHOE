"""
PROJECT: ECHOE Mental Health Digital Platform
AUTHOR: Alex Dong (Co-Founder and Lead IT Developer)
LICENSE: GNU General Public License v3.0

Copyright (c) 2026 Alex Dong. All Rights Reserved.
This file is part of the ECHOE project. Unauthorized removal of
author credits is a violation of the GPL license.
"""

from models import db, User, Letter, Response, UserReply, PhysicalMailbox, Post, Event, UserRole
from werkzeug.security import generate_password_hash
from datetime import datetime

def init_db(app):
    """Initialize the database."""
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Create initial data
        create_initial_data()
        
        # Always ensure admin user exists (delete and recreate if needed)
        admin_user = User.query.filter_by(email='dongzeyu123@outlook.com').first()
        if admin_user:
            # Delete existing admin user to ensure fresh state
            db.session.delete(admin_user)
            db.session.commit()

        # Create admin user
        admin_user = User(
            username='dongzeyu',
            email='dongzeyu123@outlook.com',
            is_volunteer=True,
            is_admin=True,
            role=UserRole.ULTIMATE_ADMIN
        )
        admin_user.set_password('Dongzeyu1!')
        db.session.add(admin_user)
        db.session.commit()
        
        # Create test user if no users exist
        test_user = User.query.filter_by(username='test_user').first()
        if not test_user:
            # Create test user
            test_user = User(
                username='test_user',
                email='test@example.com',
                is_volunteer=True
            )
            test_user.set_password('Test123!')
            db.session.add(test_user)
            db.session.commit()

        # Create a sample blog post
        if Post.query.count() == 0:
            post = Post(
                title="Finding Light in the Smallest Moments",
                body="Even on the darkest days, there is light to be found. It might be in the warmth of a cup of tea, the sound of rain on the window, or a kind word from a stranger. This blog is about noticing and appreciating those small moments. What small moment brought you a little light today?",
                author_id=admin_user.id
            )
            db.session.add(post)
            db.session.commit()
        
        # Create initial event if it doesn't exist
        if Event.query.count() == 0:
            event = Event(
                title="Empowering Autism Awareness and Community Support",
                objective="To foster a supportive and inclusive community for individuals with autism and their families.",
                event_date=datetime(2024, 9, 15, 14, 0), # Example date
                location="Online via Zoom",
                structure="Opening Remarks, Guest Speaker Session, Interactive Workshops, Q&A",
                registration_link="#" # Placeholder for a real link
            )
            db.session.add(event)
            db.session.commit()

# Add some initial mailboxes
def create_initial_data():
    # Create physical mailboxes
    if PhysicalMailbox.query.count() == 0:
        mailboxes = [
            PhysicalMailbox(
                name="Toronto Central Library",
                address="789 Yonge Street",
                city="Toronto",
                province="ON",
                postal_code="M4W 2G8",
                description="Located near the main entrance, available during library hours",
                operating_hours="Monday-Friday: 9am-9pm, Weekends: 10am-5pm",
                status="active"
            ),
            PhysicalMailbox(
                name="Vancouver Community Centre", 
                address="123 Main Street",
                city="Vancouver",
                province="BC",
                postal_code="V6B 2W9",
                description="Located in the main hall, available 9am-9pm daily",
                operating_hours="Daily: 9am-9pm",
                status="active"
            ),
            PhysicalMailbox(
                name="Montreal Arts Café",
                address="456 St. Catherine Street",
                city="Montreal", 
                province="QC",
                postal_code="H2L 2G7",
                description="Located near the counter, available during café hours",
                operating_hours="Monday-Saturday: 7am-10pm, Sunday: 8am-8pm",
                status="active"
            )
        ]
        
        for mailbox in mailboxes:
            db.session.add(mailbox)
        
        db.session.commit()