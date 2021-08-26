import jwt from "jsonwebtoken";
import { getRepository } from "typeorm";

import { User } from "../entities";
import { SignInPayload } from "../dto";
import { JWT_SECRET } from "../config";

export class AuthService {
  userRepo = () => getRepository(User);

  async signIn(payload: SignInPayload) {
    const user = await this.userRepo().findOne({
      where: { phone: payload.phone },
    });

    let newUser;
    if (!user) {
      newUser = await this.userRepo().save(payload);
    } else {
      newUser = await this.userRepo().save({
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
      name: newUser.name || null,
      jwtToken: token,
    };
  }

  async get() {
    return this.userRepo().find();
  }
}
