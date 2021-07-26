import express from "express";
import { authRoute } from "./auth.route";
import { userRoute } from "./user.route";
import { merchantRoute } from "./merchant.route";
import { menuRoute } from "./menu.route";

const router = express.Router();

/* GET home page. */
router.get("/", (_req, res, _next) => {
  res.send("Tes Server");
});

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/merchants", merchantRoute);
router.use("/menus", menuRoute);

export { router };
