# 💬 SpyChat — Secure, Real-time Chat Application

![TypeScript](https://img.shields.io/badge/TypeScript-ES2023-blue?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-5.x-black?logo=express)
![MySQL](https://img.shields.io/badge/MySQL-8+-orange?logo=mysql)
![Sequelize](https://img.shields.io/badge/ORM-Sequelize-blue)
![Socket.IO](https://img.shields.io/badge/Realtime-Socket.IO-orange?logo=socketdotio)
![Swagger](https://img.shields.io/badge/API-Docs-Swagger-yellow?logo=swagger)
![Redis](https://img.shields.io/badge/Queue-ioredis-red?logo=redis)

---

## 🚀 Project Overview

**SpyChat** is a robust, real-time chat backend REST API and WebSocket server built with **Node.js + TypeScript**. It features real-time messaging using Socket.IO, secure user authentication, private and group conversations, file uploads via Cloudinary, and comprehensive API documentation using Swagger. Designed for low-latency messaging and scalable conversation persistence.

---

## 🧰 Tech Stack

| Category       | Tech                              |
| -------------- | --------------------------------- |
| 🧠 Language    | TypeScript (ES2023)               |
| ⚙️ Runtime     | Node.js 18+                       |
| 🚀 Framework   | Express.js 5                      |
| 🗄️ Database   | MySQL + Sequelize ORM             |
| ⚡ Real-time   | Socket.IO (v4)                    |
| 🔐 Auth        | JWT (Access Token + Refresh Token)|
| ☁️ Storage     | Cloudinary (via Multer)           |
| 📜 Logging     | Winston (Daily Rotate File)       |
| 📝 Validation  | Zod                               |
| 📖 API Docs    | Swagger (swagger-jsdoc + ui)      |
| 🛡️ Security    | Helmet, CORS, Express Rate Limit  |
| 🗃️ Caching     | Redis (ioredis)                   |

---

## 📂 Project Structure

```
SpyChat/
├── src/
│   ├── config/        ⚙️  db.ts, env.ts, swagger.ts
│   ├── Controllers/   🎯  authController, convController, groupController, messageController, userController
│   ├── middlewares/   🛡️  authMiddleware, uploadMiddleware, validateMiddleware
│   ├── models/        🗄️  Sequelize models for Users, Messages, Groups, etc.
│   ├── routes/        🌐  authRoute, convRoute, groupRoute, messageRoute, userRoute
│   ├── services/      🧠  Business logic layer
│   ├── sockets/       🔌  Socket.IO connection handlers and events
│   ├── types/         📝  Custom TypeScript types
│   ├── utils/         🔧  Utilities and helpers
│   ├── validations/   ✅  Zod validation schemas
│   └── server.ts      🚀  App entry point
├── .env.example
├── .env.local
├── .env.production
├── package.json
└── tsconfig.json
```

---

## 🎯 API Endpoints

### 🔐 Auth — `/api/auth`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register a new user (with avatar upload) |
| POST | `/login` | Public | Login & get tokens |
| POST | `/refresh` | Public | Refresh access token |
| POST | `/logout` | Auth | Logout & clear session |
| GET | `/me` | Auth | Get current authenticated user details |

### 👤 Users — `/api/users`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/search` | Auth | Search users by name/username |
| PUT | `/update` | Auth | Update user profile (with avatar upload) |
| GET | `/:id` | Auth | Get specific user profile |

### 💬 Conversations (1-on-1) — `/api/conversations`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Auth | Start a new conversation with a user |
| GET | `/` | Auth | Get all my active conversations |
| GET | `/:id/messages`| Auth | Get paginated messages for a conversation |

### 👥 Groups — `/api/groups`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Auth | Create a group (with avatar upload) |
| GET | `/` | Auth | Get my groups |
| GET | `/:id` | Auth | Get group details |
| POST | `/:groupId/members/:userId`| Auth | Add a member to the group |
| DELETE | `/:groupId/members/:userId`| Auth | Remove a member from the group |
| GET | `/:id/messages`| Auth | Get messages for a specific group |

### 📁 Messages — `/api/messages`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/upload` | Auth | Upload media files for messages (Multiple files) |

---

## 🔌 Socket.IO Events

Real-time capabilities are handled via WebSocket connections established with the server.

| Namespace | Event | Direction | Description |
|-----------|-------|-----------|-------------|
| `/` | `connection` | Client → Server | Establish socket connection |
| `/` | `sendMessage` | Client → Server | Send a new message to a chat |
| `/` | `newMessage` | Server → Client | Broadcast new message to recipient(s) |
| `/` | `typing` | Client ↔ Server | Indicate user is typing |

> Note: CORS Origin is secured to match the `CLIENT_URL` environment variable.

---

## 📡 API Response Format

Standard success response:
```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

Error response:
```json
{
  "success": false,
  "message": "Error description",
  "error": {}
}
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` (for development) or `.env.production` (for production) and configure the following:

```dotenv
# Application
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000
CLIENT_URL=http://localhost:5173

# MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=spychat

# JWT Secrets
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis (optional/if used)
REDIS_URL=redis://localhost:6379
```

> ⚠️ Never commit `.env` files. They are listed in `.gitignore`.

---

## 📦 Installation (Local Development)

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 18+ |
| npm | 9+ |
| MySQL | 8+ |

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/abhii47/SpyChat.git
cd SpyChat

# 2. Install dependencies
npm install

# 3. Configure environment
#    Create .env.local and fill in your DB, JWT, and Cloudinary credentials

# 4. Start the development server
npm run dev
```

> The API will be available at **`http://localhost:3000/api`**

> Swagger API Docs available at **`http://localhost:3000/api-docs`**

---

## 🌱 Database Synchronization

The project uses `Sequelize.sync()` during server startup to automatically create tables based on your defined models. Make sure your MySQL server is running and the database specified in `.env.local` is created before starting the server.

---

## 🛡️ Security

| Feature | Details |
|---------|---------|
| **Rate Limiting** | Global limiters, plus specific limiters for Auth & Upload routes. |
| **Input Validation** | `Zod` schemas strictly validate incoming request bodies. |
| **JWT Auth** | Secured endpoints using Bearer token authentication. |
| **File Validation** | Uploads managed via Multer with file type/size validation for Cloudinary. |
| **HTTP Headers** | Secured via `helmet` and `cors`. |

---

## 📜 NPM Scripts

| Script | What it does |
|--------|--------------|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled server (`node dist/server.js`) |
| `npm run dev` | Run server in development mode using `nodemon` |
| `npm run prod`| Run server in production mode using `nodemon` |

---

## 🏗️ Architecture

```
HTTP Request / WebSocket
    ↓
Rate Limiter → Helmet → CORS → Cookie Parser
    ↓
Router (HTTP) / Socket Handlers (WS)
    ↓
Auth Middleware → Validation Middleware (Zod)
    ↓
Controller (thin — calls service)
    ↓
Service (business logic)
    ↓
Sequelize Model → MySQL DB
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit using conventional commits: `git commit -m "feat: add my feature"`
4. Push and open a Pull Request

---

## 👨‍💻 Author

**Abhishek Rajpurohit** (GitHub: abhii47)

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub and share it with others!
