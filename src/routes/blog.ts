import { Hono } from 'hono';
import { DatabaseService } from '../services/database';
import { AuthService } from '../services/auth';
import { Env } from '../index';

const blogRoutes = new Hono<{ Bindings: Env }>();

// Public: list posts
blogRoutes.get('/', async (c) => {
  const db = new DatabaseService(c.env.DB);
  const posts = await db.getPosts();
  return c.json({ posts });
});

// Public: view single post
blogRoutes.get('/:postId', async (c) => {
  const id = parseInt(c.req.param('postId'));
  const db = new DatabaseService(c.env.DB);
  const post = await db.getPostById(id);
  if (!post) return c.json({ error: 'Not found' }, 404);
  return c.json({ post });
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

// Admin: create post
blogRoutes.post('/', adminOnly, async (c) => {
  const body = await c.req.json();
  const { title, body: content } = body;
  if (!title || !content) return c.json({ error: 'Missing fields' }, 400);
  const db = new DatabaseService(c.env.DB);
  const user = c.get('user');
  const post = await db.createPost({ title, body: content, author_id: user.id });
  return c.json({ success: true, post });
});

// Admin: update post
blogRoutes.put('/:postId', adminOnly, async (c) => {
  const id = parseInt(c.req.param('postId'));
  const updates = await c.req.json();
  const db = new DatabaseService(c.env.DB);
  const post = await db.updatePost(id, updates);
  if (!post) return c.json({ error: 'Not found' }, 404);
  return c.json({ success: true, post });
});

// Admin: delete post
blogRoutes.delete('/:postId', adminOnly, async (c) => {
  const id = parseInt(c.req.param('postId'));
  const db = new DatabaseService(c.env.DB);
  const ok = await db.deletePost(id);
  if (!ok) return c.json({ error: 'Failed' }, 500);
  return c.json({ success: true });
});

export { blogRoutes };


