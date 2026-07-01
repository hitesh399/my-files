# Project Idea
## Document Management System
### Features:
1. Upload document
1. View document list
1. Download document
1. Delete document
1. Store metadata
1. Process uploaded files
1. Cache document list
## Technology Stack
### Frontend
1. React
1. TypeScript
1. React Router
1. Redux Toolkit (global state)
1. React Context (component-level state)
1. Tailwind CSS (utility styling)
1. i18next + react-i18next (localization)
1. Vite
### Backend
1. NestJS
1. TypeScript
1. REST APIs
### Database
1. DynamoDB
### Storage
1. S3
### Cache
1. Redis (Local equivalent of ElastiCache)
### Serverless
1. AWS Lambda
### CI/CD
1. Concourse
### Containerization
1. Docker
### Deployment
1. ECS

## Frontend Architecture Decisions

1. Micro frontend split:
	- shell (host)
	- theme-mfe (global theme owner)
	- localization-mfe (global language owner)
	- auth-mfe (authentication)
	- documents-mfe (document domain)
2. State boundary:
	- Redux Toolkit for shared app/domain state
	- React Context for local/transient component concerns
3. Theming:
	- theme-mfe as source of truth for runtime theme
	- multi-theme support (`light`, `dark`, `sunset`) using CSS variables + Tailwind utilities
4. Localization:
	- localization-mfe as source of truth for runtime language
	- baseline locales: English (`en`) and Hindi (`hi`)
5. Cross-MFE runtime contract:
	- versioned browser event bus (`platform-context/v1`) for theme and locale sync