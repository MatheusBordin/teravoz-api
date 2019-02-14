import { Router } from "express";
import { heartbeat } from "../controllers/heartbeat";
import { teravoz } from "../controllers/teravoz";

// Configure routes.
const router = Router();
router.use(heartbeat);
router.use(teravoz);

// Export router.
export default router;
