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
    status: CallStatus; 
    queue: string;
    userId: string;
    userNumber: string;
    receptionistNumber: string;
    receptionist: string;
}
