import { Hono } from 'hono';
import { DatabaseService } from '../services/database';
import { AuthService } from '../services/auth';
import { Env } from '../index';

const volunteerRoutes = new Hono<{ Bindings: Env }>();

// Middleware to require volunteer access
const volunteerMiddleware = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Authentication required' }, 401);
  }

  const token = authHeader.substring(7);
  const db = new DatabaseService(c.env.DB);
  const auth = new AuthService(db, c.env);
  const user = await auth.getUserFromToken(token);

  if (!user || !auth.hasVolunteerAccess(user)) {
    return c.json({ error: 'Volunteer access required' }, 403);
  }

  c.set('user', user);
  await next();
};

// Get volunteer dashboard data
volunteerRoutes.get('/dashboard', volunteerMiddleware, async (c) => {
  try {
    const db = new DatabaseService(c.env.DB);
    
    const [unprocessedLetters, flaggedLetters] = await Promise.all([
      db.getUnprocessedLetters(),
      db.getFlaggedLetters()
    ]);

    return c.json({
      unprocessedLetters: unprocessedLetters.map(letter => ({
        id: letter.unique_id,
        topic: letter.topic,
        content: letter.content.substring(0, 200) + (letter.content.length > 200 ? '...' : ''),
        createdAt: letter.created_at,
        source: letter.source,
      })),
      flaggedLetters: flaggedLetters.map(letter => ({
        id: letter.unique_id,
        topic: letter.topic,
        content: letter.content.substring(0, 200) + (letter.content.length > 200 ? '...' : ''),
        createdAt: letter.created_at,
        source: letter.source,
        isProcessed: letter.is_processed,
      })),
      counts: {
        unprocessed: unprocessedLetters.length,
        flagged: flaggedLetters.length,
      }
    });
  } catch (error: any) {
    console.error('Volunteer dashboard error:', error);
    return c.json({ 
      error: error.message || 'Failed to fetch dashboard data' 
    }, 500);
  }
});

// Get a specific letter for response (with full content)
volunteerRoutes.get('/letters/:uniqueId', volunteerMiddleware, async (c) => {
  try {
    const uniqueId = c.req.param('uniqueId');
    const db = new DatabaseService(c.env.DB);

    const letter = await db.getLetterByUniqueId(uniqueId);
    if (!letter) {
      return c.json({ error: 'Letter not found' }, 404);
    }

    const responses = await db.getResponsesByLetterId(letter.id);

    return c.json({
      letter: {
        id: letter.unique_id,
        topic: letter.topic,
        content: letter.content,
        createdAt: letter.created_at,
        isProcessed: letter.is_processed,
        isFlagged: letter.is_flagged,
        replyMethod: letter.reply_method,
        source: letter.source,
        location: letter.location,
      },
      responses: responses.map(r => ({
        id: r.id,
        content: r.content,
        type: r.response_type,
        createdAt: r.created_at,
        aiModel: r.ai_model,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching letter:', error);
    return c.json({ 
      error: error.message || 'Failed to fetch letter' 
    }, 500);
  }
});

export { volunteerRoutes }; 