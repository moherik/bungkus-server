import { getRepository, In } from "typeorm";
import { Merchant, User } from "../entities";

const repository = () => getRepository(User);
const merchantRepo = () => getRepository(Merchant);

export class UserService {
  async getById({
    userId,
    targetUserId,
  }: {
    userId: number;
    targetUserId: number;
  }) {
    await repository().findOneOrFail({ id: userId });
    return repository()
      .createQueryBuilder("user")
      .loadRelationCountAndMap("user.totalFollowing", "user.following")
      .loadRelationCountAndMap("user.totalFollowers", "user.followers")
      .where("user.id = :id", { id: targetUserId })
      .getOneOrFail();
  }

  async getByIdOrFail(id: number) {
    return repository().findOneOrFail({ id });
  }

  async me(userId: number) {
    return repository()
      .createQueryBuilder("user")
      .loadRelationCountAndMap("user.totalFollowing", "user.following")
      .loadRelationCountAndMap("user.totalFollowers", "user.followers")
      .loadAllRelationIds({ relations: ["favorites"] })
      .where("user.id = :userId", { userId })
      .getOne();
  }

  async updateName({ userId, name }: { userId: number; name: string }) {
    const user = await repository().findOneOrFail({ id: userId });
    user.name = name;
    return repository().save(user);
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
    return repository().save(user);
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

  async favorites({ userId }: { userId: number }) {
    const user = await repository()
      .createQueryBuilder("user")
      .loadAllRelationIds({ relations: ["favorites"] })
      .where("user.id = :userId", { userId })
      .getOneOrFail();

    return merchantRepo().find({ where: { id: In(user.favorites) } });
  }

  async addToFavorite({
    userId,
    merchantId,
  }: {
    userId: number;
    merchantId: number;
  }) {
    const user = await repository().findOneOrFail(userId, {
      relations: ["favorites"],
    });
    const merchant = await merchantRepo().findOneOrFail(merchantId);

    const isFav = await repository()
      .createQueryBuilder("user")
      .leftJoin("user.favorites", "fav")
      .where("user.id = :userId", { userId })
      .andWhere("fav.id = :merchantId", { merchantId })
      .getCount();

    if (!isFav) {
      user.favorites = [merchant, ...user.favorites];
    } else {
      user.favorites = user.favorites.filter((fav) => fav.id !== merchantId);
    }
    await repository().save(user);
  }
}
