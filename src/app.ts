import "reflect-metadata";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

import { router } from "./routes";
import { PORT } from "./constants";
import { AppDataSource } from "./config";

AppDataSource.initialize().then(() => {
  const app = express();

  app.use(express.json());

  app.use("/", router);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
