import { Env } from '../index';

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: 'USER' | 'ADMIN' | 'ULTIMATE_ADMIN';
  is_volunteer: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface Letter {
  id: number;
  unique_id: string;
  topic?: string;
  content: string;
  anonymous_email?: string;
  reply_method?: string;
  is_flagged: boolean;
  is_processed: boolean;
  created_at: string;
  updated_at: string;
  source: string;
  location?: string;
  responder_id?: number;
}

export interface Response {
  id: number;
  content: string;
  created_at: string;
  response_type?: string;
  letter_id: number;
  ai_model?: string;
  moderation_score?: number;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  created_at: string;
  author_id: number;
}

export interface Event {
  id: number;
  title: string;
  objective: string;
  event_date: string;
  location: string;
  structure?: string;
  registration_link?: string;
  created_at: string;
}

export interface PhysicalMailbox {
  id: number;
  name: string;
  address: string;
  city: string;
  province: string;
  postal_code?: string;
  description?: string;
  operating_hours?: string;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
}

export interface Session {
  id: string;
  user_id: number;
  created_at: string;
  expires_at: string;
}

export class DatabaseService {
  constructor(private db: D1Database) {}

  // User operations
  async createUser(userData: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const result = await this.db.prepare(`
      INSERT INTO users (username, email, password_hash, role, is_volunteer, is_admin)
      VALUES (?, ?, ?, ?, ?, ?)
      RETURNING *
    `).bind(
      userData.username,
      userData.email,
      userData.password_hash,
      userData.role,
      userData.is_volunteer,
      userData.is_admin
    ).first<User>();

    if (!result) {
      throw new Error('Failed to create user');
    }
    return result;
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.db.prepare('SELECT * FROM users WHERE id = ?').bind(id).first<User>();
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first<User>();
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return await this.db.prepare('SELECT * FROM users WHERE username = ?').bind(username).first<User>();
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    
    const result = await this.db.prepare(`
      UPDATE users SET ${setClause} WHERE id = ? RETURNING *
    `).bind(...values, id).first<User>();

    return result;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await this.db.prepare('DELETE FROM users WHERE id = ?').bind(id).run();
    return result.success;
  }

  async getAllUsers(): Promise<User[]> {
    const result = await this.db.prepare('SELECT * FROM users ORDER BY created_at DESC').all<User>();
    return result.results;
  }

  // Letter operations
  async createLetter(letterData: Omit<Letter, 'id' | 'created_at' | 'updated_at'>): Promise<Letter> {
    const result = await this.db.prepare(`
      INSERT INTO letters (unique_id, topic, content, anonymous_email, reply_method, is_flagged, is_processed, source, location, responder_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `).bind(
      letterData.unique_id,
      letterData.topic,
      letterData.content,
      letterData.anonymous_email,
      letterData.reply_method,
      letterData.is_flagged,
      letterData.is_processed,
      letterData.source,
      letterData.location,
      letterData.responder_id
    ).first<Letter>();

    if (!result) {
      throw new Error('Failed to create letter');
    }
    return result;
  }

  async getLetterById(id: number): Promise<Letter | null> {
    return await this.db.prepare('SELECT * FROM letters WHERE id = ?').bind(id).first<Letter>();
  }

  async getLetterByUniqueId(uniqueId: string): Promise<Letter | null> {
    return await this.db.prepare('SELECT * FROM letters WHERE unique_id = ?').bind(uniqueId).first<Letter>();
  }

  async updateLetter(id: number, updates: Partial<Letter>): Promise<Letter | null> {
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    
    const result = await this.db.prepare(`
      UPDATE letters SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING *
    `).bind(...values, id).first<Letter>();

    return result;
  }

  async getUnprocessedLetters(): Promise<Letter[]> {
    const result = await this.db.prepare(`
      SELECT * FROM letters 
      WHERE is_processed = FALSE AND is_flagged = FALSE 
      ORDER BY created_at ASC
    `).all<Letter>();
    return result.results;
  }

  async getFlaggedLetters(): Promise<Letter[]> {
    const result = await this.db.prepare(`
      SELECT * FROM letters 
      WHERE is_flagged = TRUE 
      ORDER BY created_at DESC
    `).all<Letter>();
    return result.results;
  }

  async deleteLetter(id: number): Promise<boolean> {
    const result = await this.db.prepare('DELETE FROM letters WHERE id = ?').bind(id).run();
    return result.success;
  }

  // Response operations
  async createResponse(responseData: Omit<Response, 'id' | 'created_at'>): Promise<Response> {
    const result = await this.db.prepare(`
      INSERT INTO responses (content, response_type, letter_id, ai_model, moderation_score)
      VALUES (?, ?, ?, ?, ?)
      RETURNING *
    `).bind(
      responseData.content,
      responseData.response_type,
      responseData.letter_id,
      responseData.ai_model,
      responseData.moderation_score
    ).first<Response>();

    if (!result) {
      throw new Error('Failed to create response');
    }
    return result;
  }

  async getResponsesByLetterId(letterId: number): Promise<Response[]> {
    const result = await this.db.prepare(`
      SELECT * FROM responses 
      WHERE letter_id = ? 
      ORDER BY created_at ASC
    `).bind(letterId).all<Response>();
    return result.results;
  }

  async deleteResponse(id: number): Promise<boolean> {
    const result = await this.db.prepare('DELETE FROM responses WHERE id = ?').bind(id).run();
    return result.success;
  }

  // Session operations
  async createSession(sessionData: Session): Promise<Session> {
    const result = await this.db.prepare(`
      INSERT INTO sessions (id, user_id, expires_at)
      VALUES (?, ?, ?)
      RETURNING *
    `).bind(
      sessionData.id,
      sessionData.user_id,
      sessionData.expires_at
    ).first<Session>();

    if (!result) {
      throw new Error('Failed to create session');
    }
    return result;
  }

  async getSession(sessionId: string): Promise<Session | null> {
    return await this.db.prepare(`
      SELECT * FROM sessions 
      WHERE id = ? AND expires_at > CURRENT_TIMESTAMP
    `).bind(sessionId).first<Session>();
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    const result = await this.db.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
    return result.success;
  }

  async cleanExpiredSessions(): Promise<void> {
    await this.db.prepare('DELETE FROM sessions WHERE expires_at <= CURRENT_TIMESTAMP').run();
  }

  // Statistics
  async getStats() {
    const [userCount, letterCount, responseCount, unprocessedCount, flaggedCount] = await Promise.all([
      this.db.prepare('SELECT COUNT(*) as count FROM users').first<{count: number}>(),
      this.db.prepare('SELECT COUNT(*) as count FROM letters').first<{count: number}>(),
      this.db.prepare('SELECT COUNT(*) as count FROM responses').first<{count: number}>(),
      this.db.prepare('SELECT COUNT(*) as count FROM letters WHERE is_processed = FALSE').first<{count: number}>(),
      this.db.prepare('SELECT COUNT(*) as count FROM letters WHERE is_flagged = TRUE').first<{count: number}>(),
    ]);

    return {
      totalUsers: userCount?.count || 0,
      totalLetters: letterCount?.count || 0,
      totalResponses: responseCount?.count || 0,
      unprocessedLetters: unprocessedCount?.count || 0,
      flaggedLetters: flaggedCount?.count || 0,
    };
  }
} 