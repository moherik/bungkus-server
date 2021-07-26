import express from "express";
import { classToPlain } from "class-transformer";
import { verifyToken } from "../middleware";
import { UserService } from "../services";

const userRoute = express.Router();
const service = new UserService();

userRoute.get("/me", verifyToken, async (req, res, _next) => {
  const user = await service.me(Number(req.userId));
  res.json(classToPlain(user));
});

export { userRoute };
