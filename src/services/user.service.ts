import { getRepository } from "typeorm";
import { User } from "../entities";

const repository = () => getRepository(User);

export class UserService {
  async getById({
    userId,
    targetUserId,
  }: {
    userId: number;
    targetUserId: number;
  }) {
    await repository().findOneOrFail({ id: userId });
    return await repository()
      .createQueryBuilder("user")
      .loadRelationCountAndMap("user.totalFollowing", "user.following")
      .loadRelationCountAndMap("user.totalFollowers", "user.followers")
      .where("user.id = :id", { id: targetUserId })
      .getOneOrFail();
  }

  async getByIdOrFail(id: number) {
    return await repository().findOneOrFail({ id });
  }

  async me(userId: number) {
    return await repository()
      .createQueryBuilder("user")
      .loadRelationCountAndMap("user.totalFollowing", "user.following")
      .loadRelationCountAndMap("user.totalFollowers", "user.followers")
      .where("user.id = :userId", { userId })
      .getOne();
  }

  async updateName({ userId, name }: { userId: number; name: string }) {
    const user = await repository().findOneOrFail({ id: userId });
    user.name = name;
    return await repository().save(user);
  }

  async updateAvatar({
    userId,
    imageUrl,
  }: {
    userId: number;
    imageUrl: string;
  }) {
    const user = await repository().findOneOrFail({ id: userId });
    user.avatarUrl = imageUrl;
    return await repository().save(user);
  }

  async followUser({
    userId,
    followUserId,
  }: {
    userId: number;
    followUserId: number;
  }) {
    const user = await repository().findOneOrFail({
      where: { id: userId },
      relations: ["following", "followers"],
    });
    const followUser = await repository().findOneOrFail({ id: followUserId });
    const isFollowing = await repository()
      .createQueryBuilder("user")
      .leftJoin("user.following", "f")
      .where("user.id = :userId", { userId })
      .andWhere("f.id = :targetId", { targetId: followUserId })
      .getCount();

    if (!isFollowing) {
      user.following = [followUser, ...user.following];
    } else {
      user.following = user.following.filter(
        (follow) => follow.id !== followUserId
      );
    }

    await repository().save(user);
  }
}
