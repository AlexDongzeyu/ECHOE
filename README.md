# 🌟 E.C.H.O.E. - Every Connection Helps One Emerge

[![Live Site](https://img.shields.io/badge/site-echoehosa.com-brightgreen)](https://echoehosa.com)
[![Platform](https://img.shields.io/badge/platform-Render-blue)](https://render.com)
[![Flask](https://img.shields.io/badge/framework-Flask-black)](https://flask.palletsprojects.com/)

> "We are all broken. That's how the light gets in." — Ernest Hemingway

A Canadian student-led nonprofit mental health platform providing anonymous support and combating social isolation among youth.

## 🌐 **Live Website**

**Website**: [echoehosa.com](https://echoehosa.com) ✅ **LIVE**

## 📋 **About E.C.H.O.E.**

E.C.H.O.E. (Every Connection Helps One Emerge) is a youth-led mental health organization focused on fighting social isolation among students through:

- **Anonymous Letter System** - Share your story, receive support
- **AI-Powered Responses** - Get immediate, compassionate responses
- **Volunteer Network** - Trained peers who understand
- **Educational Campaigns** - Monthly mental health topics
- **Community Events** - Safe spaces for connection

## 📁 **Project Structure**

```
ECHOE/
├── NPO-SCA/                    # Main Flask Application
│   ├── app.py                  # Main application entry point
│   ├── templates/              # Jinja2 HTML templates
│   │   ├── base.html           # Base template with navigation
│   │   ├── index.html          # Homepage
│   │   ├── campaigns/          # Campaign pages
│   │   │   ├── wellness.html
│   │   │   ├── education_hub.html
│   │   │   ├── student_voices.html
│   │   │   ├── inspiration_media.html
│   │   │   └── weekly_connections.html
│   │   └── ...                 # Other templates
│   ├── static/                 # Static assets
│   │   ├── css/                # Stylesheets
│   │   ├── js/                 # JavaScript
│   │   └── img/                # Images and media
│   └── migrations/             # Database migrations
├── render.yaml                 # Render deployment config
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

## 🎯 **Key Features**

### ✉️ Anonymous Letter System
- Submit anonymous letters about mental health struggles
- Unique letter IDs for checking responses
- Reply-to-reply conversations with volunteers

### 🤖 AI Integration
- Google Gemini 2.0 Flash for immediate responses
- Crisis detection and resource integration
- Multiple response styles (supportive, practical, reflective)

### 👥 Volunteer System
- Trained peer volunteers respond to letters
- Dashboard for managing unprocessed letters
- Conversation threading

### 🛡️ Admin Features
- User management (promote, demote users)
- Content moderation
- Platform analytics

### 📚 Interactive Campaign Pages
- **Topic Explorer** - Monthly mental health education with detailed content
- **7-Day Battery Challenge** - Wellness activities interactive
- **Your Voice Matters Quiz** - Personalized suggestions based on answers
- **Are You an Ally?** - Autism awareness checklist
- **Daily Echo Message** - AI-powered daily mental health messages
- **Holiday Wellness Tips** - Seasonal support generator
- **Myth Buster** - Mental health trivia

## 🔧 **Development Setup**

### Prerequisites
- Python 3.9+
- pip

### Local Development
```bash
# Clone repository
git clone https://github.com/AlexDongzeyu/ECHOE.git
cd ECHOE/NPO-SCA

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
flask run
# Visit http://localhost:5000
```

### Environment Variables
Create a `.env` file with:
```
FLASK_SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-google-gemini-api-key
```

## 🚀 **Deployment**

The project is deployed on **Render** with:
- Automatic deployments from GitHub
- Persistent disk storage for database
- Health checks and monitoring

### Deployment Configuration (`render.yaml`)
- Web service with Python runtime
- Persistent disk at `/var/data/echoe`
- Alembic migrations run on pre-deploy

## 🎨 **Design System**

### Brand Colors
- **Deep Indigo** `#2A3D66` - Primary text
- **Gentle Lavender** `#B39CD0` - Accents
- **Soft Teal** `#9FC5CB` - Interactive elements
- **Golden Butter** `#F8D29C` - Highlights
- **Warm White** `#FDF8E8` - Backgrounds

### Typography
- **Nunito** - Primary font (body and headings)

## 🆘 **Crisis Resources**

The platform integrates crisis resources:
- **Canada Suicide Prevention**: 1-833-456-4566
- **Kids Help Phone**: 1-800-668-6868
- **Crisis Text Line**: Text HOME to 686868
- **Emergency Services**: 911

## 📞 **Contact**

- 🌐 **Website**: [echoehosa.com](https://echoehosa.com)
- 📧 **Email**: echoehosa@gmail.com
- 📱 **Instagram**: [@echoehosa](https://instagram.com/echoehosa)

## 📄 **License**

This project is for the E.C.H.O.E. Mental Health Organization.

---

*E.C.H.O.E. - Every Connection Helps One Emerge* 💜