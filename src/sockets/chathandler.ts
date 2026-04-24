import { Server, Socket } from "socket.io"
import messageService from "../services/messageService";
import logger from "../utils/logger";

export const chatHandler = (io:Server, socket:Socket) => {
    const userId:number = (socket as any).user.id;

    //Send Message To Group Or Individual
    socket.on("send_message",async(data) => {
        try {
            const message = await messageService.sendMessage({
                sender_id:userId,
                conversation_id:data.conversation_id ?? null,
                group_id:data.group_id ?? null,
                content:data.content,
                type:data.type ?? "text",
                media:data.media ?? null,
            });

            const room = data.conversation_id
                ? `room_conv_${data.conversation_id}`
                : `room_group_${data.group_id}`;


            io.to(room).emit("new_message",message);
            logger.info("Message sent",{ room, sender:userId });
        } catch (err:any) {
            socket.emit('error',{message:err.message});
        }
    });

    //Send Typing Status to User Except Sender
    socket.on("typing",({ id, isGroup, isTyping }) => {
        const room = isGroup ? `room_group_${id}` : `room_conv_${id}`;
        socket.to(room).emit("typing",{ userId, isTyping });
    });

    //Mark As A Read The Message
    socket.on("mark_read", async({ message_id }) => {
        try {
            const alreadyRead:boolean = await messageService.checkMessageRead(
                message_id,
                userId
            )

            if(!alreadyRead){
                await messageService.createMessageRead(
                    message_id,
                    userId
                )
            }

            socket.emit("message_read",{message_id,read_by:userId});
        } catch (err:any) {
            socket.emit("error", { message: err.message });
        }
    });
}