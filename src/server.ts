import express, { Application, Request, Response } from "express";
import sequelize from "./config/db";
import './models';

const app: Application = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

//Test Api
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("hello world");
});

const serverStart = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database Connected Successfully.");
    await sequelize.sync();
    console.log("Table Synced Successfully");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err:any) {
    console.error("Error starting server:", err.message);
  }
}
serverStart();