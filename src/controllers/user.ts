import { Router } from "express";
import { userRepository } from "../repositories/user";

export const userRouter = Router();
const route = userRouter.route("/user/:id?");

route.get(async (req, res) => {
    try {
        const users = await userRepository.find({}).exec();
        res.json(users);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

route.post(async (req, res) => {
    try {
        const body = req.body;
        const user = new userRepository(body);

        const entity = await user.save();

        res.json(entity);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

route.delete(async (req, res) => {
    try {
        const { id } = req.params;
        const userRemoved = await userRepository.findByIdAndRemove(id);

        res.json(userRemoved);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});