import { Server, Socket } from "socket.io";
import logger from "../utils/logger";

export const initSocket = (io:Server) => {
    io.on("connection", (socket:Socket) => {
        logger.info("User Connceted", { socketId:socket.id });

        socket.on("disconnect", () => {
            logger.info("User Disconnected");
        });
    });
}