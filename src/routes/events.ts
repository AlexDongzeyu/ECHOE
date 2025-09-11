import { Hono } from 'hono';
import { DatabaseService } from '../services/database';
import { AuthService } from '../services/auth';
import { Env } from '../index';

const eventsRoutes = new Hono<{ Bindings: Env }>();

// Public: list events
eventsRoutes.get('/', async (c) => {
  const db = new DatabaseService(c.env.DB);
  const events = await db.getEvents();
  return c.json({ events });
});

// Public: view event
eventsRoutes.get('/:eventId', async (c) => {
  const id = parseInt(c.req.param('eventId'));
  const db = new DatabaseService(c.env.DB);
  const event = await db.getEventById(id);
  if (!event) return c.json({ error: 'Not found' }, 404);
  return c.json({ event });
});

// Admin-only middleware
const adminOnly = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return c.json({ error: 'Auth required' }, 401);
  const token = authHeader.substring(7);
  const db = new DatabaseService(c.env.DB);
  const auth = new AuthService(db, c.env);
  const user = await auth.getUserFromToken(token);
  if (!user || !auth.hasAdminAccess(user)) return c.json({ error: 'Admin required' }, 403);
  c.set('user', user);
  await next();
};

// Admin: create event
eventsRoutes.post('/', adminOnly, async (c) => {
  const body = await c.req.json();
  const { title, objective, event_date, location, structure, registration_link } = body;
  if (!title || !objective || !event_date || !location) return c.json({ error: 'Missing fields' }, 400);
  const db = new DatabaseService(c.env.DB);
  const event = await db.createEvent({ title, objective, event_date, location, structure, registration_link });
  return c.json({ success: true, event });
});

// Admin: update event
eventsRoutes.put('/:eventId', adminOnly, async (c) => {
  const id = parseInt(c.req.param('eventId'));
  const updates = await c.req.json();
  const db = new DatabaseService(c.env.DB);
  const event = await db.updateEvent(id, updates);
  if (!event) return c.json({ error: 'Not found' }, 404);
  return c.json({ success: true, event });
});

// Admin: delete event
eventsRoutes.delete('/:eventId', adminOnly, async (c) => {
  const id = parseInt(c.req.param('eventId'));
  const db = new DatabaseService(c.env.DB);
  const ok = await db.deleteEvent(id);
  if (!ok) return c.json({ error: 'Failed' }, 500);
  return c.json({ success: true });
});

export { eventsRoutes };


