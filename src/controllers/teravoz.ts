import { Router } from "express";

const router = Router();
router.post("/webhook", (req, res) => {
    // TODO: Implement that.
    res.send("Webhook API");
});

export const teravoz = router;