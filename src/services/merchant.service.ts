import { classToPlain, plainToClass } from "class-transformer";
import { getRepository, ILike } from "typeorm";
import { CreateMerchant, UpdateMerchant } from "../dto";
import { GetMerchantParams } from "../dto/merchant.dto";
import { Merchant, User } from "../entities";
import { UserService } from "./user.service";

const merchantRepo = () => getRepository(Merchant);
const userService = new UserService();

export class MerchantService {
  async getAll({
    lat,
    long,
    distance,
    take,
    skip,
    keyword,
  }: GetMerchantParams) {
    let results: [Merchant[], number];

    if (lat && long) {
      results = await merchantRepo()
        .createQueryBuilder("m")
        .addSelect(
          "CAST(ST_Distance(ST_SetSRID(ST_MakePoint(:lat, :long), 4326)::geography, location::geography) AS INTEGER)",
          "m_distance"
        )
        .where(
          "ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint(:lat, :long)::geography, 4326), :distance)"
        )
        .where("m.name ilike :name", { name: `%${keyword}%` })
        .orderBy("m_distance", "ASC")
        .setParameters({
          lat,
          long,
          distance,
        })
        .take(take)
        .skip(skip)
        .getManyAndCount();
    } else {
      results = await merchantRepo().findAndCount({
        where: { name: ILike(`%${keyword}%`) },
        take: take,
        skip: skip,
      });
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

  async create({
    userId,
    payload,
  }: {
    userId: number;
    payload: CreateMerchant;
  }) {
    const user = await userService.getByIdOrFail(userId);
    const merchant = plainToClass(Merchant, payload);
    merchant.user = user;
    return await merchantRepo().save(merchant);
  }

  async update({
    userId,
    merchantId,
    payload,
  }: {
    userId: number;
    merchantId: number;
    payload: UpdateMerchant;
  }) {
    const merchant = await merchantRepo().findOneOrFail({
      id: merchantId,
      user: { id: userId },
    });
    const merchantObj = plainToClass(Merchant, payload);
    merchantObj.id = merchant.id;
    return await merchantRepo().save(merchantObj);
  }

  async delete({ userId, merchantId }: { userId: number; merchantId: number }) {
    const merchant = await merchantRepo().findOneOrFail({
      id: merchantId,
      user: { id: userId },
    });
    if (merchant) return await merchantRepo().delete({ id: merchantId });
  }
}
