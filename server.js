/**
 * PixelLumo Backend Server
 * Full-stack backend with authentication, file uploads, real-time notifications
 * 
 * Features:
 * - User authentication with JWT
 * - Password hashing with bcrypt
 * - SQLite database for persistent storage
 * - File uploads with multer
 * - Real-time notifications with Socket.IO
 * - Admin controls for content moderation
 */

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { initDatabase } = require('./database-init');

// Initialize Express & Socket.IO
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST", "DELETE", "PATCH"]
    }
});

const SECRET_KEY = process.env.SECRET_KEY || "pixelLumoSecret";
const PORT = process.env.PORT || 5000;
const DATABASE_PATH = process.env.DATABASE_PATH || './database/db.sqlite';
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE || 5242880; // 5MB
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Email Configuration
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Test email connection
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter.verify((error, success) => {
        if (error) {
            console.warn('⚠️  Email configuration error:', error.message);
        } else {
            console.log('✅ Email service connected');
        }
    });
} else {
    console.warn('⚠️  Email not configured. Set EMAIL_USER and EMAIL_PASS in .env');
}

// Ensure directories exist
if (!fs.existsSync('database')) fs.mkdirSync('database');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        // Allow all localhost origins (3000, 5500, 8000, etc.) for development
        const allowedLocalhost = origin && (origin.includes('localhost') || origin.includes('127.0.0.1'));
        const allowedGitHub = origin && origin.includes('github.io');
        const allowedProduction = origin === process.env.FRONTEND_URL;
        
        if (allowedLocalhost || allowedGitHub || allowedProduction || !origin) {
            callback(null, true);
        } else {
            console.warn('⚠️ CORS blocked origin:', origin);
            callback(new Error('CORS not allowed'));
        }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(`/${UPLOAD_DIR}`, express.static(UPLOAD_DIR));

// Database Connection - Initialize first
let db;
initDatabase()
    .then((database) => {
        db = database;
        // Start server after database is ready
        const PORT = process.env.PORT || 5000;
        server.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`📱 Frontend URL: ${FRONTEND_URL}`);
        });
        // Seed test users if needed
        seedTestUsers();
    })
    .catch((err) => {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    });

// Seed test users for development
function seedTestUsers() {
    // Check if users table is empty
    db.get('SELECT COUNT(*) as count FROM users', async (err, row) => {
        if (err || (row && row.count > 0)) {
            return; // Database already has users or error occurred
        }

        console.log('📝 Seeding test users...');

        // Hash test passwords (using async bcrypt.hash)
        try {
            const testPassword = await bcrypt.hash('test123', 10);
            const adminPassword = await bcrypt.hash('admin123', 10);

            // Insert test users
            const testUsers = [
                { username: 'testuser', email: 'test@example.com', password: testPassword, role: 'user' },
                { username: 'admin', email: 'admin@example.com', password: adminPassword, role: 'admin' },
                { username: 'demo', email: 'demo@example.com', password: testPassword, role: 'user' }
            ];

            let inserted = 0;
            testUsers.forEach(user => {
                db.run(
                    `INSERT INTO users(username, email, password, role) VALUES(?, ?, ?, ?)`,
                    [user.username, user.email, user.password, user.role],
                    function (err) {
                        if (!err) {
                            inserted++;
                            console.log(`  ✅ Created test user: ${user.username} (${user.email})`);
                        } else {
                            console.error(`  ❌ Failed to create ${user.username}:`, err.message);
                        }
                        
                        if (inserted === testUsers.length) {
                            console.log('✅ Test users seeding complete');
                        }
                    }
                );
            });
        } catch (error) {
            console.error('❌ Error seeding test users:', error.message);
        }
    });
}

// Multer Setup for File Uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        cb(null, `${timestamp}-${Math.random().toString(36).substring(7)}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// ===== AUTHENTICATION ROUTES =====

/**
 * GET /api/health
 * Simple health check
 */
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * POST /api/register
 * Register a new user
 */
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Hash password
        const hashed = await bcrypt.hash(password, 10);

        // Insert user
        db.run(
            `INSERT INTO users(username, email, password) VALUES(?, ?, ?)`,
            [username, email, hashed],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ error: 'Username or email already exists' });
                    }
                    return res.status(500).json({ error: 'Registration failed' });
                }
                res.status(201).json({ 
                    success: true, 
                    userId: this.lastID, 
                    message: 'User registered successfully' 
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/login
 * Authenticate user and return JWT
 */
app.post('/api/login', (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Missing username or password' });
        }

        // Support both username and email login
        db.get(
            `SELECT * FROM users WHERE username = ? OR email = ?`,
            [username, username],
            async (err, user) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                if (!user) return res.status(400).json({ error: 'User not found' });

                const match = await bcrypt.compare(password, user.password);
                if (!match) return res.status(400).json({ error: 'Invalid password' });

                // Update user session on login
                db.run(
                    `
                    INSERT INTO user_sessions (user_id, username, is_online, last_seen)
                    VALUES (?, ?, 1, datetime('now'))
                    ON CONFLICT(username) DO UPDATE SET
                        is_online = 1,
                        last_seen = datetime('now')
                    `,
                    [user.id, user.username],
                    (err) => {
                        if (err) {
                            console.error('Error updating user session:', err);
                        }
                    }
                );

                const token = jwt.sign(
                    { id: user.id, username: user.username, role: user.role },
                    SECRET_KEY,
                    { expiresIn: process.env.JWT_EXPIRY || '24h' }
                );

                res.json({
                    success: true,
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        avatar: user.avatar,
                        bio: user.bio
                    }
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/logout
 * Mark user as offline
 */
app.post('/api/logout', verifyToken, (req, res) => {
    try {
        db.run(
            `
            UPDATE user_sessions
            SET is_online = 0, last_seen = datetime('now')
            WHERE username = ?
            `,
            [req.user.username],
            (err) => {
                if (err) {
                    console.error('Error updating user session:', err);
                }
                res.json({ success: true, message: 'Logged out successfully' });
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/user
 * Get current user info from token
 */
app.get('/api/user', verifyToken, (req, res) => {
    db.get(
        `SELECT id, username, email, role, avatar, bio, created_at FROM users WHERE id = ?`,
        [req.user.id],
        (err, user) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        }
    );
});

/**
 * GET /api/admin/users
 * Get all users with session info (admin only)
 */
app.get('/api/admin/users', verifyToken, requireAdmin, (req, res) => {
    try {
        db.all(
            `
            SELECT u.id, u.username, u.email, u.created_at,
                   s.is_online, s.last_seen
            FROM users u
            LEFT JOIN user_sessions s ON u.username = s.username
            ORDER BY u.created_at DESC
            `,
            [],
            (err, rows) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(rows);
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/messaging/users
 * Get all users who accept private messages (excluding self)
 */
app.get('/api/messaging/users', verifyToken, (req, res) => {
    try {
        db.all(
            `
            SELECT id, username, avatar, allow_messages
            FROM users
            WHERE allow_messages = 1
            ORDER BY username ASC
            `,
            [],
            (err, rows) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(rows || []);
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * PATCH /api/user/allow-messages
 * Toggle allow private messages setting
 */
app.patch('/api/user/allow-messages', verifyToken, (req, res) => {
    try {
        const { allow_messages } = req.body;

        if (typeof allow_messages !== 'boolean') {
            return res.status(400).json({ error: 'allow_messages must be boolean' });
        }

        db.run(
            `UPDATE users SET allow_messages = ? WHERE id = ?`,
            [allow_messages ? 1 : 0, req.user.id],
            function (err) {
                if (err) return res.status(500).json({ error: 'Error updating setting' });
                res.json({ success: true, allow_messages });
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/forgot-password
 * Send password reset link to email
 */
app.post('/api/forgot-password', (req, res) => {
    try {
        const { emailOrUsername } = req.body;

        if (!emailOrUsername) {
            return res.status(400).json({ error: 'Email or username required' });
        }

        // Find user by email or username
        db.get(
            `SELECT * FROM users WHERE email = ? OR username = ?`,
            [emailOrUsername, emailOrUsername],
            (err, user) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                if (!user) return res.status(400).json({ error: 'User not found' });

                // Generate reset token
                const resetToken = crypto.randomBytes(32).toString('hex');
                const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

                // Store token in database
                db.run(
                    `INSERT INTO password_reset_tokens (user_id, token, expires_at)
                     VALUES (?, ?, ?)`,
                    [user.id, resetToken, expiresAt.toISOString()],
                    async (err) => {
                        if (err) {
                            console.error('Error storing reset token:', err);
                            return res.status(500).json({ error: 'Failed to create reset link' });
                        }

                        const resetLink = `${FRONTEND_URL}/reset-password.html?token=${resetToken}`;

                        // Check if email is configured
                        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
                            console.log(`\n📧 PASSWORD RESET LINK FOR ${user.email}:\n${resetLink}\n`);
                            return res.json({ 
                                success: true, 
                                message: 'Password reset link generated (check server console in development)',
                                devResetLink: resetLink
                            });
                        }

                        // Send email with reset link
                        const mailOptions = {
                            from: process.env.EMAIL_USER,
                            to: user.email,
                            subject: 'PixelLumo - Password Reset Request',
                            html: `
                                <h2>Password Reset Request</h2>
                                <p>Hi ${user.username},</p>
                                <p>You requested a password reset. Click the link below to reset your password:</p>
                                <p><a href="${resetLink}" style="padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
                                <p>This link will expire in 1 hour.</p>
                                <p>If you didn't request this, please ignore this email.</p>
                                <hr>
                                <p><small>PixelLumo Community Gaming Platform</small></p>
                            `
                        };

                        transporter.sendMail(mailOptions, (err, info) => {
                            if (err) {
                                console.error('Email send error:', err);
                                // Also log the link in case email fails
                                console.log(`\n📧 PASSWORD RESET LINK FOR ${user.email}:\n${resetLink}\n`);
                                return res.status(500).json({ 
                                    error: 'Failed to send email. Please try again later.',
                                    devResetLink: resetLink  // For debugging
                                });
                            }

                            console.log(`✅ Password reset email sent to ${user.email}`);
                            res.json({ 
                                success: true, 
                                message: 'Password reset link sent to your email'
                            });
                        });
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/verify-reset-token
 * Verify that a reset token is valid
 */
app.post('/api/verify-reset-token', (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Token required' });
        }

        db.get(
            `SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > datetime('now')`,
            [token],
            (err, result) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                
                if (!result) {
                    return res.json({ 
                        valid: false, 
                        error: 'Reset token is invalid or expired' 
                    });
                }

                res.json({ valid: true });
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/reset-password
 * Reset user password with valid token
 */
app.post('/api/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token and new password required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Find and validate token
        db.get(
            `SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > datetime('now')`,
            [token],
            async (err, resetRecord) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                if (!resetRecord) {
                    return res.status(400).json({ error: 'Invalid or expired reset token' });
                }

                try {
                    // Hash new password
                    const hashedPassword = await bcrypt.hash(newPassword, 10);

                    // Update user password
                    db.run(
                        `UPDATE users SET password = ? WHERE id = ?`,
                        [hashedPassword, resetRecord.user_id],
                        (err) => {
                            if (err) return res.status(500).json({ error: 'Error updating password' });

                            // Delete used token
                            db.run(
                                `DELETE FROM password_reset_tokens WHERE id = ?`,
                                [resetRecord.id],
                                (err) => {
                                    if (err) console.error('Error deleting token:', err);
                                }
                            );

                            res.json({ 
                                success: true, 
                                message: 'Password reset successfully' 
                            });
                        }
                    );
                } catch (hashError) {
                    res.status(500).json({ error: 'Error processing password' });
                }
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== AUTHENTICATION MIDDLEWARE =====

/**
 * Verify JWT Token
 */
function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1] || req.headers['x-access-token'];

    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = decoded;
        next();
    });
}

/**
 * Check if user is admin
 */
function requireAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
}

// ===== POST ROUTES =====

/**
 * POST /api/posts
 * Create a new post with optional file upload
 */
app.post('/api/posts', verifyToken, upload.single('file'), (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const file_path = req.file ? `/${UPLOAD_DIR}/${req.file.filename}` : null;

        db.run(
            `INSERT INTO posts(user_id, title, content, file_path) VALUES(?, ?, ?, ?)`,
            [req.user.id, title, content, file_path],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Error creating post' });
                }

                // Fetch the created post
                db.get(
                    `SELECT posts.*, users.username, users.avatar FROM posts 
                     JOIN users ON posts.user_id = users.id WHERE posts.id = ?`,
                    [this.lastID],
                    (err, post) => {
                        if (!err && post) {
                            // Emit real-time notification
                            io.emit('new_post', post);
                        }

                        res.status(201).json({
                            success: true,
                            postId: this.lastID,
                            message: 'Post created successfully'
                        });
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/posts
 * Get all posts with user info
 */
app.get('/api/posts', (req, res) => {
    try {
        db.all(
            `SELECT posts.*, users.username, users.avatar, users.id as user_id,
                    COUNT(DISTINCT likes.id) as likes_count
             FROM posts
             LEFT JOIN users ON posts.user_id = users.id
             LEFT JOIN likes ON posts.id = likes.post_id
             GROUP BY posts.id
             ORDER BY posts.created_at DESC`,
            [],
            (err, rows) => {
                if (err) {
                    return res.status(500).json({ error: 'Cannot fetch posts' });
                }
                res.json(rows);
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/posts/:id
 * Get single post with comments
 */
app.get('/api/posts/:id', (req, res) => {
    try {
        const postId = req.params.id;

        // Get post
        db.get(
            `SELECT posts.*, users.username, users.avatar, users.id as user_id,
                    COUNT(DISTINCT likes.id) as likes_count
             FROM posts
             LEFT JOIN users ON posts.user_id = users.id
             LEFT JOIN likes ON posts.id = likes.post_id
             WHERE posts.id = ?
             GROUP BY posts.id`,
            [postId],
            (err, post) => {
                if (err || !post) {
                    return res.status(404).json({ error: 'Post not found' });
                }

                // Get comments
                db.all(
                    `SELECT comments.*, users.username, users.avatar
                     FROM comments
                     JOIN users ON comments.user_id = users.id
                     WHERE comments.post_id = ?
                     ORDER BY comments.created_at DESC`,
                    [postId],
                    (err, comments) => {
                        res.json({ ...post, comments: comments || [] });
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/posts/:id
 * Delete post (author or admin only)
 */
app.delete('/api/posts/:id', verifyToken, (req, res) => {
    try {
        const postId = req.params.id;

        db.get(
            `SELECT user_id FROM posts WHERE id = ?`,
            [postId],
            (err, post) => {
                if (!post) {
                    return res.status(404).json({ error: 'Post not found' });
                }

                // Check authorization
                if (post.user_id !== req.user.id && req.user.role !== 'admin') {
                    return res.status(403).json({ error: 'Not authorized to delete this post' });
                }

                db.run(
                    `DELETE FROM posts WHERE id = ?`,
                    [postId],
                    function (err) {
                        if (err) {
                            return res.status(500).json({ error: 'Error deleting post' });
                        }

                        io.emit('post_deleted', { postId });
                        res.json({ success: true, message: 'Post deleted' });
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== COMMENT ROUTES =====

/**
 * POST /api/posts/:id/comments
 * Add comment to post
 */
app.post('/api/posts/:id/comments', verifyToken, (req, res) => {
    try {
        const postId = req.params.id;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Comment content is required' });
        }

        db.run(
            `INSERT INTO comments(post_id, user_id, content) VALUES(?, ?, ?)`,
            [postId, req.user.id, content],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Error adding comment' });
                }

                // Fetch the comment
                db.get(
                    `SELECT comments.*, users.username, users.avatar
                     FROM comments
                     JOIN users ON comments.user_id = users.id
                     WHERE comments.id = ?`,
                    [this.lastID],
                    (err, comment) => {
                        if (!err && comment) {
                            io.emit('new_comment', { postId, comment });
                        }

                        res.status(201).json({
                            success: true,
                            commentId: this.lastID,
                            message: 'Comment added'
                        });
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/comments/:id
 * Delete comment
 */
app.delete('/api/comments/:id', verifyToken, (req, res) => {
    try {
        const commentId = req.params.id;

        db.get(
            `SELECT user_id, post_id FROM comments WHERE id = ?`,
            [commentId],
            (err, comment) => {
                if (!comment) {
                    return res.status(404).json({ error: 'Comment not found' });
                }

                // Check authorization
                if (comment.user_id !== req.user.id && req.user.role !== 'admin') {
                    return res.status(403).json({ error: 'Not authorized' });
                }

                db.run(
                    `DELETE FROM comments WHERE id = ?`,
                    [commentId],
                    function (err) {
                        if (err) {
                            return res.status(500).json({ error: 'Error deleting comment' });
                        }

                        io.emit('comment_deleted', { commentId, postId: comment.post_id });
                        res.json({ success: true });
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== REPLY ROUTES (Replies to comments) =====

/**
 * POST /api/comments/:id/replies
 * Add reply to comment
 */
app.post('/api/comments/:id/replies', verifyToken, (req, res) => {
    try {
        const commentId = req.params.id;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Reply content is required' });
        }

        db.run(
            `INSERT INTO replies(comment_id, user_id, content) VALUES(?, ?, ?)`,
            [commentId, req.user.id, content],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Error adding reply' });
                }

                // Fetch the reply
                db.get(
                    `SELECT replies.*, users.username, users.role
                     FROM replies
                     JOIN users ON replies.user_id = users.id
                     WHERE replies.id = ?`,
                    [this.lastID],
                    (err, reply) => {
                        res.status(201).json({
                            success: true,
                            replyId: this.lastID,
                            reply: reply,
                            message: 'Reply added'
                        });
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/comments/:id/replies
 * Get all replies for a comment
 */
app.get('/api/comments/:id/replies', (req, res) => {
    try {
        const commentId = req.params.id;

        db.all(
            `SELECT replies.id, replies.comment_id, replies.user_id, replies.content, replies.created_at,
                    users.username, users.role, users.avatar
             FROM replies
             JOIN users ON replies.user_id = users.id
             WHERE comment_id = ?
             ORDER BY replies.created_at ASC`,
            [commentId],
            (err, rows) => {
                if (err) {
                    return res.status(500).json({ error: 'Error fetching replies' });
                }
                res.json(rows || []);
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/replies/:id
 * Delete reply (admin or author only)
 */
app.delete('/api/replies/:id', verifyToken, (req, res) => {
    try {
        const replyId = req.params.id;

        db.get(
            `SELECT user_id, comment_id FROM replies WHERE id = ?`,
            [replyId],
            (err, reply) => {
                if (!reply) {
                    return res.status(404).json({ error: 'Reply not found' });
                }

                // Check authorization
                if (reply.user_id !== req.user.id && req.user.role !== 'admin') {
                    return res.status(403).json({ error: 'Not authorized' });
                }

                db.run(
                    `DELETE FROM replies WHERE id = ?`,
                    [replyId],
                    function (err) {
                        if (err) {
                            return res.status(500).json({ error: 'Error deleting reply' });
                        }
                        res.json({ success: true });
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== LIKE ROUTES =====

/**
 * POST /api/posts/:id/like
 * Like a post
 */
app.post('/api/posts/:id/like', verifyToken, (req, res) => {
    try {
        const postId = req.params.id;

        db.run(
            `INSERT OR IGNORE INTO likes(post_id, user_id) VALUES(?, ?)`,
            [postId, req.user.id],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Error liking post' });
                }

                // Get updated likes count
                db.get(
                    `SELECT COUNT(*) as likes_count FROM likes WHERE post_id = ?`,
                    [postId],
                    (err, result) => {
                        if (!err) {
                            io.emit('post_liked', { postId, likes_count: result.likes_count });
                        }

                        res.json({ success: true, likes_count: result?.likes_count || 0 });
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/posts/:id/like
 * Unlike a post
 */
app.delete('/api/posts/:id/like', verifyToken, (req, res) => {
    try {
        const postId = req.params.id;

        db.run(
            `DELETE FROM likes WHERE post_id = ? AND user_id = ?`,
            [postId, req.user.id],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Error unliking post' });
                }

                // Get updated likes count
                db.get(
                    `SELECT COUNT(*) as likes_count FROM likes WHERE post_id = ?`,
                    [postId],
                    (err, result) => {
                        if (!err) {
                            io.emit('post_unliked', { postId, likes_count: result.likes_count });
                        }

                        res.json({ success: true, likes_count: result?.likes_count || 0 });
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== PROFILE ROUTES =====

/**
 * GET /api/profile/:username
 * Get user profile with follower/following counts
 */
app.get('/api/profile/:username', (req, res) => {
    try {
        const username = req.params.username;

        db.get(
            `SELECT id, username, email, role, avatar, bio, created_at FROM users WHERE username = ?`,
            [username],
            (err, user) => {
                if (err) {
                    return res.status(500).json({ error: 'Error fetching profile' });
                }
                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }

                // Get follower count
                db.get(
                    `SELECT COUNT(*) as count FROM follows WHERE following_id = ?`,
                    [user.id],
                    (err, followers) => {
                        if (err) {
                            return res.status(500).json({ error: 'Error fetching followers' });
                        }

                        // Get following count
                        db.get(
                            `SELECT COUNT(*) as count FROM follows WHERE follower_id = ?`,
                            [user.id],
                            (err, following) => {
                                if (err) {
                                    return res.status(500).json({ error: 'Error fetching following' });
                                }

                                res.json({
                                    ...user,
                                    followers: followers?.count || 0,
                                    following: following?.count || 0
                                });
                            }
                        );
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/profile/:username/posts
 * Get all posts by user
 */
app.get('/api/profile/:username/posts', (req, res) => {
    try {
        const username = req.params.username;

        db.get(
            `SELECT id FROM users WHERE username = ?`,
            [username],
            (err, user) => {
                if (err) {
                    return res.status(500).json({ error: 'Error fetching user' });
                }
                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }

                db.all(
                    `SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC`,
                    [user.id],
                    (err, posts) => {
                        if (err) {
                            return res.status(500).json({ error: 'Error fetching posts' });
                        }
                        res.json(posts);
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== FOLLOW ROUTES =====

/**
 * POST /api/follow/:userId
 * Follow a user
 */
app.post('/api/follow/:userId', verifyToken, (req, res) => {
    try {
        const userIdToFollow = parseInt(req.params.userId);
        const currentUserId = req.user.id;

        if (userIdToFollow === currentUserId) {
            return res.status(400).json({ error: 'Cannot follow yourself' });
        }

        db.run(
            `INSERT OR IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)`,
            [currentUserId, userIdToFollow],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Error following user' });
                }
                res.json({ success: true, message: 'User followed' });
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/follow/:userId
 * Unfollow a user
 */
app.delete('/api/follow/:userId', verifyToken, (req, res) => {
    try {
        const userIdToUnfollow = parseInt(req.params.userId);
        const currentUserId = req.user.id;

        db.run(
            `DELETE FROM follows WHERE follower_id = ? AND following_id = ?`,
            [currentUserId, userIdToUnfollow],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Error unfollowing user' });
                }
                res.json({ success: true, message: 'User unfollowed' });
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/follow/:userId/check
 * Check if following a user
 */
app.get('/api/follow/:userId/check', verifyToken, (req, res) => {
    try {
        const userIdToCheck = parseInt(req.params.userId);
        const currentUserId = req.user.id;

        db.get(
            `SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?`,
            [currentUserId, userIdToCheck],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Error checking follow status' });
                }
                res.json({ isFollowing: !!result });
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== NOTIFICATION ROUTES =====

/**
 * GET /api/notifications
 * Get user notifications
 */
app.get('/api/notifications', verifyToken, (req, res) => {
    try {
        db.all(
            `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`,
            [req.user.id],
            (err, notifications) => {
                if (err) {
                    return res.status(500).json({ error: 'Cannot fetch notifications' });
                }
                res.json(notifications);
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * PATCH /api/notifications/:id/read
 * Mark notification as read
 */
app.patch('/api/notifications/:id/read', verifyToken, (req, res) => {
    try {
        const notifId = req.params.id;

        db.run(
            `UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`,
            [notifId, req.user.id],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Error updating notification' });
                }
                res.json({ success: true });
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== ADMIN ROUTES =====

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics (admin only)
 */
app.get('/api/admin/dashboard', verifyToken, requireAdmin, (req, res) => {
    try {
        Promise.all([
            new Promise((resolve) => {
                db.get(`SELECT COUNT(*) as count FROM users`, [], (err, row) => {
                    resolve(err ? 0 : row.count);
                });
            }),
            new Promise((resolve) => {
                db.get(`SELECT COUNT(*) as count FROM posts`, [], (err, row) => {
                    resolve(err ? 0 : row.count);
                });
            }),
            new Promise((resolve) => {
                db.get(`SELECT COUNT(*) as count FROM comments`, [], (err, row) => {
                    resolve(err ? 0 : row.count);
                });
            }),
            new Promise((resolve) => {
                db.get(`SELECT COUNT(*) as count FROM users WHERE role = 'admin'`, [], (err, row) => {
                    resolve(err ? 0 : row.count);
                });
            })
        ]).then(([totalUsers, totalPosts, totalComments, adminCount]) => {
            res.json({
                totalUsers,
                totalPosts,
                totalComments,
                adminCount,
                timestamp: new Date().toISOString()
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/admin/users
 * Get all users with full details (admin only)
 */
app.get('/api/admin/users', verifyToken, requireAdmin, (req, res) => {
    try {
        db.all(
            `
            SELECT u.id, u.username, u.email, u.role, u.created_at,
                   COUNT(DISTINCT p.id) as post_count,
                   COUNT(DISTINCT f.follower_id) as follower_count
            FROM users u
            LEFT JOIN posts p ON u.id = p.user_id
            LEFT JOIN follows f ON u.id = f.following_id
            GROUP BY u.id
            ORDER BY u.created_at DESC
            `,
            [],
            (err, rows) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(rows);
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/admin/users/:id
 * Get detailed user information (admin only)
 */
app.get('/api/admin/users/:id', verifyToken, requireAdmin, (req, res) => {
    try {
        const userId = req.params.id;
        
        db.get(
            `SELECT id, username, email, role, avatar, bio, created_at FROM users WHERE id = ?`,
            [userId],
            (err, user) => {
                if (err || !user) {
                    return res.status(404).json({ error: 'User not found' });
                }
                res.json(user);
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * PATCH /api/admin/users/:id/role
 * Change user role (admin only)
 */
app.patch('/api/admin/users/:id/role', verifyToken, requireAdmin, (req, res) => {
    try {
        const userId = req.params.id;
        const { role } = req.body;

        // Validate role
        if (!['user', 'moderator', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        // Prevent removing last admin
        if (role !== 'admin') {
            db.get(
                `SELECT COUNT(*) as count FROM users WHERE role = 'admin' AND id != ?`,
                [userId],
                (err, row) => {
                    if (err || row.count === 0) {
                        return res.status(400).json({ error: 'Cannot remove last admin' });
                    }
                    updateUserRole();
                }
            );
        } else {
            updateUserRole();
        }

        function updateUserRole() {
            db.run(
                `UPDATE users SET role = ? WHERE id = ?`,
                [role, userId],
                function (err) {
                    if (err) {
                        return res.status(500).json({ error: 'Error updating user role' });
                    }
                    res.json({ success: true, message: `User role updated to ${role}` });
                }
            );
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/admin/users/:id
 * Ban/delete a user (admin only)
 */
app.delete('/api/admin/users/:id', verifyToken, requireAdmin, (req, res) => {
    try {
        const userId = req.params.id;

        // Check if user is trying to delete themselves
        if (userId == req.user.id) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        // Check if deleting last admin
        db.get(
            `SELECT role FROM users WHERE id = ?`,
            [userId],
            (err, user) => {
                if (user && user.role === 'admin') {
                    db.get(
                        `SELECT COUNT(*) as count FROM users WHERE role = 'admin'`,
                        [],
                        (err, row) => {
                            if (row.count === 1) {
                                return res.status(400).json({ error: 'Cannot delete last admin' });
                            }
                            performDelete();
                        }
                    );
                } else {
                    performDelete();
                }
            }
        );

        function performDelete() {
            db.run(
                `DELETE FROM users WHERE id = ?`,
                [userId],
                function (err) {
                    if (err) {
                        return res.status(500).json({ error: 'Error deleting user' });
                    }
                    res.json({ success: true, message: 'User deleted successfully' });
                }
            );
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/admin/posts
 * Get all posts with user info (admin only)
 */
app.get('/api/admin/posts', verifyToken, requireAdmin, (req, res) => {
    try {
        db.all(
            `
            SELECT p.id, p.title, p.content, p.user_id, p.created_at, 
                   u.username, u.email, 
                   COUNT(c.id) as comment_count, 
                   COUNT(DISTINCT l.id) as like_count
            FROM posts p
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN comments c ON p.id = c.post_id
            LEFT JOIN likes l ON p.id = l.post_id
            GROUP BY p.id
            ORDER BY p.created_at DESC
            `,
            [],
            (err, rows) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(rows);
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/admin/posts/:id
 * Delete any post (admin only)
 */
app.delete('/api/admin/posts/:id', verifyToken, requireAdmin, (req, res) => {
    try {
        const postId = req.params.id;

        db.run(
            `DELETE FROM posts WHERE id = ?`,
            [postId],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Error deleting post' });
                }
                io.emit('post_deleted', { postId });
                res.json({ success: true, message: 'Post deleted' });
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/admin/comments
 * Get all comments (admin only)
 */
app.get('/api/admin/comments', verifyToken, requireAdmin, (req, res) => {
    try {
        db.all(
            `
            SELECT c.id, c.content, c.user_id, c.post_id, c.created_at,
                   u.username, u.email,
                   p.title as post_title
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.id
            LEFT JOIN posts p ON c.post_id = p.id
            ORDER BY c.created_at DESC
            `,
            [],
            (err, rows) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(rows);
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/admin/comments/:id
 * Delete any comment (admin only)
 */
app.delete('/api/admin/comments/:id', verifyToken, requireAdmin, (req, res) => {
    try {
        const commentId = req.params.id;

        db.get(
            `SELECT post_id FROM comments WHERE id = ?`,
            [commentId],
            (err, comment) => {
                if (!comment) {
                    return res.status(404).json({ error: 'Comment not found' });
                }

                db.run(
                    `DELETE FROM comments WHERE id = ?`,
                    [commentId],
                    function (err) {
                        if (err) {
                            return res.status(500).json({ error: 'Error deleting comment' });
                        }
                        io.emit('comment_deleted', { commentId, postId: comment.post_id });
                        res.json({ success: true, message: 'Comment deleted' });
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/admin/check
 * Check if current user is admin
 */
app.get('/api/admin/check', verifyToken, (req, res) => {
    res.json({ isAdmin: req.user.role === 'admin' });
});

// ===== SOCKET.IO REAL-TIME EVENTS =====

io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // Join room for specific post
    socket.on('join_post', (postId) => {
        socket.join(`post_${postId}`);
    });

    // Leave room
    socket.on('leave_post', (postId) => {
        socket.leave(`post_${postId}`);
    });

    // Live chat
    socket.on('send_message', (data) => {
        io.emit('new_message', data);
    });

    // User status
    socket.on('user_online', (username) => {
        io.emit('user_status', { username, status: 'online' });
    });

    // Disconnect - mark user offline
    socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${socket.id}`);
        if (socket.username) {
            db.run(
                `
                UPDATE user_sessions
                SET is_online = 0, last_seen = datetime('now')
                WHERE username = ?
                `,
                [socket.username],
                (err) => {
                    if (err) {
                        console.error('Error updating user session on disconnect:', err);
                    }
                }
            );
        }
    });
});

// ===== ERROR HANDLING =====

app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message || 'Internal server error' });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// ===== NOTE: Server is started in database-init.js callback =====
// See the initDatabase() promise chain above

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n✅ Shutting down gracefully...');
    if (db && db.close) {
        db.close((err) => {
            if (err) console.error('Database close error:', err);
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
});

module.exports = { app, server, io };

