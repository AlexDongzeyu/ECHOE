import { v4 as uuidv4 } from 'uuid';
import { User, DatabaseService } from './database';
import { Env } from '../index';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: string;
  isVolunteer: boolean;
  isAdmin: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export class AuthService {
  constructor(private db: DatabaseService, private env: Env) {}

  async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    const hashedInput = await this.hashPassword(password);
    return hashedInput === hashedPassword;
  }

  async generateJWT(user: User): Promise<string> {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      iat: now,
      exp: now + (7 * 24 * 60 * 60) // 7 days
    };

    const encoder = new TextEncoder();
    const headerB64 = btoa(JSON.stringify(header)).replace(/[+\/=]/g, m => ({'+':'-', '/':'_', '=':''}[m]!));
    const payloadB64 = btoa(JSON.stringify(payload)).replace(/[+\/=]/g, m => ({'+':'-', '/':'_', '=':''}[m]!));
    
    const message = `${headerB64}.${payloadB64}`;
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(this.env.JWT_SECRET || 'default-secret'),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
    const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/[+\/=]/g, m => ({'+':'-', '/':'_', '=':''}[m]!));

    return `${message}.${signatureB64}`;
  }

  async verifyJWT(token: string): Promise<JWTPayload | null> {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const [headerB64, payloadB64, signatureB64] = parts;
      
      // Verify signature
      const encoder = new TextEncoder();
      const message = `${headerB64}.${payloadB64}`;
      
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(this.env.JWT_SECRET || 'default-secret'),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
      );

      const signature = Uint8Array.from(
        atob(signatureB64.replace(/[-_]/g, m => ({'-':'+', '_':'/'}[m]!))), 
        c => c.charCodeAt(0)
      );

      const isValid = await crypto.subtle.verify('HMAC', key, signature, encoder.encode(message));
      if (!isValid) return null;

      // Decode payload
      const payloadJson = atob(payloadB64.replace(/[-_]/g, m => ({'-':'+', '_':'/'}[m]!)));
      const payload: JWTPayload = JSON.parse(payloadJson);

      // Check expiration
      if (payload.exp < Math.floor(Date.now() / 1000)) return null;

      return payload;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null;
    }
  }

  async register(registerData: RegisterRequest): Promise<{ user: AuthUser; token: string }> {
    // Check if user already exists
    const existingUser = await this.db.getUserByEmail(registerData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const existingUsername = await this.db.getUserByUsername(registerData.username);
    if (existingUsername) {
      throw new Error('Username is already taken');
    }

    // Validate password strength
    if (registerData.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Hash password
    const passwordHash = await this.hashPassword(registerData.password);

    // Create user
    const user = await this.db.createUser({
      username: registerData.username,
      email: registerData.email,
      password_hash: passwordHash,
      role: 'USER',
      is_volunteer: true, // Default to volunteer access
      is_admin: false,
    });

    // Generate JWT
    const token = await this.generateJWT(user);

    return {
      user: this.formatUser(user),
      token,
    };
  }

  async login(loginData: LoginRequest): Promise<{ user: AuthUser; token: string }> {
    // Find user by email
    const user = await this.db.getUserByEmail(loginData.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await this.comparePassword(loginData.password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT
    const token = await this.generateJWT(user);

    return {
      user: this.formatUser(user),
      token,
    };
  }

  async getUserFromToken(token: string): Promise<AuthUser | null> {
    const payload = await this.verifyJWT(token);
    if (!payload) {
      return null;
    }

    const user = await this.db.getUserById(payload.userId);
    if (!user) {
      return null;
    }

    return this.formatUser(user);
  }

  formatUser(user: User): AuthUser {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      isVolunteer: user.is_volunteer,
      isAdmin: user.is_admin || user.role === 'ADMIN' || user.role === 'ULTIMATE_ADMIN',
    };
  }

  // Authorization helpers
  hasAdminAccess(user: AuthUser): boolean {
    return user.role === 'ADMIN' || user.role === 'ULTIMATE_ADMIN';
  }

  canManageUsers(user: AuthUser): boolean {
    return user.role === 'ULTIMATE_ADMIN';
  }

  hasVolunteerAccess(user: AuthUser): boolean {
    return user.isVolunteer || this.hasAdminAccess(user);
  }

  // Session management (alternative to JWT for longer sessions)
  async createSession(userId: number): Promise<string> {
    const sessionId = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await this.db.createSession({
      id: sessionId,
      user_id: userId,
      created_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
    });

    return sessionId;
  }

  async getUserFromSession(sessionId: string): Promise<AuthUser | null> {
    const session = await this.db.getSession(sessionId);
    if (!session) {
      return null;
    }

    const user = await this.db.getUserById(session.user_id);
    if (!user) {
      return null;
    }

    return this.formatUser(user);
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.db.deleteSession(sessionId);
  }

  async cleanupExpiredSessions(): Promise<void> {
    await this.db.cleanExpiredSessions();
  }
} 