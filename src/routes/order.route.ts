import express from "express";
import { apiResponse, CreateOrderPayload, OrderStatus } from "../dto";
import { verifyToken } from "../middleware";
import { OrderService } from "../services";
import { logger } from "../utils";

const orderRoute = express.Router();
const orderService = new OrderService();

orderRoute.get("/", verifyToken, async (req, res, _next) => {
  const { status } = req.query;
  try {
    const orders = await orderService.getMyOrderList({
      userId: Number(req.userId),
      status: status as OrderStatus,
    });
    res.json(apiResponse({ code: 200, data: orders }));
  } catch (error) {
    logger.error(
      `Fetch my order with userId: ${req.userId} and query: ${req.query} with error: ${error}`
    );
    res.status(400).json(apiResponse({ code: 200, errors: "Error" }));
  }
});

orderRoute.get(
  "/merchants/:merchantId",
  verifyToken,
  async (req, res, _next) => {
    const { merchantId } = req.params;
    const { status } = req.query;
    try {
      const orders = await orderService.getMerchantOrderList({
        userId: Number(req.userId),
        merchantId: Number(merchantId),
        status: status as OrderStatus,
      });
      res.json(apiResponse({ code: 200, data: orders }));
    } catch (error) {
      logger.error(
        `Fetch merchant order order with id: ${merchantId}, userId: ${req.userId} and query: ${req.query} with error: ${error}`
      );
      res.status(400).json(apiResponse({ code: 200, errors: "Error" }));
    }
  }
);

orderRoute.post(
  "/merchants/:merchantId",
  verifyToken,
  async (req, res, _next) => {
    const { merchantId } = req.params;
    const body = req.body as CreateOrderPayload;
    try {
      const order = await orderService.create({
        userId: Number(req.userId),
        merchantId: Number(merchantId),
        payload: body,
      });
      res.json(
        apiResponse({ code: 200, data: { id: order.id, mesage: "Success" } })
      );
    } catch (error) {
      logger.error(
        `Create order with merchantId: ${merchantId}, userId: ${req.userId} with error: ${error}`
      );
      res.status(400).json(apiResponse({ code: 200, errors: "Error" }));
    }
  }
);

orderRoute.patch(
  "/:orderId/merchants/:merchantId",
  verifyToken,
  async (req, res, _next) => {
    const { orderId, merchantId } = req.params;
    const { status } = req.query;
    try {
      const order = await orderService.updateStatus({
        userId: Number(req.userId),
        merchantId: Number(merchantId),
        orderId: Number(orderId),
        status: status as OrderStatus,
      });
      res.json(
        apiResponse({ code: 200, data: { id: order.id, mesage: "Success" } })
      );
    } catch (error) {
      logger.error(
        `Update order status with orderId: ${orderId}, merchantId: ${merchantId} and userId: ${req.userId} with error: ${error}`
      );
      res.status(400).json(apiResponse({ code: 200, errors: "Error" }));
    }
  }
);

export { orderRoute };
