import * as http from "http";
import app from "./app";
import config from "./config";
import router from "./config/routes";

// Initialize routes
app.use("/api/v1", router);

// Start server
http.createServer(app)
    .listen(config.port, (err: any) => {
        if (err) {
            return console.log(err);
        }

        console.log(`Server running on port ${config.port} and env ${config.name}`);
    });
