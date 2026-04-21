import express, { Application, Request, Response } from "express";
import sequelize from "./config/db";
import './models';
import logger from "./utils/logger";
import { requestLogger } from "./middlewares/logMiddleware";
import errorHandler from "./middlewares/errorMiddleware";
import { getEnv } from "./config/env";

const app: Application = express();
const PORT = getEnv("PORT");

app.use(express.json());
app.use(requestLogger);

//Test Api
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("hello world");
});

app.use(errorHandler);

const serverStart = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database Connected Successfully.");
    await sequelize.sync();
    logger.info("Table Synced Successfully");
    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (err: any) {
    logger.error("Error starting server", { stack: err.stack });
  }
}
serverStart();