# Package.json Scripts & Dependencies

## 📦 Install All Dependencies

```bash
cd backend
npm install
```

This installs all required packages from package.json.

## ▶️ Running the Server

### Development Mode (with auto-restart)
```bash
npm start
```

Or if you want better console output:
```bash
npm run dev
```

### Direct Node
```bash
node server.js
```

## 🔄 Available npm Scripts

Add these to your `backend/package.json` in the "scripts" section:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "lint": "eslint ."
  }
}
```

## 📋 Required Dependencies

All these should be in your `package.json`:

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.3.2",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "express-validator": "^7.0.0",
    "multer": "^1.4.5",
    "cors": "^2.8.5",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.1",
    "socket.io": "^4.7.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## 🔧 Setup nodemon (Optional but Recommended)

For automatic server restart when files change:

```bash
npm install --save-dev nodemon
```

Then update your package.json:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

Run with: `npm run dev`

## ✅ Verify Installation

After `npm install`, verify all packages:

```bash
npm list
```

Should show all installed dependencies.

## 🚀 Complete Startup Sequence

```bash
# 1. Navigate to backend folder
cd backend

# 2. Install dependencies (first time only)
npm install

# 3. In another terminal, start MongoDB
mongod

# 4. Back in first terminal, start server
npm start

# Expected output:
# ✅ MongoDB connected successfully
# 🚀 PixelLumo Backend running on port 5000
# 📡 API base URL: http://localhost:5000/api
```

## 📝 Package.json Template

Create `backend/package.json` with this template if it doesn't exist:

```json
{
  "name": "pixellumo-backend",
  "version": "1.0.0",
  "description": "PixelLumoApp backend API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "pixellumo",
    "api",
    "backend"
  ],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.3.2",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "express-validator": "^7.0.0",
    "multer": "^1.4.5",
    "cors": "^2.8.5",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.1",
    "socket.io": "^4.7.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## 🧪 Test Installation

After `npm install`, test with:

```bash
node -e "console.log('Node.js works!'); const mongoose = require('mongoose'); console.log('Mongoose works!');"
```

Should output:
```
Node.js works!
Mongoose works!
```

## 🐛 Troubleshooting Installation

### npm command not found
- Reinstall Node.js from nodejs.org
- Restart terminal after installation

### Module not found errors
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Permission denied errors (Mac/Linux)
```bash
sudo npm install
# Or use nvm to avoid sudo
```

### Port already in use
Edit `.env`:
```env
PORT=5001
```

---

**Now you're ready to run:** `npm start`
