import { Schema, model, Types } from "mongoose";
import { ICallEntity } from "../entities/call";

const schema = new Schema({
    teravozId: String,
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    status: String,
    queue: String,
    userNumber: String,
    receptionist: String,
    receptionistNumber: String
}, {
    timestamps: true
});

export const callRepository = model<ICallEntity>("call", schema, "calls");