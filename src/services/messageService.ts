import { ConversationMember, GroupMember, Message, MessageRead } from "../models";
import AppError from "../utils/appError";
import logger from "../utils/logger";

type msgBody = {
    sender_id:number;
    conversation_id?:number;
    group_id?:number;
    content:string;
    type?:'text'|'media';
    media?:{ 
        url:string;
        public_id:string;
        type:"image" | "file";
    }[];
}
export const sendMessage = async(body:msgBody) => {
    const { sender_id, conversation_id, group_id, content, type="text", media = null } = body;

    //Validate Membership before saving
    if(conversation_id){
        const isMember = await ConversationMember.findOne({
            where:{user_id:sender_id},
        });
        if(!isMember){
            logger.warn("Membership doesn't exist on this Conversation");
            throw new AppError("Not a Member of this Conversation", 403);
        }
    }

    if(group_id){
        const isMember = await GroupMember.findOne({
            where:{user_id:sender_id},
        });
        if(!isMember){
            logger.warn("Membership doesn't exist on this Group");
            throw new AppError("Not a Member of this Group", 403);
        }
    }

    //Save in DB
    const message = await Message.create({
        sender_id,
        conversation_id: conversation_id ?? null,
        group_id: group_id ?? null,
        content,
        type,
        media
    });

    return message;
}

export const getMessage = async(
    type:"conversation" | "group",
    id: number,
    limit: number = 20,
    offset:number = 0
) => {

    //Where Condition For (Group | Individual)
    const whereCondition = type === 'conversation' 
                    ? {conversation_id:id}
                    : {group_id:id}

    //Get Messages
    const messages = await Message.findAll({
        limit,
        offset,
        where:whereCondition,
        order:[['created_at','DESC']],
    });

    return messages;
};

export const checkMessageRead = async(
    message_id:number,
    user_id:number
) => {
    const isRead = await MessageRead.findOne({
        where:{
            message_id,
            user_id
        }
    });
    
    return isRead ? true : false;
}

export const createMessageRead = async(
    message_id:number,
    user_id:number
) => {

    const readMessage = await MessageRead.create({
        message_id,
        user_id,
        read_at:new Date()
    });

    return readMessage;

}

export default {
    sendMessage,
    getMessage,
    checkMessageRead,
    createMessageRead
}