import express from "express";
import { apiResponse, SignInPayload } from "../dto";
import { AuthService } from "../services";
import { logger } from "../utils";

const authRoute = express.Router();
const service = new AuthService();

authRoute.post("/signin", async (req, res, _next) => {
  try {
    const payload = req.body as SignInPayload;
    const { userId, jwtToken } = await service.signIn(payload);

    logger.info(`User with id ${userId} is logged`);
    res.json(
      apiResponse({
        code: 200,
        data: {
          userId,
          jwtToken,
        },
      })
    );
  } catch (error) {
    logger.error(error);
    res.status(400).json(
      apiResponse({
        code: 400,
        errors: "Terjadi kesalahan",
      })
    );
  }
});

export { authRoute };
