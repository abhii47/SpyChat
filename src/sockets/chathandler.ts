import { Server, Socket } from "socket.io"
import messageService from "../services/messageService";
import logger from "../utils/logger";

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

type MarkReadPayload = {
    message_id:number;
};

export const chatHandler = (io:Server, socket:Socket) => {
    const userId:number = (socket as any).user.id;

    //Send Message To Group Or Individual
    socket.on("send_message",async(payload:SendMessagePayload) => {
        try {
            const { conversation_id, group_id, content, type = "text", media = undefined } = payload;

            //Validation
            if(!conversation_id && !group_id){
                socket.emit("error",{
                    message:"Conversation_id or Group_id is required"
                });
                return;
            }

            if(type === "media" && (!media || media.length === 0)){
                socket.emit("error",{
                    message:"media array is required for type 'media'."
                });
                return;
            }

            if(type === "text" && (!content || content.trim() === "")){
                socket.emit("error",{
                    message:"content cann't be empty for text messages"
                });
                return;
            }

            const message = await messageService.sendMessage({
                sender_id:userId,
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
                ...message.toJSON(),
                sender:{
                    userId,
                }
            });
            logger.info("Message sent",{ room, sender:userId, type });
        } catch (err:any) {
            logger.error("send_message error", { stack: err.stack });
            socket.emit('error',{message:err.message});
        }
    });

    //Send Typing Status to User Except Sender
    socket.on("typing",(payload:TypingPayload) => {
        try {
            const { id, isGroup, isTyping } = payload;
            if(!id){
                socket.emit("error",{
                    message:"id is required for typing event"
                });
                return;
            }
            const room = isGroup ? `room_group_${id}` : `room_conv_${id}`;

            socket.to(room).emit("typing",{
                userId,
                isTyping
            });
        } catch (err:any) {
            logger.error("typing error", { stack: err.stack });
            socket.emit('error',{message:err.message});
        }
    });

    //Mark As A Read The Message
    socket.on("mark_read", async(payload:MarkReadPayload) => {
        try {
            const { message_id } = payload;

            if(!message_id){
                socket.emit("error", {
                    message:"message_id is required"
                });
                return;
            }

            const alreadyRead:boolean = await messageService.checkMessageRead(
                message_id,
                userId
            )

            if(!alreadyRead){
                await messageService.createMessageRead(
                    message_id,
                    userId
                );
                logger.info("message marked as read", { message_id,userId });
            }

            socket.emit("message_read",{
                message_id,
                read_by:userId,
                already_read:alreadyRead
            });
        } catch (err:any) {
            logger.error("mark_read error", { stack: err.stack });
            socket.emit("error", { message: err.message });
        }
    });
}