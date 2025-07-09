import { Hono } from 'hono';
import { Env } from '../index';

const staticRoutes = new Hono<{ Bindings: Env }>();

// Serve the main application HTML
staticRoutes.get('/', async (c) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Light in Silence - Mental Health Support</title>
    <link rel="stylesheet" href="/static/css/style.css">
    <link rel="stylesheet" href="/static/css/chat.css">
    <link rel="stylesheet" href="/static/styles/home.css">
    <link rel="stylesheet" href="/static/styles/global.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div id="app">
        <!-- App will be rendered here by JavaScript -->
        <div class="loading">
            <h1>Light in Silence</h1>
            <p>Loading...</p>
        </div>
    </div>
    
    <!-- Load the frontend application -->
    <script src="/static/js/app.js"></script>
</body>
</html>`;

  return c.html(html);
});

// API routes for frontend navigation (SPA support)
const frontendRoutes = [
  '/submit',
  '/login',
  '/register',
  '/about',
  '/contact',
  '/resources',
  '/volunteer-info',
  '/donate',
  '/check-reply',
  '/admin',
  '/volunteer',
  '/response/*'
];

// Serve the main HTML for all frontend routes (SPA)
frontendRoutes.forEach(route => {
  staticRoutes.get(route, async (c) => {
    return staticRoutes.get('/')(c);
  });
});

// Handle response routes with parameters
staticRoutes.get('/response/:id', async (c) => {
  return staticRoutes.get('/')(c);
});

// Serve static files (CSS, JS, images)
staticRoutes.get('/static/*', async (c) => {
  const path = c.req.path;
  
  // Simple static file serving - in production you might want to use R2 or CDN
  // For now, return appropriate content types and placeholder responses
  
  if (path.endsWith('.css')) {
    return c.text('/* CSS files would be served from R2 or CDN */', 200, {
      'Content-Type': 'text/css'
    });
  }
  
  if (path.endsWith('.js')) {
    return c.text('// JavaScript files would be served from R2 or CDN', 200, {
      'Content-Type': 'application/javascript'
    });
  }
  
  if (path.match(/\.(png|jpg|jpeg|gif|svg)$/)) {
    return c.text('Image would be served from R2 or CDN', 200, {
      'Content-Type': 'image/png'
    });
  }
  
  return c.text('File not found', 404);
});

// Health check for static assets
staticRoutes.get('/static/health', async (c) => {
  return c.json({
    status: 'ok',
    message: 'Static file serving is working',
    timestamp: new Date().toISOString()
  });
});

export { staticRoutes }; 