# Hospital REST API

A robust REST API built with Express.js and Prisma ORM for managing a hospital system. Handles users, patients, doctors, appointments, and medical records.

## Features

- **User Management**: Authentication with JWT, role-based access (Admin, Doctor, Patient, User)
- **Patient Records**: Complete patient profiles with medical history
- **Doctor Management**: Doctor specialization and license tracking
- **Appointments**: Scheduling system with status tracking
- **Medical Records**: Diagnosis, treatment, and prescription management

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.x
- **ORM**: Prisma (PostgreSQL)
- **Authentication**: JWT + bcrypt
- **Security**: Helmet, CORS
- **Testing**: Jest + Supertest

## Project Structure

```
src/
├── controllers/      # Request handlers
├── routes/           # API route definitions
├── services/         # Business logic
├── middlewares/      # Express middlewares
├── validators/       # Request validation
├── utils/           # Utilities (Prisma client, errors)
└── app.js           # Express app setup
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Docker (optional)

### Installation

```bash
# Install dependencies
yarn install

# Generate Prisma client
yarn db:generate

# Setup database
docker-compose up -d  # Start PostgreSQL
yarn db:push           # Push schema to database
yarn db:seed          # Seed database (optional)
```

### Configuration

Create a `.env` file based on `.env.example`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/hospital
JWT_SECRET=your-secret-key
BCRYPT_SALT_ROUNDS=10
JWT_EXPIRATION=1h
PORT=3000
NODE_ENV=development
```

### Running

```bash
# Development
yarn dev

# Production
yarn start

# Tests
yarn test
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/db-users` | Create user |
| POST | `/db-users/login` | Login |
| GET | `/db-users` | List users (admin) |
| GET | `/db-users/:id` | Get user by ID |
| PUT | `/db-users/:id` | Update user |
| DELETE | `/db-users/:id` | Delete user |
| PUT | `/db-users/:id/password` | Change password |

## Architecture

- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic and database operations
- **Routes**: API route definitions
- **Middlewares**: Logging, security, error handling
- **Validators**: Request validation
- **Error Helpers**: Custom error classes

## License

MIT
