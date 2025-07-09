import { Hono } from 'hono';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../services/database';
import { AuthService } from '../services/auth';
import { AIService } from '../services/ai';
import { Env } from '../index';

const letterRoutes = new Hono<{ Bindings: Env }>();

// Middleware to extract user from token (optional for some routes)
const authMiddleware = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const db = new DatabaseService(c.env.DB);
    const auth = new AuthService(db, c.env);
    const user = await auth.getUserFromToken(token);
    c.set('user', user);
  }
  await next();
};

// Submit a new letter
letterRoutes.post('/submit', authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const { topic, content, replyMethod, anonymousEmail } = body;

    if (!content || content.trim().length < 10) {
      return c.json({ error: 'Letter content must be at least 10 characters long' }, 400);
    }

    const db = new DatabaseService(c.env.DB);
    const ai = new AIService(c.env);

    // Generate unique ID for the letter
    const uniqueId = uuidv4();

    // Moderate content
    const moderationResult = await ai.moderateContent(content);
    
    // Create letter
    const letter = await db.createLetter({
      unique_id: uniqueId,
      topic: topic || null,
      content: content.trim(),
      anonymous_email: replyMethod === 'anonymous-email' ? anonymousEmail : null,
      reply_method: replyMethod || 'website',
      is_flagged: moderationResult.flagged,
      is_processed: false,
      source: 'online',
      location: null,
      responder_id: null,
    });

    // If user requested AI reply
    if (replyMethod === 'ai') {
      try {
        const aiResponseContent = await ai.generateSupportiveResponse(content);
        
        await db.createResponse({
          content: aiResponseContent,
          response_type: 'ai',
          letter_id: letter.id,
          ai_model: 'gemini-2.0-flash',
          moderation_score: null,
        });

        // Mark letter as processed
        await db.updateLetter(letter.id, { is_processed: true });
      } catch (aiError) {
        console.error('AI response generation failed:', aiError);
        // Continue without AI response - volunteer can respond later
      }
    }

    return c.json({
      success: true,
      letterId: uniqueId,
      flagged: moderationResult.flagged,
      message: moderationResult.flagged 
        ? 'Your letter has been submitted and flagged for review due to concerning content. Please contact emergency services if you are in immediate danger.'
        : 'Your letter has been submitted successfully!',
    });
  } catch (error: any) {
    console.error('Letter submission error:', error);
    return c.json({ 
      error: error.message || 'Failed to submit letter' 
    }, 500);
  }
});

// Get letter by unique ID (public endpoint for checking responses)
letterRoutes.get('/:uniqueId', async (c) => {
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
        replyMethod: letter.reply_method,
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

// Get unprocessed letters (requires volunteer access)
letterRoutes.get('/queue/unprocessed', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const db = new DatabaseService(c.env.DB);
    const auth = new AuthService(db, c.env);

    if (!auth.hasVolunteerAccess(user)) {
      return c.json({ error: 'Volunteer access required' }, 403);
    }

    const letters = await db.getUnprocessedLetters();

    return c.json({
      letters: letters.map(letter => ({
        id: letter.unique_id,
        topic: letter.topic,
        content: letter.content.substring(0, 200) + (letter.content.length > 200 ? '...' : ''),
        createdAt: letter.created_at,
        source: letter.source,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching unprocessed letters:', error);
    return c.json({ 
      error: error.message || 'Failed to fetch unprocessed letters' 
    }, 500);
  }
});

// Get flagged letters (requires admin access)
letterRoutes.get('/queue/flagged', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const db = new DatabaseService(c.env.DB);
    const auth = new AuthService(db, c.env);

    if (!auth.hasAdminAccess(user)) {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const letters = await db.getFlaggedLetters();

    return c.json({
      letters: letters.map(letter => ({
        id: letter.unique_id,
        topic: letter.topic,
        content: letter.content,
        createdAt: letter.created_at,
        source: letter.source,
        isProcessed: letter.is_processed,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching flagged letters:', error);
    return c.json({ 
      error: error.message || 'Failed to fetch flagged letters' 
    }, 500);
  }
});

// Respond to a letter (requires volunteer access)
letterRoutes.post('/:uniqueId/respond', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const db = new DatabaseService(c.env.DB);
    const auth = new AuthService(db, c.env);
    const ai = new AIService(c.env);

    if (!auth.hasVolunteerAccess(user)) {
      return c.json({ error: 'Volunteer access required' }, 403);
    }

    const uniqueId = c.req.param('uniqueId');
    const body = await c.req.json();
    const { content, responseType } = body;

    if (!content || content.trim().length < 10) {
      return c.json({ error: 'Response content must be at least 10 characters long' }, 400);
    }

    const letter = await db.getLetterByUniqueId(uniqueId);
    if (!letter) {
      return c.json({ error: 'Letter not found' }, 404);
    }

    // Create human response
    await db.createResponse({
      content: content.trim(),
      response_type: responseType === 'hybrid' ? 'hybrid' : 'human',
      letter_id: letter.id,
      ai_model: null,
      moderation_score: null,
    });

    // If hybrid response, also generate AI response
    if (responseType === 'hybrid') {
      try {
        const aiResponseContent = await ai.generateSupportiveResponse(letter.content);
        await db.createResponse({
          content: aiResponseContent,
          response_type: 'ai',
          letter_id: letter.id,
          ai_model: 'gemini-2.0-flash',
          moderation_score: null,
        });
      } catch (aiError) {
        console.error('AI response generation failed:', aiError);
        // Continue without AI response
      }
    }

    // Mark letter as processed
    await db.updateLetter(letter.id, { 
      is_processed: true, 
      responder_id: user.id 
    });

    return c.json({
      success: true,
      message: 'Response submitted successfully',
    });
  } catch (error: any) {
    console.error('Error submitting response:', error);
    return c.json({ 
      error: error.message || 'Failed to submit response' 
    }, 500);
  }
});

export { letterRoutes }; 