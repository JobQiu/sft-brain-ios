# Backend Integration Guide

This guide explains how to connect the standalone SFT Brain iOS app to your real backend API.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Environment Configuration](#environment-configuration)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Switching from Mock to Real API](#switching-from-mock-to-real-api)
- [Testing Backend Integration](#testing-backend-integration)
- [Deployment Considerations](#deployment-considerations)

## Overview

The app is built to work in two modes:

1. **Standalone Mode** (Current): Uses mock data and mock API
2. **Backend Mode**: Connects to your real Flask/Python backend

The switch is controlled by a single environment variable.

## Quick Start

### Prerequisites

- Backend API running and accessible
- Backend URL (e.g., `http://localhost:3000` for local, `https://api.example.com` for production)

### Steps

1. **Update Environment Variables**:
   ```bash
   # Edit .env.local
   NEXT_PUBLIC_USE_MOCK_DATA=false
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
   ```

2. **Rebuild the App**:
   ```bash
   npm run dev  # For web testing
   # or
   npm run build:mobile && npx cap sync ios  # For iOS
   ```

That's it! The app will now use your real backend.

## Environment Configuration

### Development (.env.local)

```bash
# Set to false to use real backend
NEXT_PUBLIC_USE_MOCK_DATA=false

# Your backend URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# Google OAuth Client ID (get from Google Cloud Console)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### Production (.env.production)

```bash
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_API_BASE_URL=https://api.sftbrain.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_production_client_id.apps.googleusercontent.com
```

## API Endpoints

All API calls are made through `lib/api-client.ts`. Here are the endpoints your backend must implement:

### Authentication

#### POST /api/auth/login
**Description**: Initiate Google OAuth flow

**Request**:
```json
{
  "redirect_uri": "http://localhost:3001/auth/callback"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "auth_url": "https://accounts.google.com/o/oauth2/v2/auth?..."
  }
}
```

#### POST /api/auth/test-login (Development Only)
**Description**: Test login without OAuth

**Request**:
```json
{
  "email": "user@example.com",
  "name": "Test User"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "Test User",
      "profile_picture": "https://..."
    }
  }
}
```

#### POST /api/auth/logout
**Description**: Logout user

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### QA Pairs

#### GET /api/qa-pairs
**Description**: Get all QA pairs for current user

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `limit` (optional): Number of results
- `offset` (optional): Pagination offset
- `due_only` (optional): Filter to only due reviews

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "question": "What is React?",
      "answer": "A JavaScript library for building user interfaces",
      "tags": ["react", "javascript"],
      "created_at": "2025-01-01T00:00:00Z",
      "next_review_at": "2025-01-10T00:00:00Z",
      "review_count": 5,
      "user_id": "1"
    }
  ]
}
```

#### GET /api/qa-pairs/:id
**Description**: Get single QA pair

**Response**: Same as single item above

#### POST /api/qa-pairs
**Description**: Create new QA pair

**Request**:
```json
{
  "question": "What is TypeScript?",
  "answer": "A typed superset of JavaScript",
  "tags": ["typescript", "javascript"],
  "source": "Official docs",
  "source_url": "https://typescriptlang.org",
  "image_url": "https://..."
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "2",
    "question": "What is TypeScript?",
    ...
  }
}
```

#### PUT /api/qa-pairs/:id
**Description**: Update QA pair

**Request**: Same as POST (partial updates supported)

**Response**: Updated QA pair

#### DELETE /api/qa-pairs/:id
**Description**: Delete QA pair

**Response**:
```json
{
  "success": true,
  "message": "QA pair deleted"
}
```

#### POST /api/qa-pairs/:id/review
**Description**: Submit review result

**Request**:
```json
{
  "result": "correct"  // or "incorrect", "partial"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "qa_pair": { ... },
    "next_review": "2025-01-15T00:00:00Z"
  }
}
```

### Stats

#### GET /api/stats/overview
**Description**: Get dashboard statistics

**Response**:
```json
{
  "success": true,
  "data": {
    "total_qa_pairs": 50,
    "reviews_due_today": 10,
    "total_reviews_completed": 250,
    "average_accuracy": 85.5,
    "day_streak": 7,
    "activity_data": [
      { "date": "2025-01-01", "count": 5 },
      { "date": "2025-01-02", "count": 8 }
    ]
  }
}
```

### Tags

#### GET /api/tags
**Description**: Get all tags for current user

**Response**:
```json
{
  "success": true,
  "data": [
    { "id": "1", "name": "javascript", "count": 15 },
    { "id": "2", "name": "react", "count": 8 }
  ]
}
```

### AI Features (Optional)

#### POST /api/qa-pairs/generate-from-question
**Description**: Generate answer using AI

**Request**:
```json
{
  "question": "What is closure in JavaScript?"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "answer": "A closure is a function that has access to variables..."
  }
}
```

#### POST /api/transcribe/audio
**Description**: Transcribe audio to text

**Request**: multipart/form-data with audio file

**Response**:
```json
{
  "success": true,
  "data": {
    "text": "Transcribed text here"
  }
}
```

#### POST /api/upload-image
**Description**: Upload image

**Request**: multipart/form-data with image file

**Response**:
```json
{
  "success": true,
  "data": {
    "url": "https://your-cdn.com/images/abc123.jpg"
  }
}
```

## Authentication Flow

### Google OAuth Flow

1. **User clicks "Continue with Google"**
   ```typescript
   // App calls: POST /api/auth/login
   const response = await fetch('/api/auth/login', {
     method: 'POST',
     body: JSON.stringify({ redirect_uri: window.location.origin + '/auth/callback' })
   })
   ```

2. **Backend returns OAuth URL**
   ```json
   { "auth_url": "https://accounts.google.com/o/oauth2/v2/auth?..." }
   ```

3. **App opens OAuth URL** (in-app browser on Capacitor, redirect on web)

4. **Google redirects to callback** with code:
   ```
   /auth/callback?code=4/0AX4XfWh...
   ```

5. **App sends code to backend**
   ```typescript
   const tokenResponse = await fetch('/oauth/callback', {
     method: 'POST',
     body: JSON.stringify({ code, state })
   })
   ```

6. **Backend returns JWT token + user data**
   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": { "id": 1, "email": "user@gmail.com", ... }
   }
   ```

7. **App stores token** using `lib/api-client.ts:saveAuthToken()`
   - Web: localStorage
   - Capacitor: Secure Preferences API

8. **All subsequent requests** include token:
   ```
   Authorization: Bearer <token>
   ```

### Email/Password Flow (If Implemented)

Your backend should add these endpoints:

#### POST /api/auth/register
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

#### POST /api/auth/login/email
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response: Same as Google OAuth (token + user)

## Switching from Mock to Real API

### Code Changes Required

#### 1. Update lib/api-client.ts (Already Done)

The API client checks the environment variable:

```typescript
const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

if (useMockData) {
  // Use mock API
  return mockAPI.getQAPairs(...)
} else {
  // Use real API
  return fetch(`${API_BASE_URL}/api/qa-pairs`, ...)
}
```

#### 2. Update Authentication (Already Done)

The auth context (`lib/mobile/auth-context.tsx`) already handles both:
- Google OAuth (real backend)
- Email/password (can use either mock or real)

### Testing the Switch

1. **Start with mock mode** (verify app works):
   ```bash
   NEXT_PUBLIC_USE_MOCK_DATA=true npm run dev
   ```

2. **Start your backend**:
   ```bash
   cd ../sft-brain
   ./run-dev.sh
   ```

3. **Switch to backend mode**:
   ```bash
   # Edit .env.local
   NEXT_PUBLIC_USE_MOCK_DATA=false
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
   
   # Restart
   npm run dev
   ```

4. **Test authentication**:
   - Try logging in with Google OAuth
   - Verify token is saved
   - Check network tab for API calls

5. **Test CRUD operations**:
   - Create a QA pair
   - Edit it
   - Delete it
   - Verify data persists in backend

## Testing Backend Integration

### Checklist

#### Authentication
- [ ] Google OAuth login works
- [ ] Token is saved correctly
- [ ] Token is sent with API requests
- [ ] Logout clears token
- [ ] Expired token handling
- [ ] Protected routes redirect to login

#### QA Pairs
- [ ] Fetch QA pairs from backend
- [ ] Create new QA pair
- [ ] Update QA pair
- [ ] Delete QA pair
- [ ] Submit review
- [ ] Filter by tags
- [ ] Search functionality
- [ ] Pagination works

#### Offline/Network Errors
- [ ] App handles network errors gracefully
- [ ] Shows appropriate error messages
- [ ] Can retry failed requests
- [ ] Offline mode (if implemented)

#### Performance
- [ ] API responses are fast enough
- [ ] Loading states shown
- [ ] No unnecessary API calls
- [ ] Caching works (React Query)

### Debugging Tips

#### 1. Enable Network Logging

Add to `lib/api-client.ts`:

```typescript
const response = await fetch(url, options)
console.log('API Request:', url, options)
console.log('API Response:', await response.clone().json())
```

#### 2. Check Backend Logs

Monitor your Flask backend console for:
- Incoming requests
- Authentication success/failure
- Database queries
- Errors

#### 3. Use Browser DevTools

- Network tab: See all API calls
- Application tab: Check localStorage for tokens
- Console: Check for JavaScript errors

#### 4. Test CORS

If you get CORS errors, ensure backend allows:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['http://localhost:3001', 'https://your-app.com'])
```

## Deployment Considerations

### Production Environment

#### 1. Environment Variables

For production build:

```bash
# .env.production
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_API_BASE_URL=https://api.sftbrain.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<production-oauth-client-id>
```

#### 2. HTTPS Requirements

- API must use HTTPS in production
- Apple requires HTTPS for App Store apps
- Mixed content (HTTP API + HTTPS app) will be blocked

#### 3. CORS Configuration

Backend must allow your app domain:

```python
CORS(app, origins=[
  'https://app.sftbrain.com',
  'capacitor://localhost',  # For Capacitor iOS
  'ionic://localhost'        # For Capacitor Android
])
```

#### 4. API Rate Limiting

Implement rate limiting on backend to prevent abuse:

```python
from flask_limiter import Limiter

limiter = Limiter(app, key_func=get_remote_address)

@app.route('/api/qa-pairs', methods=['POST'])
@limiter.limit("10 per minute")
def create_qa_pair():
    ...
```

### Mobile-Specific Considerations

#### 1. Capacitor Base URL

For mobile apps, use absolute URLs:

```typescript
// capacitor.config.ts
server: {
  androidScheme: 'https',
  iosScheme: 'https',
}
```

#### 2. OAuth Redirect URI

For Capacitor apps, use custom URL scheme:

```
sftbrain://auth/callback
```

Register in Google Cloud Console and handle in app.

#### 3. Secure Storage

Tokens are stored securely on mobile using Capacitor Preferences API (encrypted keychain on iOS).

### Monitoring

Consider adding:

1. **Error Tracking**: Sentry, Rollbar
2. **Analytics**: Mixpanel, Google Analytics
3. **Performance**: New Relic, Datadog
4. **Crash Reporting**: Firebase Crashlytics

## Code Integration Points

### Files that Handle API Calls

1. **lib/api-client.ts**: Main API client, handles auth token
2. **lib/mobile/auth-context.tsx**: Authentication state management
3. **lib/mobile/qa-store.ts**: QA pairs data operations
4. **lib/mobile/use-oauth-listener.tsx**: OAuth callback handler

### Adding New API Endpoints

Example: Adding a new "favorites" feature

1. **Add type** in `lib/types.ts`:
   ```typescript
   export interface Favorite {
     id: string
     qa_pair_id: string
     user_id: string
     created_at: Date
   }
   ```

2. **Add to mock API** in `lib/mock/api.ts`:
   ```typescript
   async getFavorites(userId: string) {
     await delay()
     return mockFavorites.filter(f => f.user_id === userId)
   }
   ```

3. **Add to api-client** in `lib/api-client.ts`:
   ```typescript
   export async function getFavorites() {
     if (useMockData) {
       return mockAPI.getFavorites(currentUserId)
     }
     
     const response = await fetch(`${API_BASE_URL}/api/favorites`, {
       headers: { Authorization: `Bearer ${token}` }
     })
     return response.json()
   }
   ```

4. **Use in component**:
   ```typescript
   import { getFavorites } from '@/lib/api-client'
   
   const favorites = await getFavorites()
   ```

## Support

If you encounter issues:

1. Check backend logs for errors
2. Verify environment variables are set correctly
3. Test API endpoints directly with Postman/curl
4. Check browser console for JavaScript errors
5. Review CORS configuration

For backend-specific questions, refer to the main `sft-brain` repository documentation.

---

**Ready to deploy?** Make sure to:
- [ ] Update environment variables
- [ ] Test all features with real backend
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up monitoring
- [ ] Test on iOS device
