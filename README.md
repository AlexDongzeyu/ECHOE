# ECHOE: Empathy, Connection, Hope, Outreach, Empowerment

![Live Site](https://img.shields.io/badge/site-echoehosa.com-brightgreen)
![Platform](https://img.shields.io/badge/platform-Render-blue)
![License](https://img.shields.io/badge/license-GPL--3.0-blue)

> "We are all broken. That's how the light gets in." -- Ernest Hemingway

ECHOE (Empathy, Connection, Hope, Outreach, Empowerment) is a Canadian student-led nonprofit mental health platform providing anonymous support and combating social isolation among youth.

## Live Website

**Website**: [echoehosa.com](https://echoehosa.com)

## About the Project

ECHOE focuses on fighting social isolation among students through a comprehensive digital platform featuring:

*   **Anonymous Letter System**: Share personal stories and struggles securely.
*   **AI-Powered Support**: Immediate, compassionate responses via Google Gemini integration.
*   **Volunteer Network**: Peer support from trained student volunteers.
*   **Educational Campaigns**: Curated monthly mental health topics.
*   **Community Events**: Spaces for connection and detailed event management.

## Project Structure

The repository is organized as follows:

```
ECHOE/
├── LICENSE                 # GNU GPL v3.0 License
├── README.md               # Project documentation
├── render.yaml             # Render deployment configuration
├── requirements.txt        # Python dependencies
├── docs/                   # Detailed documentation
│   ├── ARCHITECTURE.md     # Technical architecture & stack
│   └── BRAND_GUIDE.md      # Design system & guidelines
└── NPO-SCA/                # Main Flask Application
    ├── app.py              # Application entry point
    ├── config.py           # Configuration classes
    ├── models.py           # Database models (SQLAlchemy)
    ├── forms.py            # Form definitions (WTForms)
    ├── templates/          # HTML Templates (Jinja2)
    └── static/             # Static assets (CSS, JS, Images)
```

## Key Features

### content & Support
*   **Anonymous Letters**: Users receive unique IDs to check for responses anonymously.
*   **AI Integration**: Utilizes Google Gemini 2.0 Flash for crisis detection and drafting supportive responses (supportive, practical, reflective styles).
*   **Volunteer Dashboard**: Tools for volunteers to manage and respond to letters efficiently.

### Interactive Components
*   **Topic Explorer**: Monthly mental health educational modules.
*   **7-Day Battery Challenge**: Interactive wellness activities.
*   **Ally Checklist**: Autism awareness self-assessment.
*   **Daily Echo Message**: AI-generated positive affirmations.

### Administration
*   **Role-Based Access**: Granular control for Volunteers, Administrators, and Ultimate Admins.
*   **Moderation**: Automated flagging of crisis keywords.

## Development Setup

### Prerequisites
*   Python 3.9+
*   pip

### Local Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/AlexDongzeyu/ECHOE.git
    cd ECHOE/NPO-SCA
    ```

2.  Create a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r ../requirements.txt
    ```

4.  Configure environment variables:
    Copy the example environment file and fill in your values:
    ```bash
    cp .env.example .env
    ```
    
    Required variables:
    *   `SECRET_KEY`: Flask secret key for session management
    *   `ADMIN_PASSWORD`: Password for the initial admin user
    *   `GEMINI_API_KEY`: Your Google Gemini API key
    *   `RECAPTCHA_SITE_KEY` / `RECAPTCHA_SECRET`: Google reCAPTCHA v2 keys

5.  Run the development server:
    ```bash
    flask run
    ```
    Access the application at `http://localhost:5000`.

## Deployment

The project is configured for deployment on **Render**:
*   Uses `render.yaml` for infrastructure-as-code configuration.
*   Supports persistent disk storage for SQLite database (or Postgres configuration).
*   Automatic deployment triggers from GitHub pushes.

## Crisis Resources

If you or someone you know is in immediate danger, please contact emergency services.

*   **Canada Suicide Prevention**: 1-833-456-4566
*   **Kids Help Phone**: 1-800-668-6868
*   **Crisis Text Line**: Text HOME to 686868
*   **Emergency Services**: 911

## Authors & License

**Lead IT Developer**: Alex Dong (Co-Founder)

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.

Copyright (c) 2026 Alex Dong. All Rights Reserved.