import { getRepository } from "typeorm";
import { User } from "../entities";

const repository = () => getRepository(User);

export class UserService {
  async getAll() {
    return repository().find();
  }

  async getById(id: number) {
    return await repository().findOne({ id });
  }

  async getByIdOrFail(id: number) {
    return await repository().findOneOrFail({ id });
  }

  async me(userId: number) {
    return await repository().findOne({ id: userId });
  }
}
