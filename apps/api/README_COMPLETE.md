# Auth API - Complete Setup & Documentation

Complete authentication API with Swagger documentation for secure user login and token management.

## ✨ Features

- ✅ **User Login Endpoint** - Authenticate with email and password
- ✅ **JWT Token Generation** - Access & refresh tokens
- ✅ **Request Validation** - Input validation with detailed error messages
- ✅ **Swagger Documentation** - Interactive API explorer
- ✅ **CORS Enabled** - Works seamlessly with frontend applications
- ✅ **Global Exception Handling** - Standardized error responses
- ✅ **TypeScript** - Full type safety

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This includes:
- NestJS framework
- Swagger/OpenAPI documentation
- Validation libraries
- TypeScript support

### 2. Run the API

**Development Mode (with hot reload):**
```bash
npm run start:dev
```

**Production Mode:**
```bash
npm run build
npm run start:prod
```

### 3. Access Swagger Documentation

Once running, open your browser:

```
http://localhost:3000/api/docs
```

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [SWAGGER_DOCUMENTATION.md](./SWAGGER_DOCUMENTATION.md) | Complete API documentation with examples |
| [src/modules/auth/AUTH_MODULE.md](./src/modules/auth/AUTH_MODULE.md) | Auth module architecture & design |
| [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) | Implementation details |

## 🔐 API Endpoints

### Authentication

#### `POST /auth/login`

Authenticate user with email and password.

**Request:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "password123"
  }'
```

**Response (Success):**
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

## 📋 Project Structure

```
auth-api/
├── src/
│   ├── modules/
│   │   └── auth/
│   │       ├── auth.controller.ts       # API endpoints
│   │       ├── auth.service.ts          # Business logic
│   │       ├── auth.module.ts           # Module definition
│   │       ├── dtos/
│   │       │   ├── LoginRequest.dto.ts  # Request validation
│   │       │   └── index.ts
│   │       ├── AUTH_MODULE.md           # Module documentation
│   │       └── auth.example.ts          # Usage examples
│   ├── common/
│   │   ├── filters/
│   │   │   └── AllExceptions.filter.ts  # Error handling
│   │   └── index.ts
│   ├── app.module.ts                    # App module
│   ├── app.controller.ts                # App controller
│   ├── app.service.ts                   # App service
│   └── main.ts                          # Application entry point
├── test/
│   └── app.e2e-spec.ts                  # E2E tests
├── SWAGGER_DOCUMENTATION.md             # Swagger docs
├── IMPLEMENTATION_SUMMARY.md            # Implementation notes
├── tsconfig.json                        # TypeScript config
├── nest-cli.json                        # NestJS CLI config
└── package.json                         # Dependencies & scripts
```

## 🧪 Test User

Use these credentials to test the login endpoint:

```
Email:    demo@example.com
Password: password123
```

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm run start` | Start the API server |
| `npm run start:dev` | Start with hot reload |
| `npm run start:debug` | Start with debugger attached |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:cov` | Generate coverage report |
| `npm run test:e2e` | Run E2E tests |

## 📖 Using Swagger UI

### For Backend Developers

1. **View All Endpoints**
   - Opens with all available routes
   - See request/response schemas
   - Check validation rules

2. **Test Endpoints**
   - Click "Try it out" on any endpoint
   - Fill in request parameters
   - Click "Execute" to make the request
   - View response in real-time

3. **Share API Documentation**
   - Share the Swagger URL with your team
   - Frontend developers can understand API contract
   - No need for separate documentation

### For Frontend Developers

See [FRONTEND_API_GUIDE.md](../FRONTEND_API_GUIDE.md) for:
- Step-by-step integration guide
- Code examples (React, Vue, Vanilla JS)
- Error handling best practices
- Token management

## 🔄 API Response Format

All endpoints return a standardized response format:

```typescript
interface ApiResponse<T> {
  success: boolean;        // Operation status
  statusCode: number;      // HTTP status code
  message: string;         // Human-readable message
  data?: T;                // Response payload (success only)
  error?: string;          // Error type (error only)
  details?: any;           // Additional details (errors only)
  timestamp: string;       // ISO 8601 timestamp
}
```

## ✔️ Validation Rules

### Login Request

| Field | Rules | Example |
|-------|-------|---------|
| email | Valid email format required | `user@example.com` |
| password | Minimum 6 characters | `password123` |

## 🔗 Integration with Shared Contracts

The API uses standardized contracts from the shared package:

```typescript
import type {
  LoginRequest,      // Request interface
  LoginResponse,     // Response interface
  ApiResponse,       // Generic wrapper
  ApiErrorResponse   // Error format
} from '@shared/contracts';
```

**Location:** `../../shared/contracts`

**Path Alias:** `@shared/*` (configured in tsconfig.json)

## 🛡️ Error Handling

### Global Exception Filter

All exceptions are automatically caught and formatted:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "error": "BadRequestException",
  "details": [...],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Login successful |
| 400 | Validation Error | Invalid email |
| 401 | Unauthorized | Wrong password |
| 500 | Server Error | Unexpected error |

## 🌐 CORS Configuration

CORS is enabled by default for all origins. Configure in `main.ts`:

```typescript
app.enableCors();
```

## 📝 Environment Variables

Create a `.env` file in the project root:

```env
# Server port
PORT=3000

# Enable debug logging
DEBUG=*

# Database URL (future)
DATABASE_URL=mongodb://localhost:27017/auth
```

## 🔧 Configuration Files

- **tsconfig.json** - TypeScript compiler options
- **nest-cli.json** - NestJS CLI configuration
- **eslint.config.mjs** - ESLint rules
- **jest.config.js** - Jest testing configuration

## 📊 Architecture

### Request Flow

```
Client Request
  ↓
CORS Check
  ↓
ValidationPipe (auto-validate DTOs)
  ↓
Controller (route handler)
  ↓
Service (business logic)
  ↓
Response Wrapper (ApiResponse<T>)
  ↓
Client Response

[If Error]
  ↓
AllExceptionsFilter (catch all errors)
  ↓
ApiErrorResponse format
  ↓
Client Error Response
```

## 🚢 Deployment

### Docker Support

A Dockerfile can be created for containerization:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
```

Build Docker image:
```bash
npm run build
docker build -t auth-api:1.0 .
docker run -p 3000:3000 auth-api:1.0
```

## 📦 Dependencies

### Production
- `@nestjs/common` - Core NestJS utilities
- `@nestjs/core` - NestJS framework
- `@nestjs/swagger` - Swagger/OpenAPI support
- `@nestjs/platform-express` - Express adapter
- `class-validator` - Input validation
- `class-transformer` - DTO transformation
- `swagger-ui-express` - Swagger UI
- `reflect-metadata` - Metadata reflection
- `rxjs` - Reactive programming

### Development
- `@nestjs/cli` - NestJS CLI
- `@nestjs/schematics` - Scaffolding tools
- `@nestjs/testing` - Testing utilities
- `typescript` - TypeScript compiler
- `eslint` - Code linting
- `prettier` - Code formatting
- `jest` - Testing framework

## 🔐 Security Considerations

Current implementation uses **mock JWT tokens** for demonstration. For production:

1. **Implement real JWT**
   ```bash
   npm install @nestjs/jwt @nestjs/passport passport passport-jwt
   ```

2. **Hash passwords**
   ```bash
   npm install bcrypt
   ```

3. **Database integration**
   ```bash
   npm install @nestjs/typeorm typeorm mongodb
   ```

4. **Add rate limiting**
   ```bash
   npm install @nestjs/throttler
   ```

## 📞 Support & Documentation

- **Swagger UI:** `http://localhost:3000/api/docs`
- **OpenAPI JSON:** `http://localhost:3000/api/docs-json`
- **NestJS Docs:** https://docs.nestjs.com
- **Swagger Docs:** https://swagger.io

## 📄 License

UNLICENSED

## 👥 Team

- Backend: Auth API implementation
- Frontend: Integration guide available in [FRONTEND_API_GUIDE.md](../FRONTEND_API_GUIDE.md)

---

**Last Updated:** 2024-01-01  
**Version:** 1.0.0
