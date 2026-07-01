/**
 * Auth API Integration Example
 * Demonstrates how to use the auth contracts with the API
 */

import type { LoginRequest, LoginResponse } from './contracts';
import type { ApiResponse } from '../../common/contracts';

/**
 * Example: Login request
 */
const loginRequest: LoginRequest = {
  email: 'demo@example.com',
  password: 'password123',
};

/**
 * Example: Login API call and response
 * Note: Tokens are set in HTTP-only cookies, not in response body
 */
async function exampleLogin() {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginRequest),
    credentials: 'include', // Important: send cookies with request
  });

  const data = (await response.json()) as ApiResponse<LoginResponse>;

  if (data.success) {
    console.log('Login successful!');
    console.log('User:', data.data?.user);
    console.log('Token expires in:', data.data?.expiresIn, 'seconds');
    console.log('Tokens are set in HTTP-only cookies automatically');
  } else {
    console.error('Login failed:', data.message);
  }
}

/**
 * Example: Invalid login (validation error)
 */
const invalidLoginRequest: LoginRequest = {
  email: 'invalid-email',
  password: 'short',
};

/**
 * Example: Expected error response structure
 *
 * Response:
 * {
 *   "success": false,
 *   "statusCode": 400,
 *   "message": "Validation failed",
 *   "error": "BadRequestException",
 *   "details": [
 *     {
 *       "field": "email",
 *       "message": "Email must be a valid email address"
 *     },
 *     {
 *       "field": "password",
 *       "message": "Password must be at least 6 characters"
 *     }
 *   ],
 *   "timestamp": "2024-01-01T00:00:00.000Z"
 * }
 */

export {};
