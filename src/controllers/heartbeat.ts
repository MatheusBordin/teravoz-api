import { Router } from "express";

const router = Router();
router.get("/heartbeat", (req, res) => {
    res.send("API is alive! O.O");
});

export const heartbeat = router;