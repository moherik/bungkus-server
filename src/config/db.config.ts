import { createConnection } from "typeorm";
import { Merchant, User } from "../entities";

export const connect = () =>
  createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "new-bungkus",
    entities: [User, Merchant],
    synchronize: true,
    logging: false,
  });
