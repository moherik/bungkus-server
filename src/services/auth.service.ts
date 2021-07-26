import { getRepository } from "typeorm";
import jwt from "jsonwebtoken";

import { User } from "../entities";
import { SignInPayload } from "../dto";
import { JWT_SECRET } from "../config";

const userRepo = () => getRepository(User);

export class AuthService {
  async signIn(payload: SignInPayload) {
    const user = await userRepo().findOne({
      where: { token: payload.token },
    });

    let newUser;
    if (!user) {
      newUser = await userRepo().save(payload);
    } else {
      newUser = await userRepo().save({
        ...user,
        token: payload.token,
        tokenUpdatedAt: new Date(),
      });
    }
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
      expiresIn: 86400,
    });

    return {
      userId: newUser.id,
      jwtToken: token,
    };
  }

  async get() {
    return userRepo().find();
  }
}
