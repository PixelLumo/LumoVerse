# Backend Setup & Launch Guide

## 🎯 Mission: Get Your Backend Running in 5 Minutes

Follow this guide step-by-step to launch your PixelLumoApp backend server.

---

## ✅ Prerequisites Checklist

Before starting, verify you have:

- [ ] **Node.js** installed (v14+)
  - Check: `node --version`
  - Download: https://nodejs.org/
  
- [ ] **npm** installed
  - Check: `npm --version`
  - (Comes with Node.js)
  
- [ ] **MongoDB** installed and working
  - Check: `mongod --version`
  - Download: https://www.mongodb.com/try/download/community

---

## 🚀 5-Minute Startup Guide

### ⏱️ Minute 1-2: Install Dependencies

Open your terminal and navigate to the backend folder:

```bash
cd backend
npm install
```

This will install all 10+ required packages. Takes ~1-2 minutes depending on internet speed.

**What's being installed:**
- Express - Web server framework
- Mongoose - MongoDB database connection
- JWT - Authentication tokens
- bcryptjs - Password encryption
- Multer - File upload handling
- And more...

### ⏱️ Minute 3: Start MongoDB

Open a **new terminal tab** (keep the previous one open):

```bash
mongod
```

Wait for this message:
```
[initandlisten] waiting for connections on port 27017
```

**Leave this running** - it's your database server.

### ⏱️ Minute 4-5: Start Backend Server

Back in your **first terminal**, run:

```bash
npm start
```

You should see:
```
✅ MongoDB connected successfully
🚀 PixelLumo Backend running on port 5000
📡 API base URL: http://localhost:5000/api
```

**🎉 Success! Your backend is running!**

---

## 🧪 Quick Verification

### Test 1: Ping the Server

Open your browser and go to:
```
http://localhost:5000/ping
```

You should see:
```json
{
  "status": "ok",
  "message": "Server running"
}
```

### Test 2: Test Authentication

Use curl or Postman to register:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Should return user data and JWT token.

---

## 📋 What's Running?

Your backend provides these API routes:

| Route | Purpose | Status |
|-------|---------|--------|
| `/api/auth` | User login/register | ✅ Ready |
| `/api/users` | User profiles & leaderboard | ✅ Ready |
| `/api/gallery` | Image uploads & likes | ✅ Ready |
| `/api/blog` | Blog posts CRUD | ✅ Ready |
| `/api/notifications` | Notifications | ✅ Ready |
| `/api/messages` | Direct messaging | ✅ Ready |
| `/api/chat` | Chat rooms | ✅ Ready |

**Total: 40+ endpoints** - All documented in [API_ROUTES.md](API_ROUTES.md)

---

## 📂 Folder Structure

```
backend/
├── server.js                  ← MAIN SERVER FILE (what npm start runs)
├── .env                       ← Configuration file
├── package.json               ← Dependencies list
├── models/                    ← Database schemas (8 files)
├── routes/                    ← API endpoints (7 modules)
├── middleware/                ← Authentication & validation
├── uploads/                   ← Uploaded images (auto-created)
└── [Documentation files...]
```

---

## ⚙️ Configuration (.env)

Your `.env` file controls:

```env
PORT=5000                    # Server port (change if 5000 is busy)
MONGO_URI=mongodb://...      # Database connection string
JWT_SECRET=yourSecretKey     # For token signing
NODE_ENV=development         # Environment mode
```

**To change settings:**
1. Open `backend/.env`
2. Edit the values
3. Restart server: `npm start`

---

## 🧪 Testing All Endpoints

### Best Option: Use Postman

1. Download Postman: https://www.postman.com/
2. Open Postman
3. Click **Import**
4. Select: `PixelLumoApp.postman_collection.json`
5. All 28+ endpoints are ready to test!

### Alternative: Use curl

Example requests:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@test.com","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"pass123"}'

# Get leaderboard (public)
curl http://localhost:5000/api/users/leaderboard

# List gallery (public)
curl http://localhost:5000/api/gallery
```

---

## 🔐 Authentication

Protected endpoints require a Bearer token:

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**To get a token:**
1. Register or login at `/api/auth/register` or `/api/auth/login`
2. Copy the `token` from response
3. Use in `Authorization: Bearer <token>` header

Token expires after 7 days.

---

## 🐛 Troubleshooting

### ❌ "npm: command not found"
**Solution:** Reinstall Node.js from nodejs.org

### ❌ "MongoDB connection error"
**Solution:** Make sure MongoDB is running
```bash
mongod  # Run in separate terminal
```

### ❌ "Port 5000 already in use"
**Solution:** Change port in `.env`
```env
PORT=5001
```
Then restart server.

### ❌ "Cannot find module"
**Solution:** Reinstall dependencies
```bash
npm install
```

### ❌ "Token validation failed"
**Solution:** 
- Make sure token is in format: `Bearer <token>`
- Check token hasn't expired (7 days max)
- Verify you're using correct token

### ❌ "Image upload fails"
**Solution:** Check that `/uploads` folder exists in backend. It auto-creates on first upload, but you can create manually if needed.

---

## 📚 Documentation

| File | Content |
|------|---------|
| [STARTUP_GUIDE.md](STARTUP_GUIDE.md) | Detailed startup steps |
| [API_ROUTES.md](API_ROUTES.md) | All 40+ endpoints documented |
| [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) | Setup checklist & testing |
| [BACKEND_SUMMARY.md](BACKEND_SUMMARY.md) | Architecture & implementation |
| [NPM_SCRIPTS.md](NPM_SCRIPTS.md) | npm commands reference |

**Start here:** [STARTUP_GUIDE.md](STARTUP_GUIDE.md) for detailed walkthrough

---

## 💡 Quick Tips

1. **Keep MongoDB running** - Don't close the `mongod` terminal
2. **Server crashes?** - Check console for error messages
3. **Want auto-restart?** - Run `npm run dev` instead of `npm start`
4. **Testing easier in Postman** - Better than curl in terminal
5. **Check API docs** - [API_ROUTES.md](API_ROUTES.md) has all endpoints

---

## 🎯 Next Steps

After server is running:

1. ✅ Test health check: `curl http://localhost:5000/ping`
2. ✅ Import Postman collection
3. ✅ Register a test user
4. ✅ Login and get token
5. ✅ Test protected endpoints
6. ✅ Upload test image
7. ✅ Create blog post
8. ✅ Connect your frontend!

---

## 📊 Server Status Indicators

### ✅ All Good (You should see):
```
✅ MongoDB connected successfully
🚀 PixelLumo Backend running on port 5000
📡 API base URL: http://localhost:5000/api
```

### ⚠️ Warning Signs (You might see):
```
❌ MongoDB connection error
```
→ Start MongoDB with `mongod`

### ❌ Errors (You might see):
```
Error: Cannot find module 'express'
```
→ Run `npm install`

---

## 🔧 Advanced: Custom Scripts

Add to `package.json` for convenience:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "npm test"
}
```

Then use:
- `npm start` - Run server
- `npm run dev` - Run with auto-restart
- `npm test` - Run tests

---

## 📞 Getting Help

1. Check [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) - Common issues & fixes
2. Review console output - Server logs show errors
3. Test with `/ping` endpoint - Confirms server is up
4. Check [API_ROUTES.md](API_ROUTES.md) - Verify endpoint syntax

---

## 🎊 You're Ready!

Your backend is **production-ready** with:
- ✅ 40+ API endpoints
- ✅ User authentication
- ✅ File uploads
- ✅ MongoDB database
- ✅ Error handling
- ✅ Complete documentation

**Status:** Ready to launch! 🚀

---

*Last Updated: December 21, 2025*
*Backend Version: 1.0.0*
*Ready for Production*
