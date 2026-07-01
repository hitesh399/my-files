/**
 * User information in login response
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

/**
 * Login response contract (tokens are set in HTTP-only cookies)
 */
export interface LoginResponse {
  user: User;
  expiresIn: number;
}

/**
 * Internal token data (not exposed in API response)
 */
export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
