import { Router, type IRouter } from "express";
import healthRouter from "./health";
import categoriesRouter from "./categories";
import productsRouter from "./products";
import ordersRouter from "./orders";
import bannersRouter from "./banners";
import blackoutDatesRouter from "./blackout-dates";
import couponsRouter from "./coupons";
import adminRouter from "./admin";
import authRouter from "./auth";
import settingsRouter from "./settings";
import shareRouter from "./share";
import reviewsRouter from "./reviews";
import operationsRouter from "./operations";

const router: IRouter = Router();

router.use(healthRouter);
router.use(categoriesRouter);
router.use(productsRouter);
router.use(ordersRouter);
router.use(bannersRouter);
router.use(blackoutDatesRouter);
router.use(couponsRouter);
router.use(adminRouter);
router.use(authRouter);
router.use(settingsRouter);
router.use(shareRouter);
router.use(reviewsRouter);
router.use(operationsRouter);

export default router;
