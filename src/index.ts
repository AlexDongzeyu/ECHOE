import { Hono } from 'hono';
import { cors } from '@hono/cors';
import { jwt } from '@hono/jwt';
import { authRoutes } from './routes/auth';
import { letterRoutes } from './routes/letters';
import { adminRoutes } from './routes/admin';
import { volunteerRoutes } from './routes/volunteer';
import { chatRoutes } from './routes/chat';
import { staticRoutes } from './routes/static';

export interface Env {
  DB: D1Database;
  GEMINI_API_KEY: string;
  JWT_SECRET: string;
  ENVIRONMENT: string;
}

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use('*', cors({
  origin: (origin) => {
    // Allow all origins in development, specific domains in production
    return true; // TODO: Restrict in production
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: c.env.ENVIRONMENT || 'unknown'
  });
});

// API Routes
app.route('/api/auth', authRoutes);
app.route('/api/letters', letterRoutes);
app.route('/api/admin', adminRoutes);
app.route('/api/volunteer', volunteerRoutes);
app.route('/api/chat', chatRoutes);

// Static file serving and frontend routes
app.route('/', staticRoutes);

// Global error handler
app.onError((err, c) => {
  console.error('Global error:', err);
  return c.json({
    error: 'Internal Server Error',
    message: c.env.ENVIRONMENT === 'development' ? err.message : 'Something went wrong'
  }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

export default app; 