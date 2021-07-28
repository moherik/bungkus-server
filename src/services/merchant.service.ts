import { classToPlain, plainToClass } from "class-transformer";
import { getRepository } from "typeorm";
import { CreateMerchantPayload, UpdateMerchantPayload } from "../dto";
import { GetMerchantParams } from "../dto/merchant.dto";
import { Merchant, MerchantCategory } from "../entities";
import { UserService } from "./user.service";

const merchantRepo = () => getRepository(Merchant);
const categoryRepo = () => getRepository(MerchantCategory);
const userService = new UserService();

export class MerchantService {
  async getAll({
    lat,
    long,
    distance,
    take,
    skip,
    keyword,
    categories,
  }: GetMerchantParams) {
    const categoryIds = categories ? categories?.split(",") : [];

    let results: [Merchant[], number];
    if (lat && long) {
      results = await merchantRepo()
        .createQueryBuilder("m")
        .leftJoinAndSelect("m.categories", "c")
        .leftJoin("m.categories", "cp")
        .addSelect(
          "CAST(ST_Distance(ST_SetSRID(ST_MakePoint(:lat, :long), 4326)::geography, location::geography) AS INTEGER)",
          "m_distance"
        )
        .where(
          "ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint(:lat, :long)::geography, 4326), :distance)",
          {
            lat,
            long,
            distance,
          }
        )
        .where("m.name ILIKE :keyword", { keyword: `%${keyword}%` })
        .where((qb) => {
          if (categoryIds.length > 0) {
            qb.where("cp.id IN (:...categoryIds)", {
              categoryIds,
            });
          }
        })
        .orderBy("m_distance", "ASC")
        .take(take)
        .skip(skip)
        .getManyAndCount();
    } else {
      results = await merchantRepo()
        .createQueryBuilder("m")
        .leftJoinAndSelect("m.categories", "c")
        .leftJoin("m.categories", "cp")
        .where("m.name ILIKE :keyword", { keyword: `%${keyword || ""}%` })
        .where((qb) => {
          if (categoryIds.length > 0) {
            qb.where("cp.id IN (:...categoryIds)", {
              categoryIds,
            });
          }
        })
        .take(take)
        .skip(skip)
        .getManyAndCount();
    }

    const merchants = classToPlain(results[0]);
    return {
      data: merchants,
      totalCount: results[1],
    };
  }

  async getById(id: number) {
    const merchant = merchantRepo().findOne({ id });
    return classToPlain(merchant);
  }

  async getByUserId({
    merchantId,
    userId,
  }: {
    merchantId: number;
    userId: number;
  }) {
    return merchantRepo().findOneOrFail({
      id: merchantId,
      user: { id: userId },
    });
  }

  async create({
    userId,
    payload,
  }: {
    userId: number;
    payload: CreateMerchantPayload;
  }) {
    const merchant = plainToClass(Merchant, payload);
    const user = await userService.getByIdOrFail(userId);
    merchant.user = user;
    const categories = await categoryRepo().findByIds(payload.categoryIds);
    merchant.categories = categories;
    return await merchantRepo().save(merchant);
  }

  async update({
    userId,
    merchantId,
    payload,
  }: {
    userId: number;
    merchantId: number;
    payload: UpdateMerchantPayload;
  }) {
    const merchant = plainToClass(Merchant, payload);
    const _merchant = await merchantRepo().findOneOrFail({
      id: merchantId,
      user: { id: userId },
    });
    merchant.id = _merchant.id;
    const categories = await categoryRepo().findByIds(payload.categoryIds);
    merchant.categories = categories;
    return await merchantRepo().save(merchant);
  }

  async delete({ userId, merchantId }: { userId: number; merchantId: number }) {
    const merchant = await merchantRepo().findOneOrFail({
      id: merchantId,
      user: { id: userId },
    });
    if (merchant) return await merchantRepo().delete({ id: merchantId });
  }
}
