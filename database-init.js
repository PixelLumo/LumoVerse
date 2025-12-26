/**
 * Database Initialization for SQLite3
 * Separate file to handle async database setup
 */

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DATABASE_PATH = process.env.DATABASE_PATH || './database/db.sqlite';

// Ensure database directory exists
if (!fs.existsSync(path.dirname(DATABASE_PATH))) {
    fs.mkdirSync(path.dirname(DATABASE_PATH), { recursive: true });
}

// Initialize database with proper error handling
function initDatabase() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DATABASE_PATH, (err) => {
            if (err) {
                console.error('❌ Database connection error:', err.message);
                reject(err);
            } else {
                console.log('✅ Connected to SQLite database');
                
                // Run table creation sequentially
                createTables(db)
                    .then(() => {
                        resolve(db);
                    })
                    .catch(reject);
            }
        });
    });
}

// Create all tables
function createTables(db) {
    return new Promise((resolve, reject) => {
        const tables = [
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'user',
                avatar TEXT,
                bio TEXT,
                allow_messages INTEGER DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            
            `CREATE TABLE IF NOT EXISTS posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                file_path TEXT,
                likes INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )`,
            
            `CREATE TABLE IF NOT EXISTS comments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                post_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                content TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )`,
            
            `CREATE TABLE IF NOT EXISTS likes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                post_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(post_id, user_id),
                FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )`,
            
            `CREATE TABLE IF NOT EXISTS notifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                type TEXT NOT NULL,
                message TEXT NOT NULL,
                related_post_id INTEGER,
                is_read INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (related_post_id) REFERENCES posts(id) ON DELETE CASCADE
            )`,
            
            `CREATE TABLE IF NOT EXISTS replies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                comment_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                content TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )`,
            
            `CREATE TABLE IF NOT EXISTS follows (
                follower_id INTEGER NOT NULL,
                following_id INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (follower_id, following_id),
                FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE
            )`,
            
            `CREATE TABLE IF NOT EXISTS user_sessions (
                user_id INTEGER PRIMARY KEY,
                username TEXT UNIQUE,
                is_online INTEGER DEFAULT 0,
                last_seen TEXT
            )`,
            
            `CREATE TABLE IF NOT EXISTS password_reset_tokens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                token TEXT UNIQUE NOT NULL,
                expires_at DATETIME NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )`
        ];

        // Execute tables sequentially
        let completed = 0;
        const executeNext = () => {
            if (completed >= tables.length) {
                resolve();
                return;
            }

            db.run(tables[completed], (err) => {
                if (err) {
                    console.error(`Error creating table ${completed}:`, err);
                    reject(err);
                } else {
                    completed++;
                    executeNext();
                }
            });
        };

        executeNext();
    });
}

module.exports = { initDatabase };
