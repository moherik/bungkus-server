import { createConnection } from "typeorm";
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
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "new-bungkus",
    entities: [User, Merchant, MerchantCategory, Menu, MenuItem, Order, Cart],
    synchronize: true,
    logging: false,
  });
