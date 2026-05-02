# SpyChat — Secure, Real-time Chat Application

![TypeScript](https://img.shields.io/badge/TypeScript-ES2023-blue?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-5.x-black?logo=express)
![Socket.IO](https://img.shields.io/badge/Realtime-Socket.IO-orange?logo=socketdotio)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange?logo=mysql)
![Sequelize](https://img.shields.io/badge/ORM-Sequelize-blue)
![Swagger](https://img.shields.io/badge/API-Docs%20(Swagger)-yellow?logo=swagger)
![Docker](https://img.shields.io/badge/Docker-optional-blue?logo=docker)
![License](https://img.shields.io/badge/License-ISC-lightgrey)

> SpyChat — a TypeScript-first, Socket.IO-based real-time chat backend with an HTTP API and Swagger documentation. Built for low-latency messaging, conversation persistence, and easy deployment.

---

## Table of Contents

- [Project Overview](#project-overview)
- [What’s Included](#whats-included)
- [Tech Stack](#tech-stack)
- [Architecture & Runtime](#architecture--runtime)
- [API & Socket Surface (extracted from repo)](#api--socket-surface-extracted-from-repo)
  - [HTTP Routes (exact)](#http-routes-exact)
  - [Swagger Docs](#swagger-docs)
  - [Socket.IO](#socketio)
- [Environment Variables (required by code)](#environment-variables-required-by-code)
- [Database](#database)
- [Project Structure (from repository)](#project-structure-from-repository)
- [NPM Scripts (exact from package.json)](#npm-scripts-exact-from-packagejson)
- [Development — Run Locally](#development---run-locally)
- [Testing & Quality](#testing--quality)
- [Contributing](#contributing)
- [License & Author](#license--author)
- [What I need to further refine / confirm](#what-i-need-to-further-refine--confirm)

---

## Project Overview

SpyChat provides the backend building blocks for a chat system:
- Real-time messaging powered by Socket.IO
- REST endpoints for auth, conversations, groups, users and messages
- Sequelize ORM + MySQL for persistence
- Swagger/OpenAPI documentation available at `/api-docs`
- Security and production-ready middleware (helmet, CORS, rate limiters, cookie parser)
- File upload support (multer / cloudinary integration present)

This README is generated from the repository files (server bootstrap, route definitions, config files and package.json) and reflects the code structure and exact route mount points.

---

## What’s Included

- HTTP API routes mounted under `/api/*`:
  - `/api/auth` — authentication
  - `/api/conversations` — create/list conversations and messages
  - `/api/groups` — group management & messages
  - `/api/users` — user endpoints
  - `/api/messages` — message endpoints (uploads limited by route)
- Socket.IO server initialized and attached to HTTP server (see `src/server.ts` and `src/sockets`)
- Swagger spec generation via `swagger-jsdoc` (configured to serve UI at `/api-docs`)
- Sequelize MySQL connection and model initialisation (`src/config/db.ts` and `src/models`)
- Rate limiters for global, auth and upload routes (imported in `server.ts`)

---

## Tech Stack

- Language: TypeScript (100% of repo)
- Runtime: Node.js (>=18)
- HTTP Framework: Express (v5)
- Realtime: Socket.IO (v4)
- ORM: Sequelize
- Database Driver: mysql2 (MySQL)
- Validation: zod
- Logging: winston
- File upload: multer, cloudinary (dependency present)
- API docs: swagger-jsdoc + swagger-ui-express
- Other: helmet, cors, express-rate-limit, cookie-parser, jsonwebtoken, ioredis

---

## Architecture & Runtime

- `src/server.ts` boots Express, attaches Socket.IO, registers routes and Swagger UI, connects to database and syncs models.
- Socket initialization is called via `initSocket(io)` from `src/sockets`.
- Sequelize connects using configuration in `src/config/db.ts` and models are initialized via `src/models` (imported in server bootstrap).
- Env variables are resolved with `getEnv` in `src/config/env.ts` and the project expects `.env.local` in development and `.env.production` in production.

---

## API & Socket Surface (extracted from repo)

### HTTP Routes (exact — extracted from route files)

All routes are mounted under `/api` per `src/server.ts`.

- Auth — mounted at `/api/auth` (`src/routes/authRoute.ts`)
  - POST `/api/auth/register` — uploadSingle('avatar') → register (validate using registerSchema)
  - POST `/api/auth/login` — login (validate using loginSchema)
  - POST `/api/auth/refresh` — refresh token
  - POST `/api/auth/logout` — logout
  - GET `/api/auth/me` — get current user (protected)

- Conversations — mounted at `/api/conversations` (`src/routes/convRoute.ts`)
  - POST `/api/conversations/` — start conversation (protected)
  - GET `/api/conversations/` — get my conversations (protected)
  - GET `/api/conversations/:id/messages` — get conversation messages (protected)

- Groups — mounted at `/api/groups` (`src/routes/groupRoute.ts`)
  - POST `/api/groups/` — create group (auth, uploadSingle("avatar"), validate createGroupSchema)
  - GET `/api/groups/` — get my groups (protected)
  - GET `/api/groups/:id` — get group details (protected)
  - POST `/api/groups/:groupId/members/:userId` — add member (protected)
  - DELETE `/api/groups/:groupId/members/:userId` — remove member (protected)
  - GET `/api/groups/:id/messages` — get group messages (protected)

- Users — mounted at `/api/users` (`src/routes/userRoute.ts`)
  - Endpoints defined in `src/routes/userRoute.ts` (route file present in repository)

- Messages — mounted at `/api/messages` (`src/routes/messageRoute.ts`)
  - Endpoints defined in `src/routes/messageRoute.ts` (route file present in repository). This route group uses `uploadLimiter`.

Notes:
- Auth middleware `auth` protects routes requiring authentication.
- Validation middleware `validateBody` uses zod schemas in `src/validations`.
- Uploads use `uploadSingle` middleware from `src/middlewares/uploadMiddleware`.
- Rate limiters: `authLimiter`, `globalLimiter`, `uploadLimiter`.

### Swagger Docs

- Swagger UI is served at `/api-docs` and configured with `swaggerSpec` from `src/config/swagger.ts`.
- The swagger options set server to `${APP_URL}/api` — ensure `APP_URL` env var is set.

### Socket.IO

- Socket.IO server is created and attached to HTTP server in `src/server.ts`.
- CORS origin for Socket.IO is set to `CLIENT_URL` (environment variable).
- `initSocket(io)` is invoked; socket handlers are defined in `src/sockets/*` (socket entrypoint exists).

---

## Environment Variables (required by code)

The code uses `getEnv(key)` and will throw if any required key is missing. The following keys are explicitly referenced in analyzed files:

- NODE_ENV — used to choose .env file
- APP_URL — used by Swagger as server URL (`${APP_URL}/api`)
- CLIENT_URL — used as allowed origin for CORS and Socket.IO
- PORT — port the server listens on
- DB_NAME — database name (Sequelize)
- DB_USER — DB username
- DB_PASSWORD — DB password
- DB_HOST — DB host
- DB_PORT — DB port (numeric)

Notes:
- `src/config/env.ts` loads `.env.production` when NODE_ENV === 'production', otherwise `.env.local`. Ensure your env files include the keys above.

---

## Database

- Sequelize is configured to use MySQL (dialect `'mysql'`) via `src/config/db.ts`.
- Models are registered by importing `src/models` from `src/server.ts`. Use `sequelize.sync()` (called on startup) or migrations if added later.

---

## Project Structure (observed)

```
.
├── .env.example
├── package.json
├── package-lock.json
├── tsconfig.json
├── socket_io_plan.md
└── src/
    ├── Controllers/
    ├── config/
    │   ├── db.ts
    │   ├── env.ts
    │   └── swagger.ts
    ├── docs/
    ├── middlewares/
    ├── models/
    ├── routes/
    │   ├── authRoute.ts
    │   ├── convRoute.ts
    │   ├── groupRoute.ts
    │   ├── messageRoute.ts
    │   └── userRoute.ts
    ├── services/
    ├── sockets/
    ├── types/
    ├── utils/
    ├── validations/
    └── server.ts
```

---

## NPM Scripts (exact from package.json)

- test: "echo \"Error: no test specified\" && exit 1"
- build: "tsc"
- start: "node dist/server.js"
- dev: "cross-env NODE_ENV=development nodemon dist/server.js"
- prod: "cross-env NODE_ENV=production nodemon dist/server.js"

Notes:
- Ensure you run `npm run build` to generate `dist/` before `npm run dev` / `npm start` unless you have a separate TS watch setup.

---

## Development — Run Locally

1. Clone
   ```bash
   git clone https://github.com/abhii47/SpyChat.git
   cd SpyChat
   ```

2. Install
   ```bash
   npm install
   ```

3. Create env file
   - Add `.env.local` for development (or `.env.production` for production).
   - Ensure the environment variables listed in [Environment Variables](#environment-variables-required-by-code) are set.

4. Build
   ```bash
   npm run build
   ```

5. Run
   ```bash
   npm run dev
   ```
   - Server starts and listens on `PORT`.
   - Swagger UI available at `http://localhost:{PORT}/api-docs` (APP_URL must point to local host or be configured accordingly).
   - Root GET `/` responds with: `SpyChat APP Is Working`.

---

## Testing & Quality

- No test framework configured in package.json beyond a placeholder.
- Type checking via `tsc`.
- Add Jest / Supertest for unit and integration tests and ESLint/Prettier for linting and formatting if desired.

---

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Make changes, add tests and update Swagger docs where appropriate
4. Commit with conventional commits (optional)
5. Open a PR with a clear description and related issues

---

## License & Author

- License (per package.json): ISC
- Author: repository owner (GitHub: abhii47)

---

## What I need to further refine / confirm

To make the README and API docs 100% exact (models, full endpoint lists, request/response examples), please either:

- Allow me to read these files next: `src/routes/messageRoute.ts`, `src/routes/userRoute.ts`, `src/models/*`, `src/Controllers/*` — I will extract model fields and all endpoints; or
- Paste the contents of the files above and I will update the README accordingly.

I can also:
- Add a ready-to-use `.env.local.example` template,
- Add example Postman collection or curl examples for each endpoint,
- Generate model schemas in Markdown from your Sequelize models,
- Add Docker and CI guidance if you want.

---

Thank you — this README reflects the code paths and configuration entries discovered in the repository. If you want the README committed to the repo, tell me and I will create a README.md in a new commit.
```
