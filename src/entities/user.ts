import { Document } from "mongoose";

/**
 * User entity.
 *
 * @export
 * @interface IUser
 * @extends {Document}
 */
export interface IUserEntity extends Document {
    name: string;
    email: string;
    callNumber: string;
}