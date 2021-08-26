import "reflect-metadata";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

import { router } from "./routes";
import { PORT } from "./constants";
import { connect } from "./config";

connect().then(() => {
  const app = express();

  app.use(express.json());

  app.use("/", router);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
