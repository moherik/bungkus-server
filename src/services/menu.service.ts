import { classToPlain, plainToClass } from "class-transformer";
import { getRepository } from "typeorm";
import {
  CreateMenuItemPayload,
  CreateMenuPayload,
  UpdateMenuItemPayload,
  UpdateMenuPayload,
} from "../dto";
import { ReorderPayload } from "../dto/menu.dto";
import { Menu, MenuItem } from "../entities";
import { MerchantService } from "./merchant.service";

const menuRepo = () => getRepository(Menu);
const menuItemRepo = () => getRepository(MenuItem);

const merchantService = new MerchantService();

export class MenuService {
  async getAllMenu(merchantId: number) {
    const menus = await menuRepo().find({
      where: { merchant: { id: merchantId } },
      relations: ["items"],
      order: { order: "ASC" },
    });
    return classToPlain(menus);
  }

  async getMenuById({
    menuId,
    plain = false,
  }: {
    menuId: number;
    plain?: boolean;
  }) {
    const menu = await menuRepo().findOne(
      { id: menuId },
      { relations: ["items"], order: { order: "ASC" } }
    );
    if (plain) {
      return classToPlain(menu);
    }
    return menu;
  }

  async getMenuItemById({
    menuItemId,
  }: {
    menuItemId: number;
    plain?: boolean;
  }) {
    return await menuItemRepo().findOne({ id: menuItemId });
  }

  async createMenu({
    userId,
    merchantId,
    payload,
  }: {
    userId: number;
    merchantId: number;
    payload: CreateMenuPayload;
  }) {
    const merchant = await merchantService.getByUserId({
      userId,
      merchantId,
    });
    const menu = plainToClass(Menu, payload);
    menu.merchant = merchant;
    return await menuRepo().save(menu);
  }

  async createMenuItem({
    userId,
    merchantId,
    menuId,
    payload,
  }: {
    userId: number;
    merchantId: number;
    menuId: number;
    payload: CreateMenuItemPayload;
  }) {
    await merchantService.getByUserId({
      userId,
      merchantId,
    });
    const menu = await menuRepo().findOneOrFail({
      id: menuId,
      merchant: { id: merchantId },
    });
    const menuItem = plainToClass(MenuItem, payload);
    menuItem.menu = menu;
    return await menuItemRepo().save(menuItem);
  }

  async updateMenu({
    userId,
    merchantId,
    menuId,
    payload,
  }: {
    userId: number;
    merchantId: number;
    menuId: number;
    payload: UpdateMenuPayload;
  }) {
    const merchant = await merchantService.getByUserId({
      userId,
      merchantId,
    });
    const menu = plainToClass(Menu, payload);
    menu.id = menuId;
    menu.merchant = merchant;
    return await menuRepo().save(menu);
  }

  async reorderMenu({
    userId,
    merchantId,
    payload,
    type,
  }: {
    userId: number;
    merchantId: number;
    payload: ReorderPayload[];
    type: "menu" | "item";
  }) {
    await merchantService.getByUserId({
      userId,
      merchantId,
    });
    if (type === "menu") {
      return await menuRepo().save(payload);
    } else if (type === "item") {
      return await menuItemRepo().save(payload);
    }
  }

  async updateMenuItem({
    userId,
    merchantId,
    menuId,
    menuItemId,
    payload,
  }: {
    userId: number;
    merchantId: number;
    menuId: number;
    menuItemId: number;
    payload: UpdateMenuItemPayload;
  }) {
    await merchantService.getByUserId({
      userId,
      merchantId,
    });
    const menu = await menuRepo().findOneOrFail({
      id: menuId,
      merchant: { id: merchantId },
    });

    const menuItem = plainToClass(MenuItem, payload);
    menuItem.menu = menu;
    menuItem.id = menuItemId;
    return await menuItemRepo().save(menuItem);
  }

  async reorderMenuItem({
    userId,
    merchantId,
    payload,
  }: {
    userId: number;
    merchantId: number;
    payload: ReorderPayload[];
  }) {
    await merchantService.getByUserId({
      userId,
      merchantId,
    });
    return await menuItemRepo().save(payload);
  }

  async deleteMenu({
    userId,
    merchantId,
    menuId,
  }: {
    userId: number;
    merchantId: number;
    menuId: number;
  }) {
    await merchantService.getByUserId({
      userId,
      merchantId,
    });
    await menuRepo().findOneOrFail({
      id: menuId,
      merchant: { id: merchantId },
    });
    return await menuRepo().delete({
      id: menuId,
      merchant: { id: merchantId },
    });
  }

  async deleteMenuItem({
    userId,
    merchantId,
    menuId,
    menuItemId,
  }: {
    userId: number;
    merchantId: number;
    menuId: number;
    menuItemId: number;
  }) {
    await merchantService.getByUserId({
      userId,
      merchantId,
    });
    await menuItemRepo().findOneOrFail({
      id: menuItemId,
      menu: { id: menuId, merchant: { id: merchantId } },
    });
    return await menuItemRepo().delete({
      id: menuItemId,
      menu: { id: menuId, merchant: { id: merchantId } },
    });
  }
}
