import "reflect-metadata";
import express from "express";

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
