import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authRoutes } from './routes/auth';
import { letterRoutes } from './routes/letters';
import { adminRoutes } from './routes/admin';
import { volunteerRoutes } from './routes/volunteer';
import { chatRoutes } from './routes/chat';
// Static site is served via Workers Assets (wrangler.toml -> assets.directory = "./public")

export interface Env {
  DB: D1Database;
  GEMINI_API_KEY: string;
  JWT_SECRET: string;
  ENVIRONMENT: string;
  ASSETS: Fetcher; // bound by Wrangler when [assets] is configured
}

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use('*', cors({
  origin: '*', // Allow all origins in development
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

// Static files and SPA fallback served from Workers Assets
app.get('/*', async (c) => {
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