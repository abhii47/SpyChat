import { Server, Socket } from "socket.io";
import logger from "../utils/logger";
import { emitSocketError } from "../utils/socketError";
import convService from "../services/convService";
import { joinNewRoom } from ".";

type JoinConvPayload = {
    receiver_id: number;
}
type getConvPayload = {
    conversation_id: number;
    limit?: number;
    page?: number;
}

export const convHandler = (io:Server,socket:Socket) => {
    const userId = (socket as any).user.id;

    socket.on("join_conv", async(payload:JoinConvPayload) => {
        try {
            const { receiver_id } = payload;

            //Validation
            if(!receiver_id){
                emitSocketError(socket, "join_conv", "receiver_id is required");
                return;
            }
            
            const { conversation, isNew } = await convService.startConversation(userId, receiver_id);
            const conversationPayload = {
                conversation,
                isNew,
            };

            if(isNew){
                const room = `room_conv_${conversation.conversation_id}`;
                await joinNewRoom(io, userId, room);
                await joinNewRoom(io, receiver_id, room);
                socket.to(`user_${receiver_id}`).emit("notify", { type:"success", conversationPayload });
            }

            socket.emit("join_conv_success", conversationPayload);
            logger.info("User joined conversation", { conversation_id:conversation.conversation_id });
            
        } catch (err:any) {
            logger.error("joined conversation error", { stack: err.stack });
            emitSocketError(socket, "join_conv", err.message);
        }
    });

    socket.on("get_conv", async() => {
        try {
            const conversation = await convService.getMyConversations(userId);
            socket.emit("conv_list", { conversation,count:conversation.length });
            logger.info("User got conversation list");
        } catch (err:any) {
            logger.error("joined conversation error", { stack: err.stack });
            emitSocketError(socket, "get_conv", err.message);
        }
    });

    socket.on("get_conv_msg", async(payload:getConvPayload) => {
        try {
            const { conversation_id, limit = 20, page = 1 } = payload;
            if(!conversation_id || isNaN(conversation_id)){
                emitSocketError(socket, "get_conv_msg", "conversation_id is Invalid");
                return;
            }
            const messages = await convService.getConversationMessages(userId,conversation_id,limit,page);
            socket.emit("conv_msg", messages);
            logger.info("User got conversation messages");
        } catch (err:any){
            logger.error("get_conv_msg error", { stack: err.stack });
            emitSocketError(socket, "get_conv_msg", err.message);
        }
    });
}