import { Hono } from 'hono';
import { DatabaseService } from '../services/database';
import { AuthService } from '../services/auth';
import { Env } from '../index';

const adminRoutes = new Hono<{ Bindings: Env }>();

// Middleware to require admin access
const adminMiddleware = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Authentication required' }, 401);
  }

  const token = authHeader.substring(7);
  const db = new DatabaseService(c.env.DB);
  const auth = new AuthService(db, c.env);
  const user = await auth.getUserFromToken(token);

  if (!user || !auth.hasAdminAccess(user)) {
    return c.json({ error: 'Admin access required' }, 403);
  }

  c.set('user', user);
  await next();
};

// Ultimate admin middleware
const ultimateAdminMiddleware = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Authentication required' }, 401);
  }

  const token = authHeader.substring(7);
  const db = new DatabaseService(c.env.DB);
  const auth = new AuthService(db, c.env);
  const user = await auth.getUserFromToken(token);

  if (!user || !auth.canManageUsers(user)) {
    return c.json({ error: 'Ultimate Administrator access required' }, 403);
  }

  c.set('user', user);
  await next();
};

// Get admin dashboard statistics
adminRoutes.get('/dashboard', adminMiddleware, async (c) => {
  try {
    const db = new DatabaseService(c.env.DB);
    const stats = await db.getStats();
    
    return c.json({
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Admin dashboard error:', error);
    return c.json({ 
      error: error.message || 'Failed to fetch dashboard data' 
    }, 500);
  }
});

// Get all users (Ultimate Admin only)
adminRoutes.get('/users', ultimateAdminMiddleware, async (c) => {
  try {
    const db = new DatabaseService(c.env.DB);
    const users = await db.getAllUsers();
    
    // Don't send password hashes
    const safeUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      isVolunteer: user.is_volunteer,
      isAdmin: user.is_admin,
      createdAt: user.created_at
    }));
    
    return c.json({ users: safeUsers });
  } catch (error: any) {
    console.error('Admin get users error:', error);
    return c.json({ 
      error: error.message || 'Failed to fetch users' 
    }, 500);
  }
});

// Promote user to admin
adminRoutes.post('/users/:userId/promote', ultimateAdminMiddleware, async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'));
    const currentUser = c.get('user');
    
    if (userId === currentUser.id) {
      return c.json({ error: 'Cannot change your own role' }, 400);
    }

    const db = new DatabaseService(c.env.DB);
    const user = await db.getUserById(userId);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    if (user.role === 'ULTIMATE_ADMIN') {
      return c.json({ error: 'Cannot change Ultimate Administrator role' }, 400);
    }

    const updatedUser = await db.updateUser(userId, {
      role: 'ADMIN',
      is_admin: true,
    });

    return c.json({
      success: true,
      message: `${user.username} has been promoted to Administrator`,
      user: updatedUser
    });
  } catch (error: any) {
    console.error('Admin promote user error:', error);
    return c.json({ 
      error: error.message || 'Failed to promote user' 
    }, 500);
  }
});

// Demote admin to regular user
adminRoutes.post('/users/:userId/demote', ultimateAdminMiddleware, async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'));
    const currentUser = c.get('user');
    
    if (userId === currentUser.id) {
      return c.json({ error: 'Cannot change your own role' }, 400);
    }

    const db = new DatabaseService(c.env.DB);
    const user = await db.getUserById(userId);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    if (user.role === 'ULTIMATE_ADMIN') {
      return c.json({ error: 'Cannot demote Ultimate Administrator' }, 400);
    }

    const updatedUser = await db.updateUser(userId, {
      role: 'USER',
      is_admin: false,
    });

    return c.json({
      success: true,
      message: `${user.username} has been demoted to regular User`,
      user: updatedUser
    });
  } catch (error: any) {
    console.error('Admin demote user error:', error);
    return c.json({ 
      error: error.message || 'Failed to demote user' 
    }, 500);
  }
});

// Grant volunteer access
adminRoutes.post('/users/:userId/grant-volunteer', adminMiddleware, async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'));
    const db = new DatabaseService(c.env.DB);
    
    const user = await db.getUserById(userId);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    const updatedUser = await db.updateUser(userId, {
      is_volunteer: true,
    });

    return c.json({
      success: true,
      message: `${user.username} has been granted volunteer access`,
      user: updatedUser
    });
  } catch (error: any) {
    console.error('Admin grant volunteer error:', error);
    return c.json({ 
      error: error.message || 'Failed to grant volunteer access' 
    }, 500);
  }
});

// Revoke volunteer access
adminRoutes.post('/users/:userId/revoke-volunteer', adminMiddleware, async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'));
    const db = new DatabaseService(c.env.DB);
    
    const user = await db.getUserById(userId);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    const updatedUser = await db.updateUser(userId, {
      is_volunteer: false,
    });

    return c.json({
      success: true,
      message: `Volunteer access has been revoked from ${user.username}`,
      user: updatedUser
    });
  } catch (error: any) {
    console.error('Admin revoke volunteer error:', error);
    return c.json({ 
      error: error.message || 'Failed to revoke volunteer access' 
    }, 500);
  }
});

// Delete user (Ultimate Admin only)
adminRoutes.delete('/users/:userId', ultimateAdminMiddleware, async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'));
    const currentUser = c.get('user');
    
    if (userId === currentUser.id) {
      return c.json({ error: 'Cannot delete your own account' }, 400);
    }

    const db = new DatabaseService(c.env.DB);
    const user = await db.getUserById(userId);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    if (user.role === 'ULTIMATE_ADMIN') {
      return c.json({ error: 'Cannot delete Ultimate Administrator' }, 400);
    }

    const success = await db.deleteUser(userId);
    
    if (!success) {
      return c.json({ error: 'Failed to delete user' }, 500);
    }

    return c.json({
      success: true,
      message: `User ${user.username} has been permanently deleted`
    });
  } catch (error: any) {
    console.error('Admin delete user error:', error);
    return c.json({ 
      error: error.message || 'Failed to delete user' 
    }, 500);
  }
});

// Delete letter (Admin only)
adminRoutes.delete('/letters/:uniqueId', adminMiddleware, async (c) => {
  try {
    const uniqueId = c.req.param('uniqueId');
    const db = new DatabaseService(c.env.DB);
    
    const letter = await db.getLetterByUniqueId(uniqueId);
    if (!letter) {
      return c.json({ error: 'Letter not found' }, 404);
    }

    const success = await db.deleteLetter(letter.id);
    
    if (!success) {
      return c.json({ error: 'Failed to delete letter' }, 500);
    }

    return c.json({
      success: true,
      message: 'Letter and all associated responses have been deleted'
    });
  } catch (error: any) {
    console.error('Admin delete letter error:', error);
    return c.json({ 
      error: error.message || 'Failed to delete letter' 
    }, 500);
  }
});

export { adminRoutes }; 