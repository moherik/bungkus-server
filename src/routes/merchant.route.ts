import express from "express";
import {
  apiResponse,
  CreateMerchantPayload,
  UpdateMerchantPayload,
} from "../dto";
import { verifyToken } from "../middleware";
import { MerchantService } from "../services";
import { logger } from "../utils";

const merchantRoute = express.Router();
const service = new MerchantService();

merchantRoute.get("/", verifyToken, async (req, res, _next) => {
  const { lat, long, distance, take, skip, keyword, categories } = req.query;
  try {
    const merchant = await service.getAll({
      lat: Number(lat),
      long: Number(long),
      distance: Number(distance || 1000),
      keyword: keyword?.toString() || "",
      take: Number(take || 10),
      skip: Number(skip || 0),
      categories: categories?.toString() || "",
    });
    res.json(apiResponse({ code: 200, data: merchant }));
  } catch (error) {
    console.log(error);
    logger.error(
      `Fetch all data with query: ${req.query} with error: ${error}`
    );
    res.status(400).json(apiResponse({ code: 200, errors: "Error" }));
  }
});

merchantRoute.get("/:id", async (req, res, _next) => {
  const { id } = req.params;
  const merchant = await service.getById(Number(id));
  res.json(apiResponse({ code: 200, data: merchant }));
});

merchantRoute.post("/", verifyToken, async (req, res, _next) => {
  const body = req.body as CreateMerchantPayload;
  try {
    const merchant = await service.create({
      userId: Number(req.userId),
      payload: body,
    });
    logger.info("Success perform create merchant");
    res.json(
      apiResponse({ code: 200, data: { id: merchant.id, message: "Success" } })
    );
  } catch (error) {
    console.log(error);

    logger.error(`Perform create merchant with error: ${error}`);
    res.status(400).json(apiResponse({ code: 400, data: "Error" }));
  }
});

merchantRoute.patch("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const body = req.body as UpdateMerchantPayload;
  try {
    const merchant = await service.update({
      userId: Number(req.userId),
      merchantId: Number(id),
      payload: body,
    });
    logger.info(`Success perform edit merchant id: ${id}`);
    res.json(
      apiResponse({ code: 200, data: { id: merchant.id, message: "Success" } })
    );
  } catch (error) {
    logger.error(`Perform edit merchant id: ${id} with error: ${error}`);
    res.status(400).json(apiResponse({ code: 400, data: "Error" }));
  }
});

merchantRoute.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await service.delete({
      userId: Number(req.userId),
      merchantId: Number(id),
    });
    logger.info(`Success perform delete merchant id: ${id}`);
    res.json(apiResponse({ code: 200, data: "Successs" }));
  } catch (error) {
    logger.error(`Perform delete merchant id: ${id} with error: ${error}`);
    res.status(400).json(apiResponse({ code: 400, data: "Error" }));
  }
});

export { merchantRoute };
