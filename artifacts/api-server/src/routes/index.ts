import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import profilesRouter from "./profiles";
import jobsRouter from "./jobs";
import applicationsRouter from "./applications";
import cvReviewsRouter from "./cv-reviews";
import paymentsRouter from "./payments";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(profilesRouter);
router.use(jobsRouter);
router.use(applicationsRouter);
router.use(cvReviewsRouter);
router.use(paymentsRouter);
router.use(statsRouter);

export default router;
