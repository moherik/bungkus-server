import { In } from "typeorm";

import { AppDataSource } from "../config/db.config";
import { Merchant, User } from "../entities";

export class UserService {
  repository = AppDataSource.getRepository(User);
  merchantRepo = AppDataSource.getRepository(Merchant);


  async getById({
    userId,
    targetUserId,
  }: {
    userId: number;
    targetUserId: number;
  }) {
    await this.repository.findOneOrFail({ where: { id: userId } });
    return this.repository
      .createQueryBuilder("user")
      .loadRelationCountAndMap("user.totalFollowing", "user.following")
      .loadRelationCountAndMap("user.totalFollowers", "user.followers")
      .where("user.id = :id", { id: targetUserId })
      .getOneOrFail();
  }

  async getByIdOrFail(id: number) {
    return this.repository.findOneOrFail({ where: { id } });
  }

  async me(userId: number) {
    return this.repository
      .createQueryBuilder("user")
      .loadRelationCountAndMap("user.totalFollowing", "user.following")
      .loadRelationCountAndMap("user.totalFollowers", "user.followers")
      .loadAllRelationIds({ relations: ["favorites"] })
      .where("user.id = :userId", { userId })
      .getOne();
  }

  async updateName({ userId, name }: { userId: number; name: string }) {
    const user = await this.repository.findOneOrFail({ where: { id: userId } });
    user.name = name;
    return this.repository.save(user);
  }

  async updateAvatar({
    userId,
    imageUrl,
  }: {
    userId: number;
    imageUrl: string;
  }) {
    const user = await this.repository.findOneOrFail({ where: { id: userId } });
    user.avatarUrl = imageUrl;
    return this.repository.save(user);
  }

  async followUser({
    userId,
    followUserId,
  }: {
    userId: number;
    followUserId: number;
  }) {
    const user = await this.repository.findOneOrFail({
      where: { id: userId },
      relations: ["following", "followers"],
    });
    const followUser = await this.repository.findOneOrFail({
      where: { id: followUserId },
    });

    const isFollowing = await this.repository
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

    await this.repository.save(user);
  }

  async favorites({ userId }: { userId: number }) {
    const user = await this.repository
      .createQueryBuilder("user")
      .loadAllRelationIds({ relations: ["favorites"] })
      .where("user.id = :userId", { userId })
      .getOneOrFail();

    return this.merchantRepo.find({ where: { id: In(user.favorites) } });
  }

  async addToFavorite({
    userId,
    merchantId,
  }: {
    userId: number;
    merchantId: number;
  }) {
    const user = await this.repository.findOneOrFail({
      where: { id: userId },
      relations: ["favorites"],
    });
    const merchant = await this.merchantRepo.findOneOrFail({
      where: { id: merchantId },
    });

    const isFav = await this.repository
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
    await this.repository.save(user);
  }
}
