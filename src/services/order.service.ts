import { classToPlain, instanceToPlain, plainToClass } from "class-transformer";

import { MenuService } from "./menu.service";
import { MerchantService } from "./merchant.service";
import { UserService } from "./user.service";

import { AppDataSource } from "../config";
import { CreateOrderPayload, OrderStatus } from "../dto";
import { Cart, MenuItem, Order } from "../entities";

const userService = new UserService();
const merchantService = new MerchantService();
const menuService = new MenuService();

export class OrderService {
 repository = AppDataSource.getRepository(Order);
 
  async getMyOrderList({
    userId,
    status,
  }: {
    userId: number;
    status: OrderStatus;
  }) {
    let orders: Order[];
    if (status) {
      orders = await this.repository.find({
        where: { user: { id: userId }, status },
        relations: ["carts"],
      });
    } else {
      orders = await this.repository.find({
        where: { user: { id: userId } },
        relations: ["carts"],
      });
    }
    return instanceToPlain(orders);
  }

  async getMerchantOrderList({
    userId,
    merchantId,
    status,
  }: {
    userId: number;
    merchantId: number;
    status?: OrderStatus;
  }) {
    const merchant = await merchantService.getByUserId({ merchantId, userId });
    console.log(merchant);
    let orders: Order[];
    if (status) {
      orders = await this.repository.find({
        where: {
          merchant: { id: merchant.id },
          status,
        },
      });
    } else {
      orders = await this.repository.find({
        where: {
          merchant: { id: merchant.id },
        },
        relations: ["carts"],
      });
    }
    return classToPlain(orders);
  }

  async create({
    userId,
    merchantId,
    payload,
  }: {
    userId: number;
    merchantId: number;
    payload: CreateOrderPayload;
  }) {
    const user = await userService.getByIdOrFail(userId);
    const merchant = await merchantService.getNotOwnMerchant({
      userId,
      merchantId,
    });
    const order = plainToClass(Order, payload);
    const carts = payload.carts.map(async (cart) => {
      const item = await menuService.getMenuItemById({
        menuItemId: Number(cart.menuItemId),
      });

      const _cart = plainToClass(Cart, cart);
      if (item) {
        _cart.menuItem = item;
      }
      return _cart;
    });

    order.user = user;
    order.merchant = merchant;

    Promise.all(carts).then((carts) => {
      order.carts = carts;
    });
    return this.repository.save(order);
  }

  async updateStatus({
    userId,
    merchantId,
    orderId,
    status,
  }: {
    userId: number;
    merchantId: number;
    orderId: number;
    status: OrderStatus;
  }) {
    const merchant = await merchantService.getByUserId({
      merchantId,
      userId,
    });

    const order = await this.repository.findOneOrFail({
      where: {
        id: orderId,
        merchant: { id: merchant.id },
      },
    });

    order.status = status;
    return this.repository.save(order);
  }
}
