import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../config";
import { apiResponse, JWTPayload } from "../dto";
import { logger } from "../utils";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers["authorization"];
  const token = bearer?.split(" ")[1];

  if (!token) {
    logger.error(`Error attempt to login without header token`);
    return res
      .status(403)
      .send(apiResponse({ code: 403, errors: "No token provided!" }));
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      logger.error(`Unauthorized perform with token: ${token}`);
      return res
        .status(401)
        .send(apiResponse({ code: 401, errors: "Unauthorized" }));
    }
    req.userId = (decoded as JWTPayload).userId;
    next();
  });
};
