-- Migration: 0001_initial.sql
-- Creates all the core tables for Light in Silence platform

-- Users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN', 'ULTIMATE_ADMIN')),
    is_volunteer BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Letters table
CREATE TABLE letters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unique_id TEXT UNIQUE NOT NULL,
    topic TEXT,
    content TEXT NOT NULL,
    anonymous_email TEXT,
    reply_method TEXT,
    is_flagged BOOLEAN DEFAULT FALSE,
    is_processed BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    source TEXT DEFAULT 'online',
    location TEXT,
    responder_id INTEGER,
    FOREIGN KEY (responder_id) REFERENCES users(id)
);

-- Responses table
CREATE TABLE responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    response_type TEXT,
    letter_id INTEGER NOT NULL,
    ai_model TEXT,
    moderation_score REAL,
    FOREIGN KEY (letter_id) REFERENCES letters(id) ON DELETE CASCADE
);

-- Posts table (for blog functionality)
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    author_id INTEGER NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Events table
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    objective TEXT NOT NULL,
    event_date DATETIME NOT NULL,
    location TEXT NOT NULL,
    structure TEXT,
    registration_link TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Physical mailboxes table
CREATE TABLE physical_mailboxes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    province TEXT NOT NULL,
    postal_code TEXT,
    description TEXT,
    operating_hours TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table for user authentication
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_letters_unique_id ON letters(unique_id);
CREATE INDEX idx_letters_responder ON letters(responder_id);
CREATE INDEX idx_responses_letter ON responses(letter_id);
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username); 