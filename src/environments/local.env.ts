import { IConfig } from "../types/config";

export const config: IConfig = {
    name: "local",
    port: 4000,
    teravozURI: "http://localhost:5000",
    mongoURI: "mongodb://localhost:27017/teravoz"
};
