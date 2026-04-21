import express, { Application, Request, Response } from "express";
import sequelize from "./config/db";
import './models';
import logger from "./utils/logger";
import { requestLogger } from "./middlewares/logMiddleware";
import errorHandler from "./middlewares/errorMiddleware";
import { getEnv } from "./config/env";

const app: Application = express();

//Middlewares
app.use(express.json());
app.use(requestLogger);

//Route Imports
import authRoutes from "./routes/authRoute";

//Route Middleware
app.use("/api/auth", authRoutes);

//Test Api
app.get("/", (req: Request, res: Response) => {
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
    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (err: any) {
    logger.error("Error starting server", { stack: err.stack });
  }
}
serverStart();