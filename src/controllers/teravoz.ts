import { Router } from "express";
import { ITeravozEvent } from "../dto/teravoz-event";
import { teravozIntegrationService } from "../services/teravoz-integration";

const router = Router();
router.post("/webhook", async (req, res) => {
    const event: ITeravozEvent = req.body;

    try {
        await teravozIntegrationService.processEvent(event);
        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

export const teravoz = router;