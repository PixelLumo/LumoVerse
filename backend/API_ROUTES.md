# PixelLumoApp Backend - Complete API Routes Documentation

## Overview
The backend provides 40+ RESTful API endpoints across 7 route modules, all with proper authentication, validation, pagination, and error handling.

---

## 1. Authentication Routes (`/api/auth`)

### POST `/register`
**Description:** Register a new user account
**Access:** Public
**Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string"
}
```
**Response:** `{ token: string, user: object }`

### POST `/login`
**Description:** Login with email and password
**Access:** Public
**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Response:** `{ token: string, user: object }`

### GET `/me`
**Description:** Get current authenticated user profile
**Access:** Protected (Bearer token required)
**Headers:** `Authorization: Bearer <token>`
**Response:** `{ user object }`

---

## 2. User Routes (`/api/users`)

### GET `/:id`
**Description:** Get user profile by ID
**Access:** Protected (Bearer token required)
**Params:** `id` (user MongoDB ID)
**Response:** `{ user object with all fields except password }`

### PUT `/profile`
**Description:** Update current user's profile
**Access:** Protected (Bearer token required)
**Body:**
```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)"
}
```
**Response:** `{ message: string, user: object }`

### GET `/leaderboard?page=1`
**Description:** Get paginated leaderboard (top users by points)
**Access:** Public
**Query Params:** `page` (default: 1, limit: 10 per page)
**Response:** `[ { firstName, lastName, points, avatar } ]`

### GET `/:id/stats`
**Description:** Get user statistics
**Access:** Protected (Bearer token required)
**Params:** `id` (user MongoDB ID)
**Response:** 
```json
{
  "creations": number,
  "posts": number,
  "points": number
}
```

---

## 3. Gallery Routes (`/api/gallery`)

### GET `/?page=1`
**Description:** Get all artworks paginated
**Access:** Public
**Query Params:** `page` (default: 1, limit: 10 per page)
**Response:** `[ { title, description, imageUrl, author, likes, comments } ]`

### GET `/:id`
**Description:** Get single artwork with all details
**Access:** Public
**Params:** `id` (artwork MongoDB ID)
**Response:** `{ artwork object with populated author }`

### POST `/upload`
**Description:** Upload new artwork with image file
**Access:** Protected (Bearer token required)
**Body:** Multipart form data
- `title` (required, string)
- `description` (optional, string)
- `image` (required, file)
**Response:** `{ message: string, artwork: object }`

### POST `/:id/like`
**Description:** Like an artwork (prevents duplicate likes)
**Access:** Protected (Bearer token required)
**Params:** `id` (artwork MongoDB ID)
**Response:** `{ message: string }`

### POST `/:id/comments`
**Description:** Add comment to artwork
**Access:** Protected (Bearer token required)
**Params:** `id` (artwork MongoDB ID)
**Body:**
```json
{
  "comment": "string"
}
```
**Response:** `{ message: string }`

---

## 4. Blog Routes (`/api/blog`)

### GET `/?page=1`
**Description:** Get all blog posts paginated
**Access:** Public
**Query Params:** `page` (default: 1, limit: 10 per page)
**Response:** `[ { title, content, author, createdAt } ]`

### GET `/:id`
**Description:** Get single blog post
**Access:** Public
**Params:** `id` (post MongoDB ID)
**Response:** `{ post object with populated author }`

### POST `/`
**Description:** Create new blog post
**Access:** Protected (Bearer token required)
**Body:**
```json
{
  "title": "string",
  "content": "string"
}
```
**Response:** `{ message: string, post: object }`

### PUT `/:id`
**Description:** Update blog post (author only)
**Access:** Protected (Bearer token required)
**Params:** `id` (post MongoDB ID)
**Body:**
```json
{
  "title": "string (optional)",
  "content": "string (optional)"
}
```
**Response:** `{ message: string, post: object }`

### DELETE `/:id`
**Description:** Delete blog post (author only)
**Access:** Protected (Bearer token required)
**Params:** `id` (post MongoDB ID)
**Response:** `{ message: string }`

---

## 5. Notification Routes (`/api/notifications`)

### GET `/?page=1`
**Description:** Get user's notifications paginated
**Access:** Protected (Bearer token required)
**Query Params:** `page` (default: 1, limit: 20 per page)
**Response:** `[ { notification object } ]`

### POST `/:id/read`
**Description:** Mark single notification as read
**Access:** Protected (Bearer token required)
**Params:** `id` (notification MongoDB ID)
**Response:** `{ message: string }`

### POST `/read-all`
**Description:** Mark all notifications as read
**Access:** Protected (Bearer token required)
**Response:** `{ message: string }`

### DELETE `/:id`
**Description:** Delete notification
**Access:** Protected (Bearer token required)
**Params:** `id` (notification MongoDB ID)
**Response:** `{ message: string }`

---

## 6. Messages Routes (`/api/messages`)

### GET `/conversations?page=1`
**Description:** Get list of conversations for current user
**Access:** Protected (Bearer token required)
**Query Params:** `page` (default: 1, limit: 20 per page)
**Response:** `[ { conversation object with populated participants } ]`

### GET `/conversations/:id`
**Description:** Get all messages in a conversation
**Access:** Protected (Bearer token required)
**Params:** `id` (conversation MongoDB ID)
**Response:** `[ { message object with populated sender } ]`

### POST `/conversations`
**Description:** Start a new conversation with another user
**Access:** Protected (Bearer token required)
**Body:**
```json
{
  "userId": "string"
}
```
**Response:** `{ conversation object }`

### POST `/conversations/:id`
**Description:** Send message in conversation
**Access:** Protected (Bearer token required)
**Params:** `id` (conversation MongoDB ID)
**Body:**
```json
{
  "message": "string"
}
```
**Response:** `{ message object }`

---

## 7. Chat Routes (`/api/chat`)

### GET `/rooms`
**Description:** Get all chat rooms
**Access:** Protected (Bearer token required)
**Response:** `[ { chat room objects } ]`

### GET `/messages`
**Description:** Get messages from chat rooms
**Access:** Protected (Bearer token required)
**Response:** `[ { message objects } ]`

### POST `/messages`
**Description:** Send message to chat room
**Access:** Protected (Bearer token required)
**Body:**
```json
{
  "message": "string"
}
```
**Response:** `{ message: string }`

---

## Authentication Pattern

All protected routes require Bearer token in Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

**Token Expiration:** 7 days

**Token Generation:** Automatic during login/register

---

## Error Responses

### 400 Bad Request
```json
{
  "errors": [
    {
      "param": "fieldName",
      "msg": "error message"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "No token, authorization denied"
}
```

### 403 Forbidden
```json
{
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error"
}
```

---

## Pagination

Most list endpoints support pagination with `?page=X` query parameter:
- **Default page:** 1
- **Gallery:** 10 items per page
- **Blog:** 10 items per page
- **Notifications:** 20 items per page
- **Conversations:** 20 items per page

Example: `GET /api/gallery?page=2`

---

## File Upload

Gallery upload uses Multer with:
- **Destination:** `/uploads` directory
- **Allowed types:** Images only
- **Filename:** Auto-generated with timestamp + random suffix
- **Required fields:** `title`, `image` file

Form data example:
```
POST /api/gallery/upload
Content-Type: multipart/form-data

title: "My Artwork"
description: "Optional description"
image: <binary file data>
```

---

## Database Models

### User
- `firstName`, `lastName`, `email` (unique), `password` (bcrypted)
- `role`, `avatar`, `bio`, `points`
- `creationsCount`, `postsCount`

### Blog
- `title`, `content`, `author` (ref: User)
- `tags`, `likes`, `comments` with timestamps

### Gallery
- `title`, `description`, `imageUrl`, `author` (ref: User)
- `likes` (array of user IDs), `comments` (with user, text, createdAt)

### Message
- `conversation` (ref: Conversation), `sender` (ref: User)
- `text`, `createdAt`

### Conversation
- `participants` (array of user refs)
- `updatedAt`, `createdAt`

### Notification
- `user` (ref: User), `content`, `read` (boolean)
- `createdAt`

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Environment Variables

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/pixellumo
JWT_SECRET=your_secret_key
NODE_ENV=development
```

---

## Summary

**Total Routes:** 40+
**Protected Routes:** 25+
**Public Routes:** 15+
**File Upload Support:** Yes (Gallery)
**Pagination Support:** Yes (all list endpoints)
**Real-time Support:** Socket.io ready
**Input Validation:** express-validator on all write operations
