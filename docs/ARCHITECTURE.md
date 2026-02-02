# ECHOE Project Architecture

## Overview
ECHOE (Empathy, Connection, Hope, Outreach, Empowerment) is a mental health digital platform designed to provide a safe, supportive, and accessible space for users. The project combines modern web technologies with AI integration to deliver features like anonymous letter writing, AI-assisted support chat, and community event management.

## Technical Stack

### Backend
*   **Framework:** Flask (Python)
*   **Database:** 
    *   SQLite (Development)
    *   PostgreSQL (Production/Render)
*   **ORM:** SQLAlchemy (Flask-SQLAlchemy)
*   **Authentication:** Flask-Login
*   **Async Processing:** Eventlet
*   **Forms:** Flask-WTF

### Frontend
*   **Template Engine:** Jinja2
*   **CSS:** Vanilla CSS with a custom variable-based design system
*   **JavaScript:** Vanilla JS + GSAP (GreenSock Animation Platform) for high-performance animations
*   **Design:** Custom "Paper & Ink" aesthetic with transparent overlays and texture effects

### External Integrations
*   **AI:** Google Gemini API (Content moderation, Chat support, Response drafting)
*   **Social Media:** Instagram Basic Display API (Project display)
*   **Video:** YouTube RSS Feed (Inspiration media)
*   **Security:** Google reCAPTCHA v2 (Spam protection)

## Directory Structure

```text
ECHOE/
├── LICENSE                 # GNU GPL v3.0 License
├── README.md               # Project overview and setup
├── NPO-SCA/                # Main Application Code
│   ├── app.py              # Application entry point & route definitions
│   ├── config.py           # Configuration classes
│   ├── models.py           # Database models
│   ├── forms.py            # WTForms definitions
│   ├── static/             # Static assets
│   │   ├── css/            # Global and page-specific styles
│   │   ├── js/             # JavaScript logic
│   │   └── images/         # Image assets
│   └── templates/          # HTML Templates
└── docs/                   # Documentation
    ├── ARCHITECTURE.md     # This file
    └── BRAND_GUIDE.md      # Brand guidelines
```

## Database Schema

### Core Models
*   **User:** Handles authentication, roles (USER, ADMIN, ULTIMATE_ADMIN), and profile data.
*   **Letter:** Stores user-submitted letters (anonymous or signed).
*   **Response:** Stores volunteer/AI responses to letters.
*   **PhysicalMailbox:** Registry of physical drop-off locations.

### Content Models
*   **Post:** Blog posts/articles.
*   **Event:** Community events and workshops.

## Deployment
*   **Platform:** Render
*   **Configuration:** `render.yaml`
*   **WSGI:** Gunicor with Eventlet workers for async support.

## Security Features
*   **Role-Based Access Control (RBAC):** Granular permissions for Admins and Volunteers.
*   **Content Moderation:** AI-driven pre-screening of messages for crisis keywords.
*   **Rate Limiting:** IP-based limiting on submission endpoints.
