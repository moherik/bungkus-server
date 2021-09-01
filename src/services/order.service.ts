import { classToPlain, plainToClass } from "class-transformer";
import { getRepository } from "typeorm";
import { CreateOrderPayload, OrderStatus } from "../dto";
import { Cart, MenuItem, Order } from "../entities";
import { MenuService } from "./menu.service";
import { MerchantService } from "./merchant.service";
import { UserService } from "./user.service";

const repository = () => getRepository(Order);
const userService = new UserService();
const merchantService = new MerchantService();
const menuService = new MenuService();

export class OrderService {
  async getMyOrderList({
    userId,
    status,
  }: {
    userId: number;
    status: OrderStatus;
  }) {
    let orders: Order[];
    if (status) {
      orders = await repository().find({
        where: { user: { id: userId }, status },
        relations: ["carts"],
      });
    } else {
      orders = await repository().find({
        where: { user: { id: userId } },
        relations: ["carts"],
      });
    }
    return classToPlain(orders);
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
      orders = await repository().find({
        where: {
          merchant: { id: merchant.id },
          status,
        },
      });
    } else {
      orders = await repository().find({
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
    const carts = payload.carts.map((cart) => {
      let item: MenuItem | undefined;
      menuService
        .getMenuItemById({
          menuItemId: Number(cart.menuItemId),
        })
        .then((_item) => (item = _item));

      const _cart = plainToClass(Cart, cart);
      if (item) {
        _cart.menuItem = item;
      }
      return _cart;
    });

    order.user = user;
    order.merchant = merchant;
    order.carts = carts;
    return repository().save(order);
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
    const order = await repository().findOneOrFail({
      id: orderId,
      merchant: { id: merchant.id },
    });
    order.status = status;
    return repository().save(order);
  }
}
