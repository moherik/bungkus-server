import { createConnection } from "typeorm";
import {
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
} from "../constants";
import {
  Cart,
  Menu,
  MenuItem,
  Merchant,
  MerchantCategory,
  Order,
  User,
} from "../entities";

export const connect = () =>
  createConnection({
    type: "postgres",
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    entities: [User, Merchant, MerchantCategory, Menu, MenuItem, Order, Cart],
    synchronize: true,
    logging: false,
  });
