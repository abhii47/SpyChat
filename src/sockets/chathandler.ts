import { Server, Socket } from "socket.io"
import messageService from "../services/messageService";
import logger from "../utils/logger";
import { emitSocketError } from "../utils/socketError";
import { JwtPayload } from "jsonwebtoken";

type SendMessagePayload = {
    conversation_id?:number;
    group_id?:number;
    content:string,
    type?:"text" | "media";
    media?:{
        url:string;
        public_id:string;
        type:"image"|"file"
    }[];
};

type TypingPayload = {
    id:number;
    isGroup:boolean;
    isTyping:boolean;
};

type MessageId = {
    message_id:number;
};

export const chatHandler = (io:Server, socket:Socket) => {
    const user:JwtPayload = (socket as any).user;

    //Send Message To Group Or Individual
    socket.on("send_message",async(payload:SendMessagePayload) => {
        try {
            const { conversation_id, group_id, content, type = "text", media = undefined } = payload;

            //Validation
            if(!conversation_id && !group_id){
                emitSocketError(socket,"send_message", "Conversation_id or Group_id is required");
                return;
            }

            if(type === "media" && (!media || media.length === 0)){
                emitSocketError(socket, "send_message", "media array is required for type 'media'.");
                return;
            }

            if(type === "text" && (!content || content.trim() === "")){
                emitSocketError(socket, "send_message", "content cann't be empty for text messages");
                return;
            }

            const message = await messageService.sendMessage({
                sender_id:user.id,
                conversation_id,
                group_id,
                content,
                type,
                media,
            });

            const room = conversation_id
                ? `room_conv_${conversation_id}`
                : `room_group_${group_id}`;


            io.to(room).emit("new_message", {
                message,
                sender_id:user.id,
                sender_name:user.name,
                sender_image:user.avatar
            });
            logger.info("Message sent",{ room, sender:user.id, type });
        } catch (err:any) {
            logger.error("send_message error", { stack: err.stack });
            emitSocketError(socket, "send_message", err.message);
        }
    });

    //Send Typing Status to User Except Sender
    socket.on("typing",(payload:TypingPayload) => {
        try {
            const { id, isGroup, isTyping } = payload;
            if(!id){
                emitSocketError(socket, "typing", "id is required for typing event");
                return;
            }
            const room = isGroup ? `room_group_${id}` : `room_conv_${id}`;

            socket.to(room).emit("typing",{
                userId:user.id,
                isTyping
            });
        } catch (err:any) {
            logger.error("typing error", { stack: err.stack });
            emitSocketError(socket, "typing", err.message);
        }
    });

    //Mark As A Read The Message
    socket.on("mark_read", async(payload:MessageId) => {
        try {
            const { message_id } = payload;

            if(!message_id){
                emitSocketError(socket, "mark_read", "message_id is required");
                return;
            }

            const alreadyRead:boolean = await messageService.checkMessageRead(
                message_id,
                user.id
            )

            if(!alreadyRead){
                await messageService.createMessageRead(
                    message_id,
                    user.id
                );
                logger.info("message marked as read", { message_id, read_by:user.id });
            }

            socket.emit("message_read",{
                message_id,
                read_by:user.id,
                already_read:alreadyRead
            });
        } catch (err:any) {
            logger.error("mark_read error", { stack: err.stack });
            emitSocketError(socket, "mark_read", err.message);
        }
    });

    //Delete Message
    socket.on("delete_message", async(payload:MessageId) => {
        try {
            const { message_id } = payload;
            
            //Validation
            if(!message_id){
                emitSocketError(socket, "delete_message", "message_id is required");
                return;
            }
            if(isNaN(Number(message_id))){
                emitSocketError(socket, "delete_message", "Invalid message_id");
                return;
            }

            const deleted = await messageService.deleteMessage(message_id,user.id);
            const room = deleted.group_id !== null
                ? `room_group_${ deleted.group_id }`
                : `room_conv_${ deleted.conversation_id }`;

            io.to(room).emit("notify", { message_id, room, deletedby:user.id });
            logger.info("Message deleted", { message_id, room, deletedby:user.id });

        } catch (err:any) {
            logger.error("delete_message error", { stack: err.stack });
            emitSocketError(socket, "delete_message", err.message);
        }
    });
}