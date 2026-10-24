# Student CRUD API

A basic student CRUD REST API for the IoT API Lab, built with **Hono**, **Bun**, **TypeScript**, **Drizzle ORM** and **PostgreSQL (Neon)**.

Each student has: `studentId`, `firstName`, `lastName`, `dateOfBirth`, `gender`.

## Requirements

- [Bun](https://bun.sh) installed
- A [Neon](https://neon.tech) PostgreSQL database

## Install

```sh
cd Week05
bun install
```

## Environment variables

Copy the example file and fill in your values:

```sh
cp .env.example .env
```

```env
DATABASE_URL=your_neondb_url
SECRET_PASSWORD=your_secret_password
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon connection string, e.g. `postgresql://user:password@ep-xxxx.neon.tech/neondb?sslmode=require` |
| `SECRET_PASSWORD` | Token clients must send to use the API |

## Create the database table

```sh
bunx --bun drizzle-kit push
```

## Run

```sh
bun run dev
```

The server starts at http://localhost:3000 and reloads when you edit the code.

## Authentication

All `/api/*` routes require a bearer token equal to `SECRET_PASSWORD`:

```
Authorization: Bearer your_secret_password
```

A missing or wrong token returns `401 Unauthorized`. The health check `/` needs no token.

## Data model

| Field | Type | Rules |
|---|---|---|
| `studentId` | string | Primary key, unique, exactly 8 chars |
| `firstName` | string | 1-50 chars |
| `lastName` | string | 1-50 chars |
| `dateOfBirth` | string | Valid date, format `YYYY-MM-DD` |
| `gender` | string | `male` or `female` |

## Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check (no auth) |
| GET | `/api/v1/students` | List all students (sorted by `studentId`) |
| GET | `/api/v1/students/:studentId` | Get one student |
| POST | `/api/v1/students` | Create a student |
| PUT | `/api/v1/students/:studentId` | Update a student (partial fields allowed) |
| DELETE | `/api/v1/students/:studentId` | Delete a student |

All responses are pretty-printed JSON.

## Examples

Replace `your_secret_password` with your `SECRET_PASSWORD`.

### Health check

Input:

```sh
curl http://localhost:3000/
```

Output `200 OK`:

```json
{
    "message": "Student API is running"
}
```

### Create a student

Input:

```sh
curl -X POST http://localhost:3000/api/v1/students -H "Authorization: Bearer your_secret_password" -H "Content-Type: application/json" -d '{"studentId":"67079999","firstName":"John","lastName":"Doe","dateOfBirth":"2002-05-14","gender":"male"}'
```

Output `201 Created`:

```json
{
    "message": "Student created",
    "student": {
        "studentId": "67079999",
        "firstName": "John",
        "lastName": "Doe",
        "dateOfBirth": "2002-05-14",
        "gender": "male"
    }
}
```

### List all students

Input:

```sh
curl http://localhost:3000/api/v1/students -H "Authorization: Bearer your_secret_password"
```

Output `200 OK`:

```json
[
    {
        "studentId": "67079999",
        "firstName": "John",
        "lastName": "Doe",
        "dateOfBirth": "2002-05-14",
        "gender": "male"
    }
]
```

### Get one student

Input:

```sh
curl http://localhost:3000/api/v1/students/67079999 -H "Authorization: Bearer your_secret_password"
```

Output `200 OK`:

```json
{
    "studentId": "67079999",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "2002-05-14",
    "gender": "male"
}
```

### Update a student

Send only the fields you want to change.

Input:

```sh
curl -X PUT http://localhost:3000/api/v1/students/67079999 -H "Authorization: Bearer your_secret_password" -H "Content-Type: application/json" -d '{"firstName":"Johnny"}'
```

Output `200 OK`:

```json
{
    "message": "Student updated",
    "student": {
        "studentId": "67079999",
        "firstName": "Johnny",
        "lastName": "Doe",
        "dateOfBirth": "2002-05-14",
        "gender": "male"
    }
}
```

### Delete a student

Input:

```sh
curl -X DELETE http://localhost:3000/api/v1/students/67079999 -H "Authorization: Bearer your_secret_password"
```

Output `200 OK`:

```json
{
    "message": "Student deleted",
    "student": {
        "studentId": "67079999",
        "firstName": "Johnny",
        "lastName": "Doe",
        "dateOfBirth": "2002-05-14",
        "gender": "male"
    }
}
```

## Error responses

| Status | When | Body |
|---|---|---|
| 400 | Invalid input (impossible date, wrong gender, `studentId` not exactly 8 chars, name over 50 chars) | Validation error details |
| 400 | PUT with an empty body | `{ "error": "No fields to update" }` |
| 401 | Missing or wrong bearer token | `Unauthorized` |
| 404 | Student not found | `{ "error": "Student not found" }` |
| 404 | Unknown route | `{ "error": "Not found" }` |
| 409 | `studentId` already exists (create or update) | `{ "error": "studentId already exists" }` |
| 500 | Unexpected server error | `{ "error": "Internal server error" }` |

## Project structure

```
Week05/
├── src/
│   ├── index.ts              # App entry, pretty JSON, routes, error handlers
│   ├── db/
│   │   ├── index.ts          # Database connection (pg + Drizzle)
│   │   └── schema.ts         # students table
│   ├── middleware/
│   │   └── auth.ts           # Bearer token auth
│   └── routes/
│       └── students.ts       # CRUD routes with validation
├── drizzle.config.ts         # Drizzle Kit config
├── .env.example              # Environment variable template
└── package.json
```
