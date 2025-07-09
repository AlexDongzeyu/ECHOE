# Light in Silence - Cloudflare Workers Edition

A mental health support platform rebuilt for Cloudflare Workers with D1 database, featuring letter submission, AI-powered responses, and volunteer management.

## 🌟 Features

- **Anonymous Letter Submission**: Safe space for sharing mental health concerns
- **AI-Powered Responses**: Immediate support using Google Gemini API
- **Volunteer Response System**: Trained volunteers can respond to letters
- **Content Moderation**: Automatic flagging of concerning content
- **Real-time Chat**: AI companion chat with multiple response types
- **Admin Dashboard**: User and content management
- **Role-Based Access**: User, Volunteer, Admin, and Ultimate Admin roles

## 🏗️ Architecture

- **Backend**: Cloudflare Workers with Hono framework
- **Database**: Cloudflare D1 (SQLite-compatible)
- **Frontend**: Vanilla JavaScript SPA
- **AI**: Google Gemini 2.0 Flash API
- **Authentication**: JWT tokens with bcrypt password hashing

## 🚀 Deployment Guide

### Prerequisites

1. **Cloudflare Account**: Free tier works for development
2. **Node.js**: Version 18+ 
3. **Wrangler CLI**: Cloudflare's development tool
4. **Google AI API Key**: For Gemini integration

### Step 1: Setup Wrangler

```bash
npm install -g wrangler
wrangler login
```

### Step 2: Clone and Setup

```bash
git clone <your-repo-url>
cd light-in-silence
npm install
```

### Step 3: Create D1 Database

```bash
# Create the database
wrangler d1 create light-in-silence-db

# Copy the database_id from output and update wrangler.toml
# Replace the empty database_id with the generated one
```

### Step 4: Run Database Migrations

```bash
# Apply migrations to create tables
wrangler d1 migrations apply light-in-silence-db --remote
```

### Step 5: Set Environment Variables

```bash
# Set your JWT secret
wrangler secret put JWT_SECRET
# Enter a strong random string (e.g., openssl rand -base64 32)

# Set your Gemini API key
wrangler secret put GEMINI_API_KEY
# Enter your Google AI API key
```

### Step 6: Update wrangler.toml

Update the `database_id` and `zone_id` in `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "light-in-silence-db"
database_id = "your-database-id-here"

[[routes]]
pattern = "*/*"
zone_id = "your-zone-id-here"  # Optional: for custom domain
```

### Step 7: Deploy

```bash
# Deploy to production
npm run deploy

# Or deploy to staging
wrangler deploy --env staging
```

## 🔧 Development

### Local Development

```bash
# Start local development server
npm run dev

# Apply migrations locally
npm run db:migrate:local
```

### Database Management

```bash
# Create new migration
wrangler d1 migrations create light-in-silence-db "migration_name"

# Apply migrations (production)
npm run db:migrate

# Apply migrations (local)
npm run db:migrate:local
```

### Testing

```bash
# Run tests
npm test

# Test AI connection
curl https://your-worker.workers.dev/api/chat/test
```

## 📋 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `JWT_SECRET` | Secret for signing JWT tokens | Yes |
| `GEMINI_API_KEY` | Google AI API key for Gemini | Yes |
| `ENVIRONMENT` | Deployment environment | No |

## 🗄️ Database Schema

The application uses the following main tables:

- **users**: User accounts with role-based access
- **letters**: Submitted letters with moderation flags
- **responses**: AI and human responses to letters
- **sessions**: User authentication sessions
- **posts**: Blog posts (optional)
- **events**: Community events (optional)
- **physical_mailboxes**: Physical letter drop locations

## 🔐 Security Features

- **Password Hashing**: bcrypt with 12 rounds
- **JWT Authentication**: Secure token-based auth
- **Content Moderation**: Automatic flagging of concerning content
- **Role-Based Access Control**: Multiple permission levels
- **CORS Protection**: Configurable origin restrictions

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify` - Verify token

### Letters
- `POST /api/letters/submit` - Submit new letter
- `GET /api/letters/:id` - Get letter and responses
- `GET /api/letters/queue/unprocessed` - Get unprocessed letters (volunteer)
- `POST /api/letters/:id/respond` - Respond to letter (volunteer)

### Chat
- `POST /api/chat/` - Chat with AI
- `POST /api/chat/moderate` - Moderate content
- `GET /api/chat/settings` - Get chat configuration

### Admin
- `GET /api/admin/dashboard` - Admin statistics
- `GET /api/admin/users` - User management (ultimate admin)
- `POST /api/admin/users/:id/promote` - Promote user
- `DELETE /api/admin/users/:id` - Delete user

## 🚨 Crisis Resources

The platform includes automatic detection of concerning content and provides crisis resources:

- **Canada Crisis Line**: 1-833-456-4566
- **Text Support**: 45645
- **Emergency**: 911

## 📱 Frontend Features

- **Single Page Application**: Fast navigation without page reloads
- **Responsive Design**: Works on desktop and mobile
- **Progressive Enhancement**: Graceful degradation
- **Real-time Chat Widget**: Integrated AI companion
- **Form Validation**: Client and server-side validation

## 🔄 Migration from Flask

This version maintains compatibility with the original Flask application's data structure while providing:

- **Better Performance**: Edge computing with Cloudflare Workers
- **Global Scale**: Automatic worldwide distribution
- **Lower Costs**: Serverless pricing model
- **Modern Stack**: TypeScript, modern JavaScript, and APIs

## 📈 Monitoring

### Health Checks
- `GET /health` - Worker health status
- `GET /api/chat/test` - AI service connectivity

### Logs
Monitor logs in Cloudflare Dashboard or via Wrangler:
```bash
wrangler tail --format pretty
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For technical support or questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check Cloudflare Workers documentation

## 🔮 Future Enhancements

- [ ] Real-time notifications with Durable Objects
- [ ] File upload support with R2 storage
- [ ] Email notifications with Cloudflare Email Workers
- [ ] Advanced analytics dashboard
- [ ] Mobile app integration
- [ ] Multi-language support

---

**Note**: This application handles sensitive mental health information. Please ensure compliance with relevant privacy laws and regulations in your jurisdiction. 