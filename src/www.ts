import * as http from "http";
import * as socketio from "socket.io";
import app from "./app";
import config from "./config";
import router from "./config/routes";
import { SocketService } from "./services/socket";

// Create server
const server = http.createServer(app);
const io = socketio(server);

// Initialize socket
SocketService.start(io);

// Initialize routes
app.use("/api/v1", router);

// Start server
server.listen(config.port, (err: any) => {
    if (err) {
        return console.log(err);
    }

    console.log(`Server running on port ${config.port} and env ${config.name}`);
});
