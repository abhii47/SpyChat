import { Server, Socket } from "socket.io";
import logger from "../utils/logger";
import { socketAuthMiddleware } from "./socketMiddleware";

export const initSocket = (io:Server) => {

    // Auth middleware runs before any connection
    io.use(socketAuthMiddleware);

    io.on("connection", (socket:Socket) => {

        const userId:number = (socket as any).user.id;
        logger.info("User Connceted", { socketId:socket.id, userId });
        
        socket.on("disconnect", () => {
            logger.info("User Disconnected");
        });
    });
}