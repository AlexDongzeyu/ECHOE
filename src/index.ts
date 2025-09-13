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
  PROXY_ORIGIN?: string; // optional: when set, reverse-proxy all requests to this origin
}

const app = new Hono();

// CORS middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
}));

// Reverse-proxy mode: if PROXY_ORIGIN is configured, forward most traffic unchanged
// Exception: allow Worker-handled endpoints (like /api/chat) to hit local handlers
app.use('*', async (c: any, next: any) => {
  const origin = c.env?.PROXY_ORIGIN;
  if (!origin) return next();

  const incomingUrl = new URL(c.req.url);
  const pathname = incomingUrl.pathname;

  // Do not proxy certain API routes so we can use Worker handlers/secrets
  if (pathname.startsWith('/api/chat') || pathname.startsWith('/api/health') || pathname === '/health') {
    return next();
  }
  const targetUrl = new URL(incomingUrl.pathname + incomingUrl.search, origin);

  // Clone request
  const headers = new Headers(c.req.raw.headers);
  // Fix Host and Forwarded headers for many Flask setups
  headers.set('Host', new URL(origin).host);
  headers.set('X-Forwarded-Proto', incomingUrl.protocol.replace(':',''));
  headers.set('X-Forwarded-Host', incomingUrl.host);
  headers.set('X-Forwarded-For', c.req.header('CF-Connecting-IP') || '');

  const init: RequestInit = {
    method: c.req.method,
    headers,
    body: ['GET','HEAD'].includes(c.req.method) ? undefined : await c.req.raw.clone().arrayBuffer(),
    redirect: 'follow',
  };

  const resp = await fetch(targetUrl.toString(), init);
  // Return upstream response as-is to preserve headers/body/stream
  return resp as any;
});

// Health check endpoint
app.get('/health', (c: any) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: c.env.ENVIRONMENT || 'unknown'
  });
});

// Alias: /api/health for CI and external monitors
app.get('/api/health', (c: any) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: c.env.ENVIRONMENT || 'unknown'
  });
});

// Debug: surface env bindings to confirm ASSETS and DB are attached
app.get('/api/debug/env', (c: any) => {
  return c.json({
    hasAssets: Boolean(c.env && c.env.ASSETS),
    hasDb: Boolean(c.env && c.env.DB),
    environment: c.env?.ENVIRONMENT ?? 'unknown'
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

// Map pretty routes to static HTML templates under public/templates for parity with Flask
const serveTemplate = async (c: any, path: string) => {
  try {
    const url = new URL(`/templates/${path}`, c.req.url).toString();
    const res = await c.env.ASSETS?.fetch(new Request(url));
    if (res && res.status !== 404) return res;
    // Fall back to SPA root if specific template not found
    const rootUrl = new URL('/index.html', c.req.url).toString();
    return (await c.env.ASSETS?.fetch(new Request(rootUrl))) || new Response('<!doctype html><html><head><meta charset="utf-8"><title>Light in Silence</title></head><body><div id="app"></div></body></html>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  } catch (err) {
    // As a last resort, return a minimal HTML so we never 500 on static pages
    return new Response('<!doctype html><html><head><meta charset="utf-8"><title>Light in Silence</title></head><body><div id="app"></div></body></html>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
};

app.get('/', async (c: any) => {
  try {
    const url = new URL('/index.html', c.req.url).toString();
    return await c.env.ASSETS?.fetch(new Request(url)) ?? new Response('<!doctype html><html><head><meta charset="utf-8"><title>Light in Silence</title></head><body><div id="app"></div></body></html>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  } catch {
    return new Response('<!doctype html><html><head><meta charset="utf-8"><title>Light in Silence</title></head><body><div id="app"></div></body></html>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
});
app.get('/about', (c: any) => serveTemplate(c, 'about.html'));
app.get('/contact', (c: any) => serveTemplate(c, 'contact.html'));
app.get('/donate', (c: any) => serveTemplate(c, 'donate.html'));
app.get('/login', (c: any) => serveTemplate(c, 'login.html'));
app.get('/signup', (c: any) => serveTemplate(c, 'signup.html'));
app.get('/submit', (c: any) => serveTemplate(c, 'submit.html'));
app.get('/check-reply', (c: any) => serveTemplate(c, 'check_reply.html'));
app.get('/resources', (c: any) => serveTemplate(c, 'resources.html'));
app.get('/terms', (c: any) => serveTemplate(c, 'terms.html'));
app.get('/privacy', (c: any) => serveTemplate(c, 'privacy.html'));
app.get('/volunteer-info', (c: any) => serveTemplate(c, 'volunteer_info.html'));
// Flask-specific admin and volunteer UI routes
app.get('/admin', (c: any) => serveTemplate(c, 'admin/dashboard.html'));
app.get('/admin/users', (c: any) => serveTemplate(c, 'admin/users.html'));
app.get('/admin/content', (c: any) => serveTemplate(c, 'admin/content.html'));
app.get('/volunteer', (c: any) => serveTemplate(c, 'volunteer/dashboard.html'));
app.get('/volunteer/respond', (c: any) => serveTemplate(c, 'volunteer/respond.html'));
// Blog & Events
app.get('/blog', (c: any) => serveTemplate(c, 'blog/index.html'));
app.get('/events', (c: any) => serveTemplate(c, 'events/index.html'));

// Static files and SPA fallback served from Workers Assets
app.get('/*', async (c: any) => {
  // Try to serve the exact asset first
  try {
    const assetResponse = await c.env.ASSETS?.fetch(new Request(c.req.url));
  if (assetResponse && assetResponse.status !== 404) {
    return assetResponse;
  }

  // Fallback to root index.html for SPA routes
  const rootUrl = new URL('/index.html', c.req.url).toString();
    return (await c.env.ASSETS?.fetch(new Request(rootUrl))) || new Response('<!doctype html><html><head><meta charset="utf-8"><title>Light in Silence</title></head><body><div id="app"></div></body></html>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  } catch (err) {
    // Never 500 on static route fetches
    return new Response('<!doctype html><html><head><meta charset="utf-8"><title>Light in Silence</title></head><body><div id="app"></div></body></html>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
});

// Global error handler
app.onError((err: any, c: any) => {
  console.error('Global error:', err);
  // For non-API paths, try to serve the HTML shell instead of returning JSON 500
  const url = new URL(c.req.url);
  if (!url.pathname.startsWith('/api')) {
    try {
      const rootUrl = new URL('/index.html', c.req.url).toString();
      return c.env.ASSETS?.fetch(new Request(rootUrl)) || new Response('<!doctype html><html><head><meta charset="utf-8"><title>Light in Silence</title></head><body><div id="app"></div></body></html>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    } catch {}
    return new Response('<!doctype html><html><head><meta charset="utf-8"><title>Light in Silence</title></head><body><div id="app"></div></body></html>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

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