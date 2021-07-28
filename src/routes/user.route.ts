import express from "express";
import { classToPlain } from "class-transformer";
import { verifyToken } from "../middleware";
import { UserService } from "../services";
import { apiResponse } from "../dto";
import { logger } from "../utils";

const userRoute = express.Router();
const service = new UserService();

userRoute.get("/me", verifyToken, async (req, res, _next) => {
  const user = await service.me(Number(req.userId));
  res.json(apiResponse({ code: 200, data: classToPlain(user) }));
});

userRoute.get("/:targetUserId", verifyToken, async (req, res, _next) => {
  const { targetUserId } = req.params;
  try {
    const user = await service.getById({
      userId: Number(req.userId),
      targetUserId: Number(targetUserId),
    });
    res.json(apiResponse({ code: 200, data: classToPlain(user) }));
  } catch (error) {
    logger.error(
      `Get user by id from userId: ${req.userId} target to targetUserId: ${targetUserId} with error: ${error}`
    );
    res.status(400).json(apiResponse({ code: 400, errors: "Error" }));
  }
});

userRoute.patch("/update-name", verifyToken, async (req, res, _next) => {
  const { name } = req.body;
  const user = await service.updateName({ userId: Number(req.userId), name });
  res.json(apiResponse({ code: 200, data: classToPlain(user) }));
});

userRoute.post("/follows/:userId", verifyToken, async (req, res, _next) => {
  const { userId } = req.params;
  try {
    await service.followUser({
      userId: Number(req.userId),
      followUserId: Number(userId),
    });
    res.json(apiResponse({ code: 200, data: "Success" }));
  } catch (error) {
    logger.error(
      `Perform user with userId: ${req.userId} follow to userId: ${userId} with error: ${error}`
    );
    res.status(400).json(apiResponse({ code: 400, data: "Error" }));
  }
});

export { userRoute };
