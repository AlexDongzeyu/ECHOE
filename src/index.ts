import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { D1Database, D1PreparedStatement } from './types/cloudflare';
type Fetcher = any;
import { authRoutes } from './routes/auth';
import { letterRoutes } from './routes/letters';
import { adminRoutes } from './routes/admin';
import { volunteerRoutes } from './routes/volunteer';
import { chatRoutes } from './routes/chat';
import { blogRoutes } from './routes/blog';
import { eventsRoutes } from './routes/events';
// Static site is served via Workers Assets (wrangler.toml -> assets.directory = "./public")

export interface Env {
  DB: D1Database;
  GEMINI_API_KEY: string;
  JWT_SECRET: string;
  ENVIRONMENT: string;
  ASSETS: Fetcher; // bound by Wrangler when [assets] is configured
}

const app = new Hono();

// CORS middleware
app.use('*', cors({
  origin: '*', // Allow all origins in development
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Health check endpoint
app.get('/health', (c: any) => {
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
app.route('/api/blog', blogRoutes);
app.route('/api/events', eventsRoutes);

// Static files and SPA fallback served from Workers Assets
app.get('/*', async (c: any) => {
  // Try to serve the exact asset first
  const assetResponse = await c.env.ASSETS.fetch(c.req.raw);
  if (assetResponse && assetResponse.status !== 404) {
    return assetResponse;
  }

  // Fallback to root index.html for SPA routes
  const rootUrl = new URL('/', c.req.url).toString();
  return c.env.ASSETS.fetch(new Request(rootUrl, c.req.raw));
});

// Global error handler
app.onError((err: any, c: any) => {
  console.error('Global error:', err);
  return c.json({
    error: 'Internal Server Error',
    message: c.env.ENVIRONMENT === 'development' ? err.message : 'Something went wrong'
  }, 500);
});

// 404 handler
app.notFound((c: any) => {
  return c.json({ error: 'Not Found' }, 404);
});

export default app; 