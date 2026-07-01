# Frontend Developer Guide - Auth API

## Auth MFE Integration Architecture

The auth micro frontend follows this source layout:

```text
src/
├── app/routes
├── app/providers
├── app/config
├── pages
├── components
├── services
├── hooks
├── store
├── context
├── constants
├── utils
└── assets
```

### State Ownership Rules

- Use Redux Toolkit for global/auth domain state:
  - logged-in user
  - session status (validated from backend cookie)
  - async status and API errors
- Use React Context for component-level transient state:
  - form-only preferences
  - local UI toggles not reused outside component tree

### Service Layer Contract

- Keep all API calls in `src/services/*`.
- UI components and pages should not call `fetch` directly.
- Hooks (example: `useLogin`) orchestrate service + store dispatch.
- All authenticated requests must include credentials: `credentials: 'include'`.

### Secure Login Strategy (Cookie Only)

- Authentication uses secure HttpOnly cookies only.
- Access/refresh tokens are never stored in localStorage/sessionStorage.
- Frontend verifies session using backend endpoints (example: `/auth/me`).
- Logout must invalidate cookie-backed session server-side.

### Theme and Localization Contract

- Themes: `light`, `dark`, `sunset`
- Locales: `en`, `hi`
- theme-mfe is source of truth for theme.
- localization-mfe is source of truth for language.
- Persist values in localStorage only as standalone fallback.
- All user-visible strings must come from i18n translation keys, not hardcoded strings.

### Platform Context Event Bus

- Channel version: `platform-context/v1`
- Events:
  - `platform-context/v1:request-context`
  - `platform-context/v1:context-snapshot`
  - `platform-context/v1:set-theme`
  - `platform-context/v1:set-language`
- All payloads must include `source`.
- Consumers must ignore events emitted by same source to avoid loops.

### Environment Variable

Auth MFE API base URL:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

## Quick Start

### 1. Access API Documentation
Once the Auth API is running, open your browser and navigate to:

```
http://localhost:3000/api/docs
```

You'll see an interactive Swagger UI with all available endpoints.

---

## Login Endpoint

### Endpoint Details

**Method:** `POST`  
**Path:** `/auth/login`  
**Authentication:** Not required

### Request

**Content-Type:** `application/json`

**Body:**
```json
{
  "email": "demo@example.com",
  "password": "password123"
}
```

**Field Validation:**
- `email`: Must be a valid email address
- `password`: Minimum 6 characters

### Response (Success - 200 OK)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user-1",
      "email": "demo@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access.1704067200000",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh.1704067200000",
    "expiresIn": 3600
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Response (Error - 400 Bad Request)

**When validation fails:**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "error": "BadRequestException",
  "details": [
    {
      "field": "email",
      "message": "Email must be a valid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Response (Error - 401 Unauthorized)

**When credentials are invalid:**

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid email or password",
  "error": "UnauthorizedException",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Test User Credentials

Use these credentials to test the login endpoint:

```
Email:    demo@example.com
Password: password123
```

---

## API Response Format

All API responses follow this standard format:

```typescript
interface ApiResponse<T> {
  success: boolean;           // true for success, false for error
  statusCode: number;         // HTTP status code (200, 400, 401, etc.)
  message: string;            // Human-readable message
  data?: T;                   // Response payload (only on success)
  error?: string;             // Error name (only on error)
  details?: Record<string, any>; // Additional details (validation errors)
  timestamp: string;          // ISO 8601 timestamp
}
```

---

## Integration Examples

### React/TypeScript

```typescript
import { useState } from 'react';

interface LoginRequest {
  email: string;
  password: string;
}

async function loginUser(credentials: LoginRequest) {
  try {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (data.success) {
      // Store tokens
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      console.log('User:', data.data.user);
      return data.data;
    } else {
      // Handle error
      console.error('Login failed:', data.message);
      if (data.details) {
        // Show validation errors
        data.details.forEach((error: any) => {
          console.error(`${error.field}: ${error.message}`);
        });
      }
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

// Component usage
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginUser({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Vue.js Example

```vue
<template>
  <form @submit.prevent="login">
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button type="submit">Login</button>
    <div v-if="error" class="error">{{ error }}</div>
  </form>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const error = ref('');

const login = async () => {
  try {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      // Redirect or update app state
    } else {
      error.value = data.message;
    }
  } catch (err) {
    error.value = 'Network error';
  }
};
</script>
```

### JavaScript/Fetch

```javascript
const loginButton = document.getElementById('login-btn');

loginButton.addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();

  if (result.success) {
    console.log('Login successful!');
    localStorage.setItem('token', result.data.accessToken);
  } else {
    console.error('Login failed:', result.message);
  }
});
```

---

## Using Swagger UI to Test

### Step-by-Step Guide

1. **Open Swagger UI**
   - Navigate to `http://localhost:3000/api/docs`

2. **Find the Login Endpoint**
   - Look for "Auth" section
   - Click on "POST /auth/login"

3. **Test the Endpoint**
   - Click "Try it out" button
   - Fill in the email and password fields
   - Click "Execute"
   - See the response

4. **View Response Details**
   - Check the response code (200, 400, 401, etc.)
   - Review the response body
   - Copy the response if needed

---

## Token Usage

### Access Token

The `accessToken` is a JWT that can be used for authenticated requests:

```javascript
// Include in Authorization header
const headers = {
  'Authorization': `Bearer ${accessToken}`,
};
```

### Token Expiration

The `expiresIn` field indicates how long the token is valid (in seconds):

```javascript
// Example: 3600 seconds = 1 hour
const expiresIn = 3600; // seconds
const expiresAt = Date.now() + expiresIn * 1000; // milliseconds
```

---

## Error Handling

### Best Practices

```typescript
async function handleLogin(email: string, password: string) {
  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    // Check success flag first
    if (!result.success) {
      // Handle validation errors
      if (result.details && Array.isArray(result.details)) {
        result.details.forEach((error: any) => {
          console.log(`${error.field}: ${error.message}`);
        });
      } else {
        // Handle other errors
        console.log(result.message);
      }
      return;
    }

    // Success - use the data
    const { user, accessToken, refreshToken, expiresIn } = result.data;
    // Store tokens and redirect
  } catch (error) {
    console.error('Network error:', error);
  }
}
```

---

## Common Issues

### Issue: CORS Error
**Cause:** API is running on a different domain/port  
**Solution:** Ensure the API has CORS enabled (it should by default)

### Issue: 400 Bad Request
**Cause:** Invalid email or password too short  
**Solution:** Check the `details` field in the response for validation errors

### Issue: 401 Unauthorized
**Cause:** Email or password is incorrect  
**Solution:** Verify credentials and try again

---

## Debugging Tips

1. **Use Browser DevTools**
   - Open Network tab to see requests
   - Check request headers and body
   - Review response status and data

2. **Use Swagger UI**
   - Test endpoints directly in the browser
   - See formatted request/response

3. **Check Console Logs**
   - Log request data before sending
   - Log response data after receiving

4. **Use Postman/REST Client**
   - Import OpenAPI spec: `http://localhost:3000/api/docs-json`
   - Test with more advanced features

---

## Questions?

For issues or questions about the API:
1. Check the Swagger documentation at `http://localhost:3000/api/docs`
2. Review this guide
3. Contact the backend team

**Happy coding! 🚀**
