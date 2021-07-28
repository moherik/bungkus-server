import express from "express";
import { verifyToken } from "../middleware";

const orderRoute = express.Router();

orderRoute.get("/", verifyToken, async (req, res, _next) => {});

export { orderRoute };
