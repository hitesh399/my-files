import { Controller, Post, Body, HttpCode, HttpStatus, Res, Get, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { LoginResponse } from './contracts';
import type { ApiResponse } from '../../common/contracts';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dtos';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private extractAccessToken(request: Request): string | undefined {
    const authorization = request.headers.authorization;

    if (authorization?.startsWith('Bearer ')) {
      return authorization.slice('Bearer '.length).trim();
    }

    const cookieHeader = request.headers.cookie;
    if (!cookieHeader) {
      return undefined;
    }

    const cookies = cookieHeader.split(';').map((entry) => entry.trim());
    const tokenCookie = cookies.find((entry) => entry.startsWith('accessToken='));
    if (!tokenCookie) {
      return undefined;
    }

    const [, rawValue] = tokenCookie.split('=');
    return rawValue ? decodeURIComponent(rawValue) : undefined;
  }

  /**
   * Login user with email and password
   * @param loginRequestDto - User credentials
   * @returns ApiResponse with login data including access token
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User Login',
    description: 'Authenticate user with email and password. Tokens are set in HTTP-only cookies.',
  })
  @ApiBody({
    type: LoginRequestDto,
    description: 'User credentials',
  })
  @SwaggerApiResponse({
    status: 200,
    description: 'Login successful (tokens in HTTP-only cookies)',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Login successful',
        data: {
          user: {
            id: 'user-1',
            email: 'demo@example.com',
            firstName: 'John',
            lastName: 'Doe',
            createdAt: '2024-01-01T00:00:00.000Z',
          },
          expiresIn: 3600,
        },
        timestamp: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    schema: {
      example: {
        success: false,
        statusCode: 400,
        message: 'Validation failed',
        error: 'BadRequestException',
        details: [
          {
            field: 'email',
            message: 'Email must be a valid email address',
          },
          {
            field: 'password',
            message: 'Password must be at least 6 characters',
          },
        ],
        timestamp: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    schema: {
      example: {
        success: false,
        statusCode: 401,
        message: 'Invalid email or password',
        error: 'UnauthorizedException',
        timestamp: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  async login(
    @Body() loginRequestDto: LoginRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const { response, tokens } = await this.authService.login(loginRequestDto);

    // Set HTTP-only cookies for tokens
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // only send over HTTPS in production
      sameSite: 'strict',
      maxAge: tokens.expiresIn * 1000, // convert seconds to milliseconds
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return response without tokens
    res.json({
      success: true,
      statusCode: 200,
      message: 'Login successful',
      data: response,
      timestamp: new Date().toISOString(),
    } as ApiResponse<LoginResponse>);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Current Session User',
    description: 'Resolve current authenticated user from access token.',
  })
  @SwaggerApiResponse({
    status: 200,
    description: 'Current session user profile',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Session user resolved',
        data: {
          id: 'user-1',
          email: 'demo@example.com',
          firstName: 'John',
          lastName: 'Doe',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        timestamp: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    schema: {
      example: {
        success: false,
        statusCode: 401,
        message: 'Unauthorized',
        error: 'UnauthorizedException',
        timestamp: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  getSessionUser(@Req() req: Request): ApiResponse<LoginResponse['user']> {
    const token = this.extractAccessToken(req);
    const user = this.authService.getSessionUserFromToken(token);

    return {
      success: true,
      statusCode: 200,
      message: 'Session user resolved',
      data: user,
      timestamp: new Date().toISOString(),
    };
  }
}



