# Personal Task Tracker (Full-Stack)

Full-stack task tracker with React frontend, Express backend, MySQL/MariaDB, and JWT authentication.

## Project Structure

```
personal-task-tracker/
├── frontend/          # React + TypeScript + Tailwind CSS (Vite)
├── backend/           # Node.js + Express + TypeScript
│   └── database/
│       └── schema.sql # MySQL schema
├── package.json       # Root scripts (run both apps)
└── README.md
```

## Prerequisites

- **Node.js** 18+
- **MySQL** or **MariaDB** 10.4+

## Local Setup

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure database

Create the database and tables:

```bash
mysql -u root -p < backend/database/schema.sql
```

Or open MySQL client and run the contents of `backend/database/schema.sql`.

### 3. Configure backend environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=task_tracker
JWT_SECRET=your_long_random_secret_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### 4. Run the application

**Both frontend and backend:**

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

**Separately:**

```bash
npm run dev:backend   # API on :3001
npm run dev:frontend  # UI on :5173
```

### 5. Build for production

```bash
npm run build
npm run start         # starts backend only
```

Serve `frontend/dist` with any static file server (nginx, etc.) and point `/api` to the backend.

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register (username, email, password) |
| POST | `/api/auth/login` | Login (email, password) → JWT |
| POST | `/api/auth/logout` | Logout (requires JWT) |
| GET | `/api/auth/me` | Current user (requires JWT) |

### Tasks (all require `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List user's tasks |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

## Tech Stack

**Frontend:** React, TypeScript, Tailwind CSS, Vite, React Router

**Backend:** Node.js, Express, TypeScript, JWT, bcrypt, mysql2, dotenv

**Database:** MySQL / MariaDB
