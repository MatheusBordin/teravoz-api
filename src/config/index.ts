import { IConfig } from "../types/config";
import { config as localConfig } from "../environments/local.env";
import { config as testConfig } from "../environments/test.env";
import { config as productionConfig } from "../environments/prod.env";

const env = process.env.NODE_ENV || "local";
let config: IConfig = localConfig;

if (env === "production") {
    config = productionConfig;
} else if (env === "test") {
    config = testConfig;
} else {
    config = localConfig;
}

export default config;