import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import type { LoginRequest, LoginResponse, TokenData, User } from './contracts';
import type { ApiResponse } from '../../common/contracts';

@Injectable()
export class AuthService {
  /**
   * Mock user database - in real app, use a database
   */
  private mockUsers = [
    {
      id: 'user-1',
      email: 'demo@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date('2024-01-01'),
    },
  ];

  /**
   * Login user with email and password
   * Returns user data + token data (tokens should be set as HTTP-only cookies)
   */
  async login(
    loginRequest: LoginRequest,
  ): Promise<{ response: LoginResponse; tokens: TokenData }> {
    const { email, password } = loginRequest;

    // Validation
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    // Find user by email (in real app, use database)
    const user = this.mockUsers.find((u) => u.email === email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password (in real app, use bcrypt)
    if (user.password !== password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate mock tokens
    const accessToken = this.generateMockToken('access');
    const refreshToken = this.generateMockToken('refresh');
    const expiresIn = 3600; // 1 hour

    return {
      response: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt.toISOString(),
        },
        expiresIn,
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn,
      },
    };
  }

  /**
   * Resolve current session user from access token.
   * For now this returns a mock user when a token is present.
   */
  getSessionUserFromToken(token?: string): User {
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    const user = this.mockUsers[0];

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt.toISOString(),
    };
  }

  /**
   * Generate mock JWT token
   */
  private generateMockToken(type: 'access' | 'refresh'): string {
    const timestamp = Date.now();
    return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${type}.${timestamp}`;
  }
}

