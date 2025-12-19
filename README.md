# PixelLumo - Gaming Community Hub

A modern, interactive gaming community platform built with HTML, CSS, and JavaScript.

## Features

- **Community Chat** - Real-time messaging for community members
- **User Authentication** - Secure login and registration system
- **Blog & Tutorials** - Share gaming tips and content
- **Gallery** - Showcase gaming screenshots and media
- **Messaging** - Private messaging between users
- **Leaderboard** - Track user rankings and achievements
- **Notifications** - Stay updated with community activities
- **Patreon Support** - Supporter tier system and benefits

## Project Structure

```
├── index.html              # Login page
├── pages/                  # Main application pages
│   ├── home.html          # Home page
│   ├── chat.html          # Community chat
│   ├── community.html     # Community hub
│   ├── blog.html          # Blog posts
│   ├── tutorials.html     # Gaming tutorials
│   ├── gallery.html       # Image gallery
│   ├── messaging.html     # Private messages
│   ├── notifications.html # User notifications
│   ├── leaderboard.html   # Leaderboard
│   ├── patreon.html       # Support page
│   ├── about.html         # About page
│   └── contact.html       # Contact page
├── css/                   # Stylesheets
│   ├── style.css          # Main styles
│   ├── chat.css           # Chat styling
│   ├── community.css      # Community page styles
│   └── [others]           # Feature-specific styles
├── js/                    # JavaScript modules
│   ├── auth.js            # Authentication logic
│   ├── auth-service.js    # Auth service API
│   ├── chat.js            # Chat functionality
│   ├── router.js          # Route management
│   └── [others]           # Feature modules
├── assets/                # Images and media
└── docs/                  # Documentation
```

## Getting Started

1. Open `index.html` in your browser
2. Log in or create an account
3. Navigate to different sections using the header menu
4. Explore community features

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Architecture**: Client-side modular application
- **Styling**: Custom CSS with dark theme
- **Design**: Responsive and modern UI

## Features Overview

### Authentication
- User login and registration
- Password visibility toggle
- Remember me functionality
- Session management

### Community Chat
- Real-time message display
- User-friendly message formatting
- Character limit (500 characters)
- Timestamp tracking

### Content Management
- Blog posts and tutorials
- Image gallery showcase
- User messaging system
- Notification center

## Development

All components are modularized for easy maintenance:
- Each page has its own CSS file
- JavaScript modules handle specific features
- Central auth service manages authentication
- Router manages page navigation

## Contributing

This is a community project. Feel free to contribute improvements and features.

## License

© 2025 PixelLumo. All rights reserved.
