# API Documentation (Swagger)

## Overview

The Auth API now includes **Swagger/OpenAPI** documentation that provides an interactive UI for exploring and testing all API endpoints.

## Accessing Swagger Documentation

### Local Development
Once the Auth API is running locally, access the Swagger UI at:

```
http://localhost:3000/api/docs
```

### Production
For production environments, update the port accordingly:

```
http://<api-host>:<port>/api/docs
```

## Features

✅ **Interactive API Explorer** - Test endpoints directly from the browser  
✅ **Request/Response Examples** - See real-world usage examples  
✅ **Schema Validation** - Auto-generated from TypeScript DTOs  
✅ **Error Responses** - All possible error scenarios documented  
✅ **Authentication** - Bearer token support for authenticated endpoints  

## Endpoints Documentation

### Authentication (Auth)

#### `POST /auth/login`

**Description:** Authenticate user with email and password

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user-1",
      "email": "user@example.com",
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

**Validation Error (400 Bad Request):**
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

**Authentication Error (401 Unauthorized):**
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid email or password",
  "error": "UnauthorizedException",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Using Swagger UI

### 1. **View Endpoint Details**
   - Click on any endpoint to expand and see full documentation
   - Review request parameters and response schemas

### 2. **Test Endpoints**
   - Click the "Try it out" button
   - Fill in the request parameters
   - Click "Execute" to make the request
   - View the response in the UI

### 3. **Use Bearer Token Authentication**
   - Click the lock icon next to an endpoint
   - Enter your JWT access token in the "Value" field
   - Token will be automatically included in all subsequent requests

### 4. **Download OpenAPI Specification**
   - Click the "Download" button to get the OpenAPI JSON/YAML
   - Use with code generation tools or API documentation generators

## Setup & Installation

### Install Dependencies
```bash
npm install
```

This includes:
- `@nestjs/swagger` - Swagger/OpenAPI module
- `swagger-ui-express` - Interactive Swagger UI
- `class-validator` - Request validation
- `class-transformer` - DTO transformation

### Running the API
```bash
npm run start:dev
```

The API will start on port 3000 (configurable via `PORT` environment variable)

## Frontend Integration

### For Frontend Developers

You can use the OpenAPI specification to generate API client code:

**Using OpenAPI Generator:**
```bash
# Generate TypeScript client
openapi-generator-cli generate \
  -i http://localhost:3000/api/docs-json \
  -g typescript-fetch \
  -o ./src/api
```

**Using swagger-codegen:**
```bash
swagger-codegen generate \
  -i http://localhost:3000/api/docs-json \
  -l typescript-axios \
  -o ./src/api
```

### Example: Using the Login Endpoint

**React/TypeScript Example:**
```typescript
interface LoginRequest {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  timestamp: string;
}

async function login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  return response.json();
}
```

## Environment Variables

```env
# Port (default: 3000)
PORT=3000

# Swagger UI path
SWAGGER_PATH=api/docs
```

## Testing with cURL

```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "password123"
  }'
```

## Sharing with Team

### Option 1: Live API Server
Share the API endpoint with your team:
```
Frontend Dev Docs: http://<your-domain>:3000/api/docs
```

### Option 2: Static HTML Export
Export Swagger UI as static HTML:
```bash
# Use swagger-ui-dist to create a static version
npm install --save-dev swagger-ui-dist
```

### Option 3: OpenAPI JSON
Download the OpenAPI specification and share:
```
http://localhost:3000/api/docs-json
```

## Common Issues

### Issue: Swagger UI not loading
**Solution:** Ensure `@nestjs/swagger` and `swagger-ui-express` are installed
```bash
npm install @nestjs/swagger swagger-ui-express
```

### Issue: Decorators not showing up
**Solution:** Ensure DTOs have `@ApiProperty` decorators and `reflect-metadata` is imported

### Issue: CORS issues with Swagger UI
**Solution:** Verify CORS is enabled in `main.ts`:
```typescript
app.enableCors();
```

## Next Steps

1. ✅ Run the API: `npm run start:dev`
2. ✅ Open Swagger: `http://localhost:3000/api/docs`
3. ✅ Test endpoints in the UI
4. ✅ Share the Swagger link with frontend team
5. ✅ Frontend can generate client code from OpenAPI spec

## Resources

- [NestJS Swagger Documentation](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI/Swagger Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
