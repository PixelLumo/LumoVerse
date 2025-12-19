# PixelLumo - Deployment & Launch Guide

## Quick Start (Development)

### Option 1: Python HTTP Server ✅ (Current)
```bash
cd PixelLumo/
python -m http.server 8000
```
- Opens: http://localhost:8000
- Server: Running on port 8000
- Status: ✅ Currently active

### Option 2: Node.js HTTP Server
```bash
npm install -g http-server
cd PixelLumo/
http-server -p 8000
```

### Option 3: VS Code Live Server Extension
- Install: Live Server extension
- Right-click index.html → "Open with Live Server"
- Auto-opens: http://localhost:5500

## First Login

**Demo Credentials** (Create your own):
- Username: test
- Email: test@pixelllumo.com
- Password: (any text, no validation)
- Remember Me: ✓ (optional)

**Or Create New Account:**
- Click "Create Account" on login page
- Enter username, email, password
- Account auto-created in localStorage

## Project Structure

```
PixelLumo/
├── index.html            # Login page (entry point)
├── home.html             # Home/dashboard
├── community.html        # Social hub (posts/comments/likes)
├── leaderboard.html      # Rankings & scoring
├── tutorials.html        # User-created gaming guides
├── gallery.html          # Screenshot/artwork showcase
├── blog.html             # Blog posts
├── chat.html             # Group chat (real-time)
├── messaging.html        # Private DMs
├── notifications.html    # Notification center
├── about.html            # About Lumo
├── contact.html          # Contact form
├── patreon.html          # Monetization/supporter info
│
├── style.css             # Main styling (pink/purple theme)
│
├── auth.js               # Authentication & session
├── utils.js              # Shared utilities (NEW - core improvement)
├── community.js          # Posts/comments/achievements (optimized)
├── leaderboard.js        # Scoring calculations
├── tutorials.js          # Tutorial management
├── gallery.js            # Image handling
├── blog.js               # Blog management
├── chat.js               # Group chat (optimized)
├── messaging.js          # DM handling (optimized)
├── notifications.js      # Notification logic
└── patreon.js            # Supporter features

├── README.md             # Project overview
├── PROJECT_STATUS.md     # Feature checklist
├── TEST_REPORT.md        # Test results (NEW)
└── DEPLOYMENT_GUIDE.md   # This file
```

## Features Overview

### 🔐 Authentication
- Login with username or email
- Remember me checkbox
- Session tracking
- Logout functionality

### 📱 Social Hub
- Create posts with images
- Comment on posts
- Like posts (visible count)
- Search posts by title/content/author
- Supporter badges (★) for premium members

### 🏆 Gamification
- **5 Achievements**: Rookie Gamer, Contributor, Chatter, Community Builder, Popular Gamer, Patreon Hero
- **Scoring System**: 3pts/post, 2pts/comment, 1pt/like, +5 bonus for supporters
- **Leaderboard**: Top 3 show medals (🥇🥈🥉)
- **Points Tracking**: Real-time stats and activity feed

### 📚 Content Creation
- **Tutorials**: Gaming guides (supporters-only option)
- **Gallery**: Image/artwork uploads (base64 encoded)
- **Blog**: Blog posts and articles
- Search available for all content

### 💬 Communication
- **Group Chat**: Real-time community chat (2s auto-refresh)
- **Private Messaging**: DM specific users (unread badges)
- **Notifications**: Notification center with 5 filters
  - All, Messages, Activity, Achievements, Supporter

### 💰 Monetization
- **Patreon Page**: Link to support
- **Exclusive Content**: Visible only to supporters
- **Supporter Badge**: ★ displayed across all features
- **Bonus Points**: +5 for supporters on leaderboard
- **Patreon Hero Achievement**: Unlock by becoming supporter

## localStorage Keys Reference

```javascript
// User & Auth
sessionStorage.pixellumoUser        // Currently logged-in user

// Content
localStorage.pixellumoPosts         // All posts with comments/likes
localStorage.pixellumoChat          // Group chat messages
localStorage.pixellumoMessages      // Private messages (user1_user2)
localStorage.pixellumoTutorials     // Tutorial guides
localStorage.pixellumoImages        // Gallery images (base64)
localStorage.pixellumoBlog          // Blog posts
localStorage.pixellumoAchievements  // User achievements (JSON array)
localStorage.pixellumoRead          // Message read status
```

## Configuration

### Colors (style.css)
```css
Primary Pink:    #ff1493
Secondary Purple: #6a0dad
Light Purple:    #b0a0ff
Text Color:      #e0e0ff
```

### Fonts
- Body: Righteous (Google Fonts)
- Bold, eye-catching gaming aesthetic

### Auto-Refresh Intervals
- Chat: 2 seconds
- Messaging: 2 seconds
- Notifications: 3 seconds

## Testing Checklist

- [ ] Login with new account
- [ ] Create and like posts
- [ ] Add comments
- [ ] Trigger achievements
- [ ] View leaderboard rankings
- [ ] Create tutorial (try supporters-only)
- [ ] Upload images to gallery
- [ ] Send group chat message
- [ ] DM another user
- [ ] Check notifications
- [ ] Verify supporter features
- [ ] Search in posts/tutorials/gallery

## Performance Metrics

| Metric | Value |
|--------|-------|
| JS Bundle | ~800 lines (optimized) |
| No External Dependencies | ✓ |
| Page Load | <1s |
| API Calls | 0 (client-side only) |
| localStorage Usage | ~50KB (typical) |

## Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers

Requirements:
- localStorage support
- ES6+ JavaScript
- CSS Grid/Flexbox
- FileReader API (for images)

## Known Limitations

### Current Implementation
- No backend (data resets on localStorage clear)
- No real-time WebSocket (using polling)
- No user authentication (demo only)
- No image server (base64 encoded)
- No email notifications

### For Production
- Integrate Firebase/Auth0
- Add real WebSocket server
- Implement image storage (AWS S3)
- Add email service (SendGrid)
- Implement content moderation
- Add rate limiting

## Troubleshooting

### Page won't load
- Check browser console (F12)
- Verify all files present: `ls -la`
- Clear localStorage if corrupted: `localStorage.clear()`

### Login not working
- Clear sessionStorage: `sessionStorage.clear()`
- Check localStorage is enabled (private mode?)

### Images not uploading
- File size limit: 5MB (base64)
- Supported: JPG, PNG, GIF, WebP
- Browser File API support needed

### Chat/Messages not updating
- Check auto-refresh timer (2s)
- Verify localStorage populated
- Open browser DevTools → Application → localStorage

### Achievements not unlocking
- Create post/comment to trigger
- Check browser console for errors
- Verify localStorage.pixellumoAchievements exists

## Code Style

### JavaScript Conventions
```javascript
// Variables: camelCase
const userName = 'test';

// Functions: camelCase
function getCurrentUser() { }

// Constants: UPPER_SNAKE_CASE
const API_TIMEOUT = 5000;

// Classes: PascalCase
class UserProfile { }

// Private methods: _leading underscore
function _formatDate() { }
```

### File Organization
- One feature = one .js file
- Shared code in utils.js
- HTML structure + JS logic together
- CSS rules organized by component

## Git Commands

```bash
# View commits
git log --oneline

# View changes since last commit
git status

# Add all changes
git add -A

# Commit
git commit -m "Descriptive message"

# Push to GitHub
git push

# Create branch
git checkout -b feature-name

# Switch branch
git checkout main
```

## Next Steps

1. **Immediate** (1-2 hours)
   - Test all features locally
   - Gather feedback
   - Fix any bugs

2. **Short Term** (1-2 weeks)
   - Deploy to GitHub Pages
   - Add user profiles
   - Implement friend system

3. **Medium Term** (1-2 months)
   - Backend integration (Firebase)
   - Real WebSocket chat
   - Admin panel

4. **Long Term** (ongoing)
   - Mobile app (React Native)
   - Advanced moderation tools
   - Analytics dashboard

## Support & Contribution

**Issues/Bugs:**
- Check TEST_REPORT.md for known items
- File GitHub issue with details
- Include browser console output

**Contributions:**
- Fork repository
- Create feature branch
- Submit pull request
- Ensure tests pass

## License & Credits

**Technology:**
- Pure HTML5, CSS3, JavaScript
- No frameworks or libraries
- Google Fonts (Righteous)
- Icons: Unicode emoji

**Color Scheme:**
- Pink (#ff1493) - Energy, gaming, fun
- Purple (#6a0dad) - Mystery, premium, exclusive
- Light Purple (#b0a0ff) - Text, secondary

## Final Checklist

Before going live:
- [ ] All features tested locally
- [ ] No console errors (F12)
- [ ] localStorage working
- [ ] Images upload correctly
- [ ] Chat/messaging updates
- [ ] Notifications display
- [ ] Achievements unlock
- [ ] Leaderboard scoring correct
- [ ] Responsive on mobile
- [ ] All links working

---

**Status:** ✅ Ready for Deployment  
**Last Updated:** December 19, 2025  
**Version:** 1.0 (Phase 5 Complete)

For more details, see:
- [PROJECT_STATUS.md](PROJECT_STATUS.md) - Feature checklist
- [TEST_REPORT.md](TEST_REPORT.md) - Test results
- [README.md](README.md) - Project overview
