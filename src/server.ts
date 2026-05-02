import express, { Application, Request, Response } from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import swaggerUi from "swagger-ui-express";

//Config Imports
import { getEnv } from "./config/env";
import sequelize from "./config/db";
import './models';
import { swaggerSpec } from "./config/swagger";

//Security Imports
import helmet from "helmet";
import cors from "cors";
import { authLimiter, globalLimiter, uploadLimiter } from "./config/rateLimit";

//Middlewares Imports
import logger from "./utils/logger";
import { requestLogger } from "./middlewares/logMiddleware";
import errorHandler from "./middlewares/errorMiddleware";

//Route Imports
import authRoutes from "./routes/authRoute";
import convRoutes from "./routes/convRoute";
import groupRoutes from "./routes/groupRoute";
import userRoutes from "./routes/userRoute";
import messageRoutes from "./routes/messageRoute";

//Socket Imports
import { initSocket } from "./sockets";

const app: Application = express();
const httpServer = createServer(app);

//Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin:getEnv("CLIENT_URL"),
    credentials:true
  })
);
app.use(globalLimiter);

//General Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

//Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: getEnv("CLIENT_URL"),
    credentials: true,
  }
});

app.set("io", io);
initSocket(io);

//Swagger Docs
app.use("/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: "SpyChat API Docs",
    swaggerOptions: {
      persistAuthorization: true,
    }
  })
);

//Route Middleware
app.use("/api/auth",authLimiter, authRoutes);
app.use("/api/conversations", convRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/users",userRoutes);
app.use("/api/messages",uploadLimiter,messageRoutes);

//Test Api
app.get("/", (req: Request, res: Response) => {
  res.send("SpyChat APP Is Working");
});

//Error Handler Middleware
app.use(errorHandler);

//Start Server
const serverStart = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database Connected Successfully.");

    await sequelize.sync();
    logger.info("Table Synced Successfully");

    const PORT = Number(getEnv("PORT"));
    httpServer.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
      logger.info("socket is ready for connection");
    });

  } catch (err: any) {
    logger.error("Error starting server", { stack: err.stack });
    process.exit(1);
  }
}
serverStart();