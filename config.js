# Quick Setup: Enable Backend Authentication

## TL;DR - 3 Steps

### Step 1: Create/Update `js/config.js`

Create this file in your `js/` folder:

```javascript
/**
 * PixelLumo Configuration
 * Switches between demo mode and real backend authentication
 */

// Detect if running on GitHub Pages or localhost
const isGitHubPages = window.location.hostname.includes('github.io');
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';

// Configure API endpoint
if (isDevelopment) {
    window.API_BASE = 'http://localhost:5000';
} else {
    // Change this to your deployed backend URL
    window.API_BASE = 'https://pixellumo-backend.onrender.com';
}

// Use backend authentication in production
window.USE_BACKEND = !isDevelopment;

console.log('🎮 PixelLumo Config');
console.log('API_BASE:', window.API_BASE);
console.log('USE_BACKEND:', window.USE_BACKEND);
