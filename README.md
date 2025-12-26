# PixelLumo - Full-Stack Gaming Community Platform

Welcome to **PixelLumo**, a complete full-stack gaming community platform! This is a vibrant hub for gamers to share gaming experiences, create content, connect in real-time, and build communities.

## 🎮 About PixelLumo

PixelLumo is a modern gaming community platform built with **Node.js/Express backend**, **SQLite database**, and **vanilla JavaScript frontend**. Features real-time chat with Socket.IO, user authentication with JWT, file uploads, and admin controls.

### Key Highlights
- 🔐 Secure authentication with JWT & bcrypt password hashing
- 💬 Real-time chat using Socket.IO
- 📸 Image gallery with file uploads
- 📝 Blog/tutorials system with persistent storage
- 👥 Private messaging with privacy controls
- 🛡️ Admin panel with user activity tracking
- 📧 Password reset via email
- 🔄 Real-time online/offline status

## 🌟 Features

### User Authentication
- **Login Page** - Username or email login
- **Sign Up** - Full registration with password validation
- **Forgot Password** - Email-based password reset (1-hour tokens)
- **Reset Password** - Secure password recovery
- **"Remember Me"** - Persistent login option
- **Admin Role** - Email-based admin account assignment

### Community Features
- **Real-Time Chat** - Group messaging with Socket.IO
- **Private Messaging** - Direct messages with opt-in privacy
- **User Profiles** - Customizable avatars and bios
- **Gallery** - Image uploads with persistent storage
- **Blog/Tutorials** - Create and share gaming content
- **Comments** - Discuss posts and content
- **Likes System** - Like posts and comments
- **Notifications** - Real-time activity updates

### Admin Features
- **Admin Dashboard** - User activity tracking
- **Online/Offline Status** - See who's currently active
- **Last Seen Timestamps** - Track user activity
- **User Management** - View all community members
- **Admin-Only Access** - Secure endpoint protection

### Design Highlights
- 🌙 Dark theme with neon accents (Purple, Hot Pink)
- ✨ Smooth animations and transitions
- 🎨 Responsive design for all devices
- 🔐 Form validation and security
- 📱 Mobile-friendly interface

## 🛠️ Technologies Used

### Backend
- **Node.js & Express.js** - Server framework
- **SQLite3** - File-based database
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Nodemailer** - Email sending for password reset
- **dotenv** - Environment configuration

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **Vanilla JavaScript** - No frameworks, lightweight
- **Socket.IO Client** - Real-time communication
- **Fetch API** - HTTP requests
- **localStorage/sessionStorage** - Client-side storage

### Database (SQLite)
Tables:
- `users` - User accounts with roles and preferences
- `user_sessions` - Login sessions with online/offline status
- `posts` - Blog/gallery content
- `comments` - Post comments and replies
- `likes` - Content likes
- `notifications` - Activity notifications
- `follows` - User following system
- `password_reset_tokens` - Secure password reset tokens

## 📁 Project Structure

```
PixelLumo/
├── index.html                    # Login page
├── signup.html                   # Registration page
├── forgot-password.html          # Password reset request
├── reset-password.html           # Password recovery
├── server.js                     # Express backend server
├── package.json                  # Node.js dependencies
├── .env.example                  # Environment variables template
│
├── assets/                       # Images and icons
├── css/                          # Stylesheets
├── js/                           # Frontend JavaScript
│   ├── base-path.js             # Global API_BASE setup
│   ├── auth.js                  # Auth utilities
│   ├── auth-service.js          # Login/signup service
│   ├── storage-service.js       # Data persistence
│   ├── chat.js                  # Real-time chat
│   ├── messaging.js             # Private messaging
│   ├── admin.js                 # Admin panel logic
│   ├── blog.js, gallery.js, tutorials.js
│   └── ... other feature files
├── pages/                        # Application pages
│   ├── home.html
│   ├── admin.html              # Admin dashboard
│   ├── chat.html               # Chat page
│   ├── messaging.html          # Messaging page
│   ├── blog.html, gallery.html, tutorials.html
│   └── ... other pages
├── components/
│   └── nav.html                # Navigation component
├── database/
│   └── db.sqlite               # SQLite database (auto-created)
├── uploads/                    # User-uploaded files
├── docs/
│   ├── README.md
│   ├── PROJECT_STATUS.md
│   ├── EMAIL_SETUP.md          # Email configuration guide
│   └── LOGIN_TROUBLESHOOTING.md
└── test-backend.js             # Backend testing script
```

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** - JavaScript runtime
- **npm 9+** - Package manager
- **Git** - Version control
- **Local server or Laragon/XAMPP** - For development

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PixelLumo/PixelLumo.git
   cd PixelLumo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Start the server**
   ```bash
   npm start
   # Server runs on http://localhost:5000
   ```

5. **Access the application**
   ```
   http://localhost:3000/index.html (login page)
   ```

### Configuration (.env)

```env
# Server
PORT=5000
SECRET_KEY=your-secret-key

# Database
DATABASE_PATH=./database/db.sqlite
UPLOAD_DIR=./uploads

# Admin Account
ADMIN_EMAIL=admin@example.com

# Email (for password reset)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend
FRONTEND_URL=http://localhost:3000
```

## 🔐 Authentication Flow

1. **Signup** - User creates account with username, email, password
   - Password hashed with bcrypt
   - User assigned default "user" role

2. **Login** - User logs in with username or email
   - Server validates credentials
   - JWT token generated (24h expiry)
   - User session marked as "online"
   - Token stored in localStorage

3. **Forgot Password** - User requests password reset
   - Secure reset token generated (32-byte)
   - Email sent with reset link (1-hour expiry)
   - Token stored in database

4. **Reset Password** - User clicks email link
   - Token validated
   - New password hashed
   - Old token deleted after use

5. **Admin Check** - Admin features require email match
   - Server checks `ADMIN_EMAIL` environment variable
   - User role set to "admin" automatically
   - Frontend checks user.role === 'admin'

## 📡 API Endpoints

### Authentication
- `POST /api/login` - Login (username/email + password)
- `POST /api/register` - Create account
- `POST /api/logout` - Logout (mark offline)

### Password Recovery
- `POST /api/forgot-password` - Request reset link
- `POST /api/verify-reset-token` - Validate reset token
- `POST /api/reset-password` - Set new password

### User Management
- `GET /api/user` - Get current user info
- `PATCH /api/user/allow-messages` - Toggle messaging privacy

### Admin
- `GET /api/admin/users` - Get all users with sessions (admin only)

### Content
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post with file upload
- `GET /api/messaging/users` - Get users for messaging

### Real-Time (Socket.IO)
- `send_message` - Send chat message
- `new_message` - Receive chat message
- `connect` - Mark user online
- `disconnect` - Mark user offline

## 🧪 Testing

### Backend Tests
```bash
npm test
# Runs test-backend.js
```

### Manual Login Test
1. Create account: `http://localhost:3000/signup.html`
2. Login: `http://localhost:3000/index.html`
3. Check browser console (F12) for debug logs
4. See `LOGIN_TROUBLESHOOTING.md` for common issues

### Admin Panel Test
1. Set `ADMIN_EMAIL` in .env
2. Create account with that email
3. Login and navigate to admin panel
4. Should see user activity dashboard

## 📧 Email Configuration

For password reset functionality:

### Gmail (Recommended)
1. Enable 2-Factor Authentication
2. Generate App Password at https://myaccount.google.com/apppasswords
3. Set in `.env`:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-char-password
   ```

See `EMAIL_SETUP.md` for other providers and detailed instructions.

## 🆘 Troubleshooting

### Login Issues
- Check browser console (F12) for error messages
- Verify server is running (`npm start`)
- Ensure `API_BASE` is correctly set in `js/base-path.js`
- See `LOGIN_TROUBLESHOOTING.md` for detailed solutions

### Email Not Sending
- Check email credentials in `.env`
- Verify `FRONTEND_URL` points to correct domain
- Check spam/junk folder
- See `EMAIL_SETUP.md` for setup help

### Database Issues
- Delete `database/db.sqlite` to reset
- Check database path in `.env`
- Verify file permissions

### Chat Not Working
- Server must be running on port 5000
- Client must connect to `API_BASE` (Socket.IO endpoint)
- Check browser console for connection errors

## 🔄 Data Persistence

All user data is stored in SQLite:
- User accounts and passwords (hashed)
- Posts, images, and files (in `/uploads`)
- Chat messages and conversations
- User activity and sessions
- Password reset tokens (auto-deleted after 1 hour)

Data is **not stored in localStorage** (except auth token and session user object).

## 📊 Database Schema

```sql
users:
  - id (PRIMARY KEY)
  - username (UNIQUE)
  - email (UNIQUE)
  - password (hashed)
  - role (user/admin)
  - avatar, bio
  - allow_messages
  - created_at, updated_at

user_sessions:
  - user_id, username
  - is_online (0/1)
  - last_seen (timestamp)

password_reset_tokens:
  - user_id
  - token (UNIQUE)
  - expires_at
  - created_at

posts:
  - id, user_id
  - title, content, file_path
  - likes
  - created_at

comments, likes, follows, notifications, replies:
  - Supporting tables for interactions
```

## 🚀 Deployment

### Local Development
```bash
npm start
# Runs on http://localhost:5000
```

### Production Deployment
1. Set secure `SECRET_KEY` in `.env`
2. Use strong `ADMIN_EMAIL`
3. Configure email service
4. Set `FRONTEND_URL` to production domain
5. Use environment variables for all secrets
6. Enable HTTPS/SSL
7. Set database backup strategy

See `DEPLOYMENT_GUIDE.md` for detailed steps.

## 📚 Documentation Files

- **README.md** - This file
- **PROJECT_STATUS.md** - Feature checklist and progress
- **EMAIL_SETUP.md** - Email configuration guide
- **LOGIN_TROUBLESHOOTING.md** - Login debugging guide
- **DEPLOYMENT_GUIDE.md** - Production deployment steps
- **FINAL_SUMMARY.md** - Technical summary

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Submit pull request with description

## 📄 License

MIT License - Open source and free to use

## 👤 Creator

**PixelLumo** - Gaming Community Builder

## 💬 Support

For issues or questions:
- Open an issue on GitHub
- Check troubleshooting guides
- Review documentation files

---

**Last Updated: December 22, 2025**