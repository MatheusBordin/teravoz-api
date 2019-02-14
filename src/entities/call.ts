import { Document } from "mongoose";
import { CallStatus } from "../types/call-status";

/**
 * Call entity.
 *
 * @export
 * @interface ICallEntity
 * @extends {Document}
 */
export interface ICallEntity extends Document {
    teravozId: string;
    userId: string;
    status: CallStatus; 
}
