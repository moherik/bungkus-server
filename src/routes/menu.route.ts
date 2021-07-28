import express from "express";
import {
  apiResponse,
  CreateMenuItemPayload,
  CreateMenuPayload,
  UpdateMenuItemPayload,
  UpdateMenuPayload,
} from "../dto";
import { ReorderPayload } from "../dto/menu.dto";
import { verifyToken } from "../middleware";
import { MenuService } from "../services";
import { logger } from "../utils";

const menuRoute = express.Router();
const service = new MenuService();

// Get all menu by merchantId params
menuRoute.get(
  "/merchants/:merchantId",
  verifyToken,
  async (req, res, _next) => {
    const { merchantId } = req.params;
    try {
      const menu = await service.getAllMenu(Number(merchantId));
      res.json(apiResponse({ code: 200, data: menu }));
    } catch (error) {
      logger.error(
        `Fetch all menu by merchantId: ${merchantId} with error: ${error}`
      );
      res.status(400).json(apiResponse({ code: 200, errors: "Error" }));
    }
  }
);

// Get menu by menuId params
menuRoute.get("/:menuId", verifyToken, async (req, res, _next) => {
  const { menuId } = req.params;
  const menu = await service.getMenuById({
    menuId: Number(menuId),
    plain: true,
  });
  res.json(apiResponse({ code: 200, data: menu }));
});

// Create menu with merchantId params
menuRoute.post(
  "/merchants/:merchantId",
  verifyToken,
  async (req, res, _next) => {
    const payload = req.body as CreateMenuPayload;
    const { merchantId } = req.params;
    try {
      const menu = await service.createMenu({
        merchantId: Number(merchantId),
        userId: Number(req.userId),
        payload,
      });
      logger.info(`Success perform create menu with merchantId: ${merchantId}`);
      res.json(
        apiResponse({ code: 200, data: { id: menu.id, message: "Success" } })
      );
    } catch (error) {
      logger.error(
        `Perform create menu with merchantId: ${merchantId} with error: ${error}`
      );
      res.status(400).json(apiResponse({ code: 400, data: "Error" }));
    }
  }
);

// Create menu item with merchantId and menuItemId params
menuRoute.post(
  "/:menuId/merchants/:merchantId/items",
  verifyToken,
  async (req, res, _next) => {
    const payload = req.body as CreateMenuItemPayload;
    const { merchantId, menuId } = req.params;
    try {
      const menu = await service.createMenuItem({
        merchantId: Number(merchantId),
        userId: Number(req.userId),
        menuId: Number(menuId),
        payload,
      });
      logger.info(
        `Success perform create menu item with merchantId: ${merchantId} and menuId: ${menuId}`
      );
      res.json(
        apiResponse({ code: 200, data: { id: menu.id, message: "Success" } })
      );
    } catch (error) {
      console.log(error);

      logger.error(
        `Perform create menu with merchantId: ${merchantId} and menuId: ${menuId} with error: ${error}`
      );
      res.status(400).json(apiResponse({ code: 400, data: "Error" }));
    }
  }
);

// Update menu with id and menuItemId params
menuRoute.patch(
  "/:menuId/merchants/:merchantId",
  verifyToken,
  async (req, res) => {
    const { menuId, merchantId } = req.params;
    const body = req.body as UpdateMenuPayload;
    try {
      const merchant = await service.updateMenu({
        userId: Number(req.userId),
        merchantId: Number(merchantId),
        menuId: Number(menuId),
        payload: body,
      });
      logger.info(`Success perform edit menu with id: ${menuId}`);
      res.json(
        apiResponse({
          code: 200,
          data: { id: merchant.id, message: "Success" },
        })
      );
    } catch (error) {
      logger.error(`Perform edit menu with id: ${menuId} with error: ${error}`);
      res.status(400).json(apiResponse({ code: 400, data: "Error" }));
    }
  }
);

// Reorder menu with merchantId params
menuRoute.patch(
  "/merchants/:merchantId/reorder",
  verifyToken,
  async (req, res) => {
    const { merchantId } = req.params;
    const { type } = req.query;
    const body = req.body as ReorderPayload[];
    try {
      await service.reorderMenu({
        userId: Number(req.userId),
        merchantId: Number(merchantId),
        payload: body,
        type: (type as any)?.toString(),
      });
      logger.info(`Success perform reorder menu in merchantId: ${merchantId}`);
      res.json(
        apiResponse({
          code: 200,
          data: { id: merchantId, message: "Success" },
        })
      );
    } catch (error) {
      logger.error(
        `Perform reorder menu with merchantId: ${merchantId} with error: ${error}`
      );
      res.status(400).json(apiResponse({ code: 400, data: "Error" }));
    }
  }
);

// Update menu item with id and menuId params
menuRoute.patch(
  "/:menuId/merchants/:merchantId/items/:menuItemId",
  verifyToken,
  async (req, res) => {
    const { menuId, menuItemId, merchantId } = req.params;
    const body = req.body as UpdateMenuItemPayload;
    try {
      const merchant = await service.updateMenuItem({
        userId: Number(req.userId),
        merchantId: Number(merchantId),
        menuId: Number(menuId),
        menuItemId: Number(menuItemId),
        payload: body,
      });
      logger.info(`Success perform edit menu item with id: ${menuItemId}`);
      res.json(
        apiResponse({
          code: 200,
          data: { id: merchant.id, message: "Success" },
        })
      );
    } catch (error) {
      logger.error(
        `Perform edit menu item with id: ${menuItemId} with error: ${error}`
      );
      res.status(400).json(apiResponse({ code: 400, data: "Error" }));
    }
  }
);

// Delete menu
menuRoute.delete(
  "/:menuId/merchants/:merchantId",
  verifyToken,
  async (req, res) => {
    const { menuId, merchantId } = req.params;
    try {
      await service.deleteMenu({
        userId: Number(req.userId),
        merchantId: Number(merchantId),
        menuId: Number(menuId),
      });
      logger.info(`Success perform delete menu with id: ${menuId}`);
      res.json(apiResponse({ code: 200, data: "Successs" }));
    } catch (error) {
      logger.error(
        `Perform delete menu with id: ${menuId} with error: ${error}`
      );
      res.status(400).json(apiResponse({ code: 400, data: "Error" }));
    }
  }
);

// Delete menu item
menuRoute.delete(
  "/:menuId/merchants/:merchantId/items/:menuItemId",
  verifyToken,
  async (req, res) => {
    const { menuId, merchantId, menuItemId } = req.params;
    try {
      await service.deleteMenuItem({
        userId: Number(req.userId),
        merchantId: Number(merchantId),
        menuId: Number(menuId),
        menuItemId: Number(menuItemId),
      });
      logger.info(`Success perform delete menu item with id: ${menuId}`);
      res.json(apiResponse({ code: 200, data: "Successs" }));
    } catch (error) {
      logger.error(
        `Perform delete menu item with id: ${menuId} with error: ${error}`
      );
      res.status(400).json(apiResponse({ code: 400, data: "Error" }));
    }
  }
);

export { menuRoute };
