import { Schema, model } from "mongoose";
import { IUserEntity } from "../entities/user";

const schema = new Schema({
    name: String,
    email: String,
    cpf: Number,
    birthday: Date,
    callNumber: String
}, {
    timestamps: true
});

export const userRepository = model<IUserEntity>("user", schema, "users");