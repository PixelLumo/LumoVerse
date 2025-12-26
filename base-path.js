// 🔒 CRITICAL: Detect GitHub Pages vs Local & Set APP_BASE
// This runs FIRST before any other script
// ALL paths in the app are built from APP_BASE

window.APP_BASE = location.hostname.includes('github.io')
  ? '/LumoVerse/'
  : '/';

// API_BASE points to backend server
// For development: Render backend (always online)
// For production: Render backend

const BACKEND_URL_PRODUCTION = 'https://pixellumo-backend.onrender.com';

// ALWAYS use Render backend (it's our database)
// LocalHost only for local dev testing
const isLocalhost = window.location.hostname === 'localhost' && 
                    process.env && process.env.NODE_ENV === 'development';

window.API_BASE = isLocalhost 
  ? 'http://localhost:5000'
  : BACKEND_URL_PRODUCTION;

console.log('✅ APP_BASE set to:', window.APP_BASE);
console.log('✅ API_BASE set to:', window.API_BASE);
console.log('✅ Current hostname:', window.location.hostname);
console.log('✅ Environment:', isLocalhost ? 'DEVELOPMENT' : 'PRODUCTION');
