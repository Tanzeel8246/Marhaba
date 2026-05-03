import { Router, type IRouter } from "express";
import healthRouter from "./health";
import categoriesRouter from "./categories";
import productsRouter from "./products";
import ordersRouter from "./orders";
import bannersRouter from "./banners";
import blackoutDatesRouter from "./blackout-dates";
import couponsRouter from "./coupons";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(categoriesRouter);
router.use(productsRouter);
router.use(ordersRouter);
router.use(bannersRouter);
router.use(blackoutDatesRouter);
router.use(couponsRouter);
router.use(adminRouter);

export default router;
