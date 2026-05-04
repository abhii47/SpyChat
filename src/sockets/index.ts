import { Server, Socket } from "socket.io";
import logger from "../utils/logger";
import { socketAuthMiddleware } from "./socketMiddleware";
import convService from "../services/convService";
import groupService from "../services/groupService";
import { statusHandler } from "./statusHandler";
import { chatHandler } from "./chathandler";
import { redis } from "../config/redis";

export const autoJoinRoom = async(socket:Socket, userId:number) => {

    //Join all Individual Conversation Rooms 
    const convMemberships = await convService.getConvMembers(userId);
    convMemberships.forEach((m) => {
        socket.join(`room_conv_${m.conversation_id}`);
    });

    //Join all Group Rooms
    const groupMemberships = await groupService.getGroupMembers(userId);
    groupMemberships.forEach((m) => {
        socket.join(`room_group_${m.group_id}`);
    });

    //Join Personnal Room
    socket.join(`user_${userId}`);

    logger.info(`
        User ${userId} 
        joined :
        ${convMemberships.length} Convs, 
        ${groupMemberships.length} Groups 
    `);
}

export const joinNewRoom = async(io:Server, userId:number, room:string) => {
    const socketId = await redis.get(`Online:${userId}`);

    if(!socketId){
        logger.info(`User ${userId} is offline, room skipped: ${room}`);
        return;
    }

    const targetSocket = io.sockets.sockets.get(socketId);

    if(!targetSocket){
        logger.warn(`Socket not found for userId ${userId}, socketId: ${socketId}`);
        return;
    }

    targetSocket.join(room);
    logger.info(`User ${userId} dynamically joined ${room}`);
};

export const initSocket = (io:Server) => {
    logger.info("Initializing Socket....");
    
    // Auth middleware runs before any connection
    io.use(socketAuthMiddleware);

    io.on("connection", async(socket:Socket) => {

        const userId:number = (socket as any).user.id;
        logger.info("User Connceted", { socketId:socket.id, userId });

        //Auto join all rooms
        await autoJoinRoom(socket,userId);

        //Register handlers
        statusHandler(io, socket);
        chatHandler(io, socket);
        
        socket.on("disconnect", async() => {
            logger.info("User Disconnected", { userId });
        });
    });
};