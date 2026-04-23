import express, { Application, Request, Response } from "express";
import sequelize from "./config/db";
import './models';
import logger from "./utils/logger";
import { requestLogger } from "./middlewares/logMiddleware";
import errorHandler from "./middlewares/errorMiddleware";
import { getEnv } from "./config/env";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { initSocket } from "./sockets";

const app: Application = express();
const httpServer = createServer(app);
const io = new Server(httpServer,{
  cors:{
    origin: getEnv("APP_URL"),
    credentials:true,
  }
});
app.set("io",io);


//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

//Route Imports
import authRoutes from "./routes/authRoute";

//Route Middleware
app.use("/api/auth", authRoutes);

//Test Api
app.get("/api", (req: Request, res: Response) => {
  res.status(200).send("hello world");
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

    //Basic Socket connection testing
    initSocket(io);
    
  } catch (err: any) {
    logger.error("Error starting server", { stack: err.stack });
  }
}
serverStart();