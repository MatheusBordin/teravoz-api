import { Router } from "express";
import { heartbeat } from "../controllers/heartbeat";

// Configure routes.
const router = Router();
router.use(heartbeat);

// Export router.
export default router;
