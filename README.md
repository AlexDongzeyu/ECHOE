# 🌟 Light in Silence - Mental Health Platform

[![Deploy Status](https://img.shields.io/badge/status-ready_for_deployment-brightgreen)](https://github.com/AlexDongzeyu/LightInSilence)
[![Platform](https://img.shields.io/badge/platform-cloudflare-orange)](https://cloudflare.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> "We are all broken. That's how the light gets in." — Ernest Hemingway

A Canadian mental health platform providing anonymous support through both digital and physical channels.

## 🚀 **Current Deployment Status**

**Website**: [echoehosa.com](https://echoehosa.com) ✅ **LIVE ON CLOUDFLARE PAGES**

## 📁 **Project Structure**

This repository contains **THREE versions** of the Light in Silence platform:

### 1. 🌐 **Cloudflare Pages (Current Live Site)**
- **Location**: Root directory (`index.html`, `_redirects`)  
- **Status**: ✅ **LIVE** - Currently deployed at echoehosa.com
- **Technology**: Static HTML/CSS/JavaScript
- **Purpose**: Public landing page with coming soon functionality

### 2. ⚡ **Cloudflare Workers (Full Platform)**
- **Location**: `/src/` directory + `wrangler.toml`
- **Status**: 🚧 **Ready for deployment** (when backend needed)
- **Technology**: TypeScript + Hono + D1 Database + AI integration
- **Purpose**: Complete platform with letter submission, AI responses, volunteer management

### 3. 🐍 **Original Flask Application (Preserved)**
- **Location**: `/NPO-SCA/` directory
- **Status**: ✅ **Preserved original working version**
- **Technology**: Python Flask + SQLite
- **Purpose**: Original development version and fallback

## 🌍 **Live Website Features**

The current live site at **echoehosa.com** includes:

- ✨ **Beautiful landing page** with animated elements
- 📧 **Email subscription** for launch notifications
- 📱 **Fully responsive** design for all devices
- ♿ **Accessible** navigation and smooth scrolling
- 🎨 **Professional branding** with consistent color scheme

## 🔧 **Development Setup**

### For Pages Development (Current):
```bash
# Clone repository
git clone https://github.com/AlexDongzeyu/LightInSilence.git
cd LightInSilence

# Open index.html in browser for local development
# Or use a simple HTTP server:
python -m http.server 8000
# Visit http://localhost:8000
```

### For Workers Development (Future Full Platform):
```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your API keys: JWT_SECRET, GEMINI_API_KEY

# Start development server
npm run dev

# Deploy to Cloudflare Workers
npm run deploy
```

## 📋 **Deployment Guide**

### Current: Cloudflare Pages ✅
The site is already deployed! The Pages deployment automatically:
- Serves `index.html` as the main page
- Handles routing with `_redirects` file
- Provides global CDN distribution
- Offers SSL certificates and custom domains

### Future: Cloudflare Workers (Full Platform)
When ready to deploy the complete platform:

1. **Create D1 Database**:
   ```bash
   wrangler d1 create light-in-silence-db
   # Update wrangler.toml with database_id
   ```

2. **Set Environment Variables**:
   ```bash
   wrangler secret put JWT_SECRET
   wrangler secret put GEMINI_API_KEY
   ```

3. **Run Database Migrations**:
   ```bash
   wrangler d1 migrations apply light-in-silence-db --remote
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

## 🌟 **Key Features**

### Current Live Site:
- 🎯 **Professional landing page** showcasing the platform
- 📱 **Mobile-responsive** design
- 📧 **Email collection** for launch notifications
- 🎨 **Beautiful animations** and user experience

### Planned Full Platform Features:
- 📝 **Anonymous letter submission** with topic categorization
- 🤖 **AI-powered responses** using Google Gemini
- 👥 **Volunteer management** system
- 🛡️ **Admin dashboard** with content moderation
- 🔐 **Role-based access control** (User → Volunteer → Admin → Ultimate Admin)
- 📊 **Analytics and reporting**
- 🆘 **Crisis detection** and resource integration

## 🔒 **Security Features**

- 🔐 **JWT authentication** with secure password hashing
- 🛡️ **Content moderation** with AI-powered crisis detection
- 🚪 **CORS protection** and input validation
- 📊 **Role-based permissions** at API level
- 🔒 **Anonymous submissions** with privacy protection

## 🌐 **Technology Stack**

### Frontend:
- HTML5, CSS3, JavaScript (ES6+)
- Font Awesome icons
- Google Fonts (Nunito)
- Responsive design principles

### Backend (Workers Version):
- TypeScript
- Hono framework
- Cloudflare D1 database
- Google Gemini AI API
- bcrypt password hashing
- JWT authentication

## 📞 **Contact & Support**

- 🌐 **Website**: [echoehosa.com](https://echoehosa.com)
- 📧 **Email**: contact@lightinsilence.org
- 🐙 **GitHub**: [AlexDongzeyu/LightInSilence](https://github.com/AlexDongzeyu/LightInSilence)

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Mental Health Organizations** across Canada for inspiration
- **Cloudflare** for providing excellent edge computing infrastructure
- **Google** for Gemini AI API supporting our response system
- **Community volunteers** who will help provide human support

---

*Light in Silence - Where Your Words Find Light* ✨ 