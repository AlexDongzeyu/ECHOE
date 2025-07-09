import { Hono } from 'hono';
import { DatabaseService } from '../services/database';
import { AuthService } from '../services/auth';
import { Env } from '../index';

const authRoutes = new Hono<{ Bindings: Env }>();

// Register route
authRoutes.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const db = new DatabaseService(c.env.DB);
    const auth = new AuthService(db, c.env);

    const result = await auth.register({ username, email, password });

    return c.json({
      success: true,
      user: result.user,
      token: result.token,
    });
  } catch (error: any) {
    return c.json({ 
      error: error.message || 'Registration failed' 
    }, 400);
  }
});

// Login route
authRoutes.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: 'Missing email or password' }, 400);
    }

    const db = new DatabaseService(c.env.DB);
    const auth = new AuthService(db, c.env);

    const result = await auth.login({ email, password });

    return c.json({
      success: true,
      user: result.user,
      token: result.token,
    });
  } catch (error: any) {
    return c.json({ 
      error: error.message || 'Login failed' 
    }, 401);
  }
});

// Logout route (for session-based auth)
authRoutes.post('/logout', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const token = authHeader.substring(7);
    const db = new DatabaseService(c.env.DB);
    const auth = new AuthService(db, c.env);

    // If using session-based auth, we could delete the session here
    // For JWT, we just return success (token will expire naturally)
    
    return c.json({ success: true, message: 'Logged out successfully' });
  } catch (error: any) {
    return c.json({ 
      error: error.message || 'Logout failed' 
    }, 400);
  }
});

// Get current user profile
authRoutes.get('/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const token = authHeader.substring(7);
    const db = new DatabaseService(c.env.DB);
    const auth = new AuthService(db, c.env);

    const user = await auth.getUserFromToken(token);
    if (!user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    return c.json({ user });
  } catch (error: any) {
    return c.json({ 
      error: error.message || 'Failed to get user profile' 
    }, 400);
  }
});

// Verify token
authRoutes.post('/verify', async (c) => {
  try {
    const body = await c.req.json();
    const { token } = body;

    if (!token) {
      return c.json({ error: 'No token provided' }, 400);
    }

    const db = new DatabaseService(c.env.DB);
    const auth = new AuthService(db, c.env);

    const payload = await auth.verifyJWT(token);
    if (!payload) {
      return c.json({ valid: false }, 200);
    }

    const user = await auth.getUserFromToken(token);
    if (!user) {
      return c.json({ valid: false }, 200);
    }

    return c.json({ 
      valid: true,
      user 
    });
  } catch (error: any) {
    return c.json({ 
      valid: false,
      error: error.message 
    }, 200);
  }
});

export { authRoutes }; 