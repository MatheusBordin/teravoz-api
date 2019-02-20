import { Router } from "express";
import { heartbeat as heartbeatRouter } from "../controllers/heartbeat";
import { teravoz as teravozRouter } from "../controllers/teravoz";
import { userRouter } from "../controllers/user";

// Configure routes.
const router = Router();
router.use(heartbeatRouter);
router.use(teravozRouter);
router.use(userRouter);

// Export router.
export default router;
