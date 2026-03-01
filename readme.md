# QuickHire - Job Portal Backend API

A RESTful backend API for a job portal application built with **Node.js**, **Express**, **TypeScript**, **Prisma**, and **PostgreSQL**. Only admins can register, login, and manage job listings. Anyone can browse jobs and submit applications.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Token)
- **Validation:** Zod
- **Password Hashing:** bcrypt

## Project Structure

```
src/
├── app/
│   ├── middlewares/
│   │   ├── auth.ts                 # JWT authentication & role authorization
│   │   ├── globalErrorHandler.ts   # Centralized error handling
│   │   └── validateRequest.ts      # Zod schema validation
│   ├── modules/
│   │   ├── auth/                   # Admin authentication
│   │   ├── jobs/                   # Job CRUD operations
│   │   └── applications/           # Job application submission
│   └── routes/
│       └── index.ts                # Route aggregator
├── config/
│   └── index.ts                    # Environment config
├── errors/
│   └── ApiError.ts                 # Custom error class
├── helpers/
│   ├── encryption.ts               # bcrypt password helpers
│   ├── jwtHelpers.ts               # JWT create/verify helpers
│   └── checkEmailFormateValidity.ts
├── shared/
│   ├── prisma.ts                   # Prisma client instance
│   ├── catchAsync.ts               # Async error wrapper
│   └── sendResponse.ts             # Standardized response
├── app.ts                          # Express app setup
└── server.ts                       # Server bootstrap
```

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL

### Installation

```bash
git clone <repo-url>
cd quickhire-qtech-backend
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:root@localhost:5432/quickhire?schema=public"
PORT=5000
BCRYPT_SALT_ROUNDS=12
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-jwt-refresh-secret
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
```

### Database Setup

```bash
npx prisma migrate dev
npx prisma generate
```

### Run the Server

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

Server runs at `http://localhost:5000`

---

## Database Schema

### User

| Field     | Type     | Description     |
| --------- | -------- | --------------- |
| id        | UUID     | Primary key     |
| name      | String   | Admin name      |
| email     | String   | Unique email    |
| password  | String   | Hashed password |
| role      | ROLE     | Always `ADMIN`  |
| createdAt | DateTime | Auto-generated  |
| updatedAt | DateTime | Auto-updated    |

### Job

| Field       | Type     | Description                          |
| ----------- | -------- | ------------------------------------ |
| id          | UUID     | Primary key                          |
| title       | String   | Job title                            |
| company     | String   | Company name                         |
| location    | LOCATION | Enum - Bangladesh 64 districts + Remote |
| category    | CATEGORY | Enum - Design, Sales, Marketing, etc |
| description | String   | Job description                      |
| createdAt   | DateTime | Auto-generated                       |

### Enums

**LOCATION** (Bangladesh 64 Districts + Remote):

```
Dhaka, Chittagong, Rajshahi, Khulna, Sylhet, Rangpur, Barishal, Mymensingh,
Comilla, Gazipur, Narayanganj, Tangail, Bogra, Dinajpur, Jessore, Cox_s_Bazar,
Brahmanbaria, Narsingdi, Savar, Tongi, Faridpur, Jamalpur, Pabna, Habiganj,
Moulvibazar, Sunamganj, Kushtia, Natore, Nawabganj, Rajbari, Sirajganj, Joypurhat,
Naogaon, Nilphamari, Kurigram, Lalmonirhat, Gaibandha, Thakurgaon, Panchagarh,
Sherpur, Netrokona, Kishoreganj, Narail, Satkhira, Bagerhat, Magura, Meherpur,
Chuadanga, Jhenaidah, Gopalganj, Madaripur, Shariatpur, Munshiganj, Manikganj,
Pirojpur, Barguna, Jhalokati, Bhola, Patuakhali, Chandpur, Lakshmipur, Noakhali,
Feni, Khagrachhari, Rangamati, Bandarban, Remote
```

**CATEGORY**:

```
Design, Sales, Marketing, Finance, Technology, Engineering, Business, Human_Resource
```

### Application

| Field      | Type     | Description        |
| ---------- | -------- | ------------------ |
| id         | UUID     | Primary key        |
| jobId      | UUID     | FK → Job           |
| name       | String   | Applicant name     |
| email      | String   | Applicant email    |
| resumeLink | String   | Resume URL         |
| coverNote  | String?  | Optional cover note|
| createdAt  | DateTime | Auto-generated     |

**Relationships:** Job → Applications (one-to-many, cascade delete)

---

## API Endpoints

**Base URL:** `http://localhost:5000/api/v1`

### Auth Routes

| Method | Endpoint                | Access | Description          |
| ------ | ----------------------- | ------ | -------------------- |
| POST   | `/auth/register`        | Public | Register admin       |
| POST   | `/auth/login`           | Public | Admin login          |
| GET    | `/auth/refresh-token`   | Public | Refresh access token |
| PATCH  | `/auth/change-password` | Admin  | Change password      |

### Job Routes

| Method | Endpoint    | Access | Description     |
| ------ | ----------- | ------ | --------------- |
| GET    | `/jobs`     | Public | List all jobs   |
| GET    | `/jobs/:id` | Public | Get job details |
| POST   | `/jobs`     | Admin  | Create a job    |
| DELETE | `/jobs/:id` | Admin  | Delete a job    |

### Application Routes

| Method | Endpoint        | Access | Description            |
| ------ | --------------- | ------ | ---------------------- |
| POST   | `/applications` | Public | Submit job application |

---

## Request & Response Examples

### 1. Register Admin

**POST** `/api/v1/auth/register`

**Request:**

```json
{
  "name": "Admin User",
  "email": "admin@quickhire.com",
  "password": "admin123"
}
```

**Response:** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Admin registered successfully",
  "data": {
    "id": "06928033-418d-4f3d-a41a-92e0f37f48a6",
    "role": "ADMIN",
    "name": "Admin User",
    "email": "admin@quickhire.com",
    "createdAt": "2026-03-01T05:47:20.289Z",
    "updatedAt": "2026-03-01T05:47:20.289Z"
  }
}
```

---

### 2. Admin Login

**POST** `/api/v1/auth/login`

**Request:**

```json
{
  "email": "admin@quickhire.com",
  "password": "admin123"
}
```

**Response:** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Login successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

> The `refreshToken` is set as an httpOnly cookie automatically.

---

### 3. Change Password

**PATCH** `/api/v1/auth/change-password`

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Request:**

```json
{
  "oldPassword": "admin123",
  "newPassword": "admin456"
}
```

**Response:** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Password changed successfully",
  "data": {
    "id": "06928033-418d-4f3d-a41a-92e0f37f48a6",
    "role": "ADMIN",
    "name": "Admin User",
    "email": "admin@quickhire.com",
    "createdAt": "2026-03-01T05:47:20.289Z",
    "updatedAt": "2026-03-01T05:48:51.424Z"
  }
}
```

---

### 4. Create Job (Admin)

**POST** `/api/v1/jobs`

**Headers:**

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request:**

```json
{
  "title": "Backend Developer",
  "company": "QTech",
  "location": "Dhaka",
  "category": "Engineering",
  "description": "Build REST APIs with Node.js"
}
```

> `location` must be a valid **LOCATION** enum value (e.g., Dhaka, Chittagong, Remote).
> `category` must be a valid **CATEGORY** enum value (e.g., Engineering, Design, Marketing, Finance, Technology, Sales, Business, Human_Resource).

**Response:** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Job created successfully",
  "data": {
    "id": "5e46b4f0-2793-46f1-b545-003932fc8bfb",
    "title": "Backend Developer",
    "company": "QTech",
    "location": "Dhaka",
    "category": "Engineering",
    "description": "Build REST APIs with Node.js",
    "createdAt": "2026-03-01T05:59:04.049Z"
  }
}
```

---

### 5. Get All Jobs (Search, Filter & Pagination)

**GET** `/api/v1/jobs`

#### Query Parameters

| Parameter  | Type     | Default   | Description                                                  |
| ---------- | -------- | --------- | ------------------------------------------------------------ |
| searchTerm | string   | -         | Search across title, company, description (case insensitive) |
| company    | string   | -         | Filter by exact company name                                 |
| location   | LOCATION | -         | Filter by enum value (e.g., Dhaka, Remote, Chittagong)       |
| category   | CATEGORY | -         | Filter by enum value (e.g., Engineering, Design, Marketing)  |
| page       | number   | 1         | Page number                                                  |
| limit      | number   | 10        | Items per page                                               |
| sortBy     | string   | createdAt | Sort field (title, company, location, category, createdAt)   |
| sortOrder  | string   | desc      | Sort direction (`asc` or `desc`)                             |

#### 5a. Default (No Query Params)

**GET** `/api/v1/jobs`

**Response:** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Jobs retrieved successfully",
  "meta": {
    "total": 7,
    "page": 1,
    "limit": 10
  },
  "data": [
    {
      "id": "5bf31463-24c4-4266-8f77-9fd62689f5b7",
      "title": "Node.js Developer",
      "company": "QTech",
      "location": "Dhaka",
      "category": "Engineering",
      "description": "Build scalable backend services with Node.js and Express",
      "createdAt": "2026-03-01T10:26:07.390Z"
    },
    {
      "id": "7cca81e4-9784-484e-b818-4fd1ba9ff63c",
      "title": "Data Analyst",
      "company": "QTech",
      "location": "Chittagong",
      "category": "Analytics",
      "description": "SQL and Python for data analysis",
      "createdAt": "2026-03-01T10:26:07.317Z"
    }
  ]
}
```

#### 5b. Search by Keyword

**GET** `/api/v1/jobs?searchTerm=developer`

Searches across **title, company, description** (partial match, case insensitive).

**Response:** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Jobs retrieved successfully",
  "meta": {
    "total": 4,
    "page": 1,
    "limit": 10
  },
  "data": [
    {
      "id": "5bf31463-24c4-4266-8f77-9fd62689f5b7",
      "title": "Node.js Developer",
      "company": "QTech",
      "location": "Dhaka",
      "category": "Engineering",
      "description": "Build scalable backend services with Node.js and Express",
      "createdAt": "2026-03-01T10:26:07.390Z"
    },
    {
      "id": "a1dcd4bb-7135-4440-ac91-8fd4f0f49589",
      "title": "Frontend Developer",
      "company": "TechCorp",
      "location": "Remote",
      "category": "Engineering",
      "description": "React and TypeScript expertise needed",
      "createdAt": "2026-03-01T10:26:07.108Z"
    },
    {
      "id": "5e46b4f0-2793-46f1-b545-003932fc8bfb",
      "title": "Backend Developer",
      "company": "QTech",
      "location": "Dhaka",
      "category": "Engineering",
      "description": "Build REST APIs with Node.js",
      "createdAt": "2026-03-01T05:59:04.049Z"
    }
  ]
}
```

#### 5c. Filter by Category

**GET** `/api/v1/jobs?category=Engineering`

Filters by **exact match** on category field.

**Response:** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Jobs retrieved successfully",
  "meta": {
    "total": 4,
    "page": 1,
    "limit": 10
  },
  "data": [
    {
      "id": "5bf31463-24c4-4266-8f77-9fd62689f5b7",
      "title": "Node.js Developer",
      "company": "QTech",
      "location": "Dhaka",
      "category": "Engineering",
      "description": "Build scalable backend services with Node.js and Express",
      "createdAt": "2026-03-01T10:26:07.390Z"
    },
    {
      "id": "8c478e29-9bb2-4881-a0d5-6a4b9c65a48e",
      "title": "DevOps Engineer",
      "company": "CloudNine",
      "location": "Remote",
      "category": "Engineering",
      "description": "AWS, Docker, Kubernetes experience",
      "createdAt": "2026-03-01T10:26:07.247Z"
    }
  ]
}
```

#### 5d. Filter by Location

**GET** `/api/v1/jobs?location=Remote`

**Response:** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Jobs retrieved successfully",
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 10
  },
  "data": [
    {
      "id": "8c478e29-9bb2-4881-a0d5-6a4b9c65a48e",
      "title": "DevOps Engineer",
      "company": "CloudNine",
      "location": "Remote",
      "category": "Engineering",
      "description": "AWS, Docker, Kubernetes experience",
      "createdAt": "2026-03-01T10:26:07.247Z"
    },
    {
      "id": "a1dcd4bb-7135-4440-ac91-8fd4f0f49589",
      "title": "Frontend Developer",
      "company": "TechCorp",
      "location": "Remote",
      "category": "Engineering",
      "description": "React and TypeScript expertise needed",
      "createdAt": "2026-03-01T10:26:07.108Z"
    }
  ]
}
```

#### 5e. Filter by Company

**GET** `/api/v1/jobs?company=QTech`

**Response:** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Jobs retrieved successfully",
  "meta": {
    "total": 3,
    "page": 1,
    "limit": 10
  },
  "data": [
    {
      "id": "5bf31463-24c4-4266-8f77-9fd62689f5b7",
      "title": "Node.js Developer",
      "company": "QTech",
      "location": "Dhaka",
      "category": "Engineering",
      "description": "Build scalable backend services with Node.js and Express",
      "createdAt": "2026-03-01T10:26:07.390Z"
    },
    {
      "id": "7cca81e4-9784-484e-b818-4fd1ba9ff63c",
      "title": "Data Analyst",
      "company": "QTech",
      "location": "Chittagong",
      "category": "Analytics",
      "description": "SQL and Python for data analysis",
      "createdAt": "2026-03-01T10:26:07.317Z"
    },
    {
      "id": "5e46b4f0-2793-46f1-b545-003932fc8bfb",
      "title": "Backend Developer",
      "company": "QTech",
      "location": "Dhaka",
      "category": "Engineering",
      "description": "Build REST APIs with Node.js",
      "createdAt": "2026-03-01T05:59:04.049Z"
    }
  ]
}
```

#### 5f. Pagination

**GET** `/api/v1/jobs?page=1&limit=2`

**Response:** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Jobs retrieved successfully",
  "meta": {
    "total": 7,
    "page": 1,
    "limit": 2
  },
  "data": [
    {
      "id": "5bf31463-24c4-4266-8f77-9fd62689f5b7",
      "title": "Node.js Developer",
      "company": "QTech",
      "location": "Dhaka",
      "category": "Engineering",
      "description": "Build scalable backend services with Node.js and Express",
      "createdAt": "2026-03-01T10:26:07.390Z"
    },
    {
      "id": "7cca81e4-9784-484e-b818-4fd1ba9ff63c",
      "title": "Data Analyst",
      "company": "QTech",
      "location": "Chittagong",
      "category": "Analytics",
      "description": "SQL and Python for data analysis",
      "createdAt": "2026-03-01T10:26:07.317Z"
    }
  ]
}
```

> Use `meta.total` to calculate total pages: `Math.ceil(total / limit)`

#### 5g. Sorting

**GET** `/api/v1/jobs?sortBy=title&sortOrder=asc`

**Response:** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Jobs retrieved successfully",
  "meta": {
    "total": 7,
    "page": 1,
    "limit": 10
  },
  "data": [
    {
      "id": "5e46b4f0-2793-46f1-b545-003932fc8bfb",
      "title": "Backend Developer",
      "company": "QTech",
      "location": "Dhaka",
      "category": "Engineering",
      "description": "Build REST APIs with Node.js",
      "createdAt": "2026-03-01T05:59:04.049Z"
    },
    {
      "id": "7cca81e4-9784-484e-b818-4fd1ba9ff63c",
      "title": "Data Analyst",
      "company": "QTech",
      "location": "Chittagong",
      "category": "Analytics",
      "description": "SQL and Python for data analysis",
      "createdAt": "2026-03-01T10:26:07.317Z"
    }
  ]
}
```

#### 5h. Combined (Search + Filter + Pagination)

**GET** `/api/v1/jobs?searchTerm=node&category=Engineering&page=1&limit=2`

Searches for "node" keyword **within** the Engineering category.

**Response:** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Jobs retrieved successfully",
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 2
  },
  "data": [
    {
      "id": "5bf31463-24c4-4266-8f77-9fd62689f5b7",
      "title": "Node.js Developer",
      "company": "QTech",
      "location": "Dhaka",
      "category": "Engineering",
      "description": "Build scalable backend services with Node.js and Express",
      "createdAt": "2026-03-01T10:26:07.390Z"
    },
    {
      "id": "5e46b4f0-2793-46f1-b545-003932fc8bfb",
      "title": "Backend Developer",
      "company": "QTech",
      "location": "Dhaka",
      "category": "Engineering",
      "description": "Build REST APIs with Node.js",
      "createdAt": "2026-03-01T05:59:04.049Z"
    }
  ]
}
```

---

### 6. Get Single Job

**GET** `/api/v1/jobs/:id`

**Response:** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Job retrieved successfully",
  "data": {
    "id": "5e46b4f0-2793-46f1-b545-003932fc8bfb",
    "title": "Backend Developer",
    "company": "QTech",
    "location": "Dhaka",
    "category": "Engineering",
    "description": "Build REST APIs with Node.js",
    "createdAt": "2026-03-01T05:59:04.049Z",
    "applications": [
      {
        "id": "deecd625-0fc5-489c-83d6-283f60bd05ca",
        "jobId": "5e46b4f0-2793-46f1-b545-003932fc8bfb",
        "name": "John Doe",
        "email": "john@example.com",
        "resumeLink": "https://resume.com/john",
        "coverNote": "I am interested in this role",
        "createdAt": "2026-03-01T06:00:00.006Z"
      }
    ]
  }
}
```

---

### 7. Delete Job (Admin)

**DELETE** `/api/v1/jobs/:id`

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response:** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Job deleted successfully",
  "data": {
    "id": "d3f87045-3d1f-42d1-bc47-7215b5a844ef",
    "title": "Frontend Developer",
    "company": "TechCorp",
    "location": "Remote",
    "category": "Engineering",
    "description": "React and TypeScript expertise needed",
    "createdAt": "2026-03-01T05:59:15.203Z"
  }
}
```

> Deleting a job also deletes all associated applications (cascade).

---

### 8. Submit Application

**POST** `/api/v1/applications`

**Request:**

```json
{
  "jobId": "5e46b4f0-2793-46f1-b545-003932fc8bfb",
  "name": "John Doe",
  "email": "john@example.com",
  "resumeLink": "https://resume.com/john",
  "coverNote": "I am interested in this role"
}
```

**Response:** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "id": "deecd625-0fc5-489c-83d6-283f60bd05ca",
    "jobId": "5e46b4f0-2793-46f1-b545-003932fc8bfb",
    "name": "John Doe",
    "email": "john@example.com",
    "resumeLink": "https://resume.com/john",
    "coverNote": "I am interested in this role",
    "createdAt": "2026-03-01T06:00:00.006Z",
    "job": {
      "id": "5e46b4f0-2793-46f1-b545-003932fc8bfb",
      "title": "Backend Developer",
      "company": "QTech",
      "location": "Dhaka",
      "category": "Engineering",
      "description": "Build REST APIs with Node.js",
      "createdAt": "2026-03-01T05:59:04.049Z"
    }
  }
}
```

---

## Error Responses

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "errorMessages": [
    {
      "path": "",
      "message": "Detailed error message"
    }
  ]
}
```

### Common Errors

| Status | Message                         | Scenario                       |
| ------ | ------------------------------- | ------------------------------ |
| 400    | Admin already exists with email | Duplicate registration         |
| 400    | Please provide a valid email    | Invalid email format           |
| 401    | You are not authorized          | Missing auth token             |
| 401    | Password is incorrect           | Wrong password on login        |
| 403    | Forbidden                       | Non-admin accessing admin route|
| 403    | Only admin can login            | Non-admin user tries to login  |
| 404    | Admin not found                 | Email not found on login       |
| 404    | Job not found                   | Invalid job ID                 |

---

## How the System Works

```
┌──────────────┐     ┌──────────────┐     ┌───────────────┐
│   Client     │────>│   Express    │────>│  PostgreSQL    │
│  (Postman/   │<────│   Server     │<────│  (Prisma ORM)  │
│   Frontend)  │     │  Port: 5000  │     │               │
└──────────────┘     └──────────────┘     └───────────────┘
```

### Request Flow

```
Request → Route → Middleware(s) → Controller → Service → Prisma → Database
                                                              ↓
Response ← Controller ← Service ← Prisma ← Database Result
```

1. **Request** hits an Express route
2. **Middleware** chain runs in order:
   - `validateRequest` — validates body/params with Zod schemas
   - `auth` — verifies JWT token and checks role (for protected routes)
3. **Controller** extracts data from request, calls the service
4. **Service** contains business logic, interacts with database via Prisma
5. **Response** is sent back using `sendResponse` for a consistent format
6. **Errors** are caught by `catchAsync` and handled by `globalErrorHandler`

### Authentication Flow

```
Register → password hashed with bcrypt → saved to DB with role ADMIN
Login    → verify email → verify password → generate JWT tokens
                                            ├── accessToken  (sent in response)
                                            └── refreshToken (set in httpOnly cookie)
Protected Route → read Authorization header → verify JWT → check role → proceed
```
