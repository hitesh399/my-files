# Cloud-Native Full-Stack POC Roadmap

## Objective

Build an end-to-end cloud-native application to gain hands-on experience with:

- Technical Leadership
- Full-Stack Development
- AWS Services
- CI/CD
- Containerization
- Deployment Lifecycle

The primary goal is to understand the complete development lifecycle from requirement gathering to production deployment.

---

# Target Architecture

```text
                +----------------+
                |   React App    |
                +--------+-------+
                         |
                         v
                +----------------+
                |   NestJS API   |
                +--------+-------+
                         |
          +--------------+--------------+
          |                             |
          v                             v
 +----------------+           +----------------+
 |   DynamoDB     |           |     Redis      |
 | (Metadata)     |           |    (Cache)     |
 +----------------+           +----------------+
          |
          v
 +----------------+
 |       S3       |
 | File Storage   |
 +--------+-------+
          |
          v
 +----------------+
 |    Lambda      |
 | File Processing|
 +----------------+

CI/CD: Concourse
Deployment: Docker → ECS



