import { Hono } from 'hono';
import { AIService } from '../services/ai';
import { Env } from '../index';

const chatRoutes = new Hono<{ Bindings: Env }>();

// Chat with AI endpoint
chatRoutes.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { message, type } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return c.json({ error: 'Message is required' }, 400);
    }

    const ai = new AIService(c.env);

    // First perform content moderation
    const moderationResult = await ai.moderateContent(message);
    
    if (moderationResult.flagged) {
      return c.json({
        status: 'flagged',
        message: moderationResult.message,
        resources: {
          canadaCrisisLine: '1-833-456-4566',
          textLine: '45645',
          emergency: '911'
        }
      });
    }

    // Generate AI response based on type
    const responseType = type || 'supportive';
    let aiResponse: string;

    if (['supportive', 'practical', 'reflective'].includes(responseType)) {
      aiResponse = await ai.generateResponseWithType(message, responseType);
    } else {
      aiResponse = await ai.generateSupportiveResponse(message);
    }

    return c.json({
      status: 'success',
      message: aiResponse,
      type: responseType,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    return c.json({ 
      error: 'Failed to process message',
      message: 'I apologize, but I am having trouble responding right now. Please try again in a moment.'
    }, 500);
  }
});

// Moderate content endpoint (used by frontend before sending)
chatRoutes.post('/moderate', async (c) => {
  try {
    const body = await c.req.json();
    const { content } = body;

    if (!content || typeof content !== 'string') {
      return c.json({ error: 'Content is required' }, 400);
    }

    const ai = new AIService(c.env);
    const moderationResult = await ai.moderateContent(content);

    if (moderationResult.flagged) {
      return c.json({
        status: 'flagged',
        message: moderationResult.message,
        resources: {
          canadaCrisisLine: '1-833-456-4566',
          textLine: '45645',
          emergency: '911'
        }
      });
    }

    return c.json({
      status: 'approved',
      message: null
    });
  } catch (error: any) {
    console.error('Moderation error:', error);
    return c.json({ 
      status: 'approved', // Default to approved if moderation fails
      message: null
    });
  }
});

// Get chat settings/configuration
chatRoutes.get('/settings', async (c) => {
  return c.json({
    availableTypes: [
      {
        id: 'supportive',
        name: 'Supportive',
        description: 'Emotional support and validation',
        icon: '💝'
      },
      {
        id: 'practical',
        name: 'Practical',
        description: 'Concrete advice and actionable steps',
        icon: '🛠️'
      },
      {
        id: 'reflective',
        name: 'Reflective',
        description: 'Questions to explore feelings deeper',
        icon: '🤔'
      }
    ],
    defaultType: 'supportive',
    maxMessageLength: 2000,
    moderationEnabled: true
  });
});

// Test AI connection
chatRoutes.get('/test', async (c) => {
  try {
    const ai = new AIService(c.env);
    const isConnected = await ai.testConnection();
    
    return c.json({
      status: isConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('AI test error:', error);
    return c.json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
});

export { chatRoutes }; 