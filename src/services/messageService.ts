import { Op } from "sequelize";
import { getEnv } from "../config/env";
import { ConversationMember, GroupMember, Message, MessageRead, User } from "../models";
import AppError from "../utils/appError";
import logger from "../utils/logger";
import { uploadMultipleFiles } from "../utils/uploadToCloudinary";

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
            where:{
                user_id:sender_id,
                conversation_id
            },
        });
        if(!isMember){
            logger.warn("Membership doesn't exist on this Conversation");
            throw new AppError("Not a Member of this Conversation", 403);
        }
    }

    if(group_id){
        const isMember = await GroupMember.findOne({
            where:{
                user_id:sender_id,
                group_id,
                left_at:null
            },
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
    page:number = 1,
) => {

    const offset:number = (page - 1) * limit;

    //Where Condition For (Group | Individual)
    const whereCondition = type === 'conversation' 
                    ? {conversation_id:id}
                    : {group_id:id}

    //Get Messages
    const messages = await Message.findAndCountAll({
        limit,
        offset,
        where:whereCondition,
        order:[['created_at','DESC']],
        include:[
            {
                model:User,
                as:"sender",
                attributes:["user_id","name","avatar"]
            }
        ]
    });

    const totalPages = Math.ceil(messages.count/limit);

    return {
        pagination:{
            total_page:totalPages,
            current_page:page,
            next_page:page < totalPages ? page+1 : null,
            prev_page:page > 1 ? page-1 : null,
            limit,
            total_message:messages.count
        },
        messages:messages.rows
    }
};

export const checkMessageRead = async(
    message_id:number,
    user_id:number
) => {
    checkMessageRead
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
    const message = await Message.findOne({
        where:{ 
            message_id,
            sender_id:{[Op.ne]:user_id}
        },
        attributes:["sender_id","conversation_id","group_id"]
    });

    if(!message){
        logger.warn("Message not found");
        throw new AppError("Message not found", 404);
    };

    if(message.conversation_id){
        const isMember = await ConversationMember.findOne({
            where:{
                user_id,
                conversation_id:message.conversation_id
            }
        });

        if(!isMember){
            logger.warn("Not a member of this conversation");
            throw new AppError("Not a member of this conversation", 403);
        }
    }

    if(message.group_id){
        const isMember = await GroupMember.findOne({
            where:{
                user_id,
                group_id:message.group_id,
                left_at:null
            }
        });

        if(!isMember){
            logger.warn("Not a member of this group");
            throw new AppError("Not a member of this group", 403);
        }
    }

    const isRead = await await MessageRead.findOne({
        where:{
            message_id,
            user_id
        }
    });
    
    if(isRead){
        logger.warn("Message already read");
        throw new AppError("Message already read", 400);
    }


    const readMessage = await MessageRead.create({
        message_id,
        user_id,
        read_at:new Date()
    });

    return readMessage;

}

type mediaBody = {
    roomId:number,
    roomType:"conversation" | "group"
}
type returnBody = {
    url:string,
    public_id:string,
    type:"image" | "file"
}
export const uploadMediaFiles = async(
    user_id:number,
    files:Express.Multer.File[],
    body:mediaBody
) => {
    const { roomId, roomType } = body;

    if(!files || files.length === 0){
        throw new AppError("No files provided", 400);
    }

    if(roomType === "conversation"){
        const isMember = await ConversationMember.findOne({
            where:{
                user_id,
                conversation_id:roomId
            }
        });

        if(!isMember){
            logger.warn("Not a member of this conversation");
            throw new AppError("Not a member of this conversation", 403);
        }
    }

    if(roomType === "group"){
        const isMember = await GroupMember.findOne({
            where:{
                user_id,
                group_id:roomId
            }
        });

        if(!isMember){
            logger.warn("Not a member of this group");
            throw new AppError("Not a member of this group", 403);
        }
    }

    const uploaded = await uploadMultipleFiles(files,getEnv("MESSAGE_FOLDER"));

    const mediaData:returnBody[] = uploaded.map((file) => {
        return {
            url:file.secure_url,
            public_id:file.public_id,
            type:file.resource_type === 'image' ? "image" : "file"
        }
    });

    logger.info("Media Uploaded",{ user_id, roomId, roomType, count:files.length });
    return mediaData;
}

export const getUnreadCount = async(
    userId:number,
    roomType:"conversation"|"group",
    roomId:number
) => {
    const whereCondition = roomType === "conversation"
            ? { conversation_id:roomId }
            : { group_id:roomId };
    const allmessages = await Message.findAll({
        where:whereCondition,
        attributes:["message_id"],
    });

    if(allmessages.length === 0) return 0;
    const allmessageIds = allmessages.map((msg) => msg.message_id);

    const readCount = await MessageRead.count({
        where:{
            message_id:allmessageIds,
            user_id:userId,
        }
    });

    return allmessageIds.length - readCount;
}

export default {
    sendMessage,
    getMessage,
    checkMessageRead,
    createMessageRead,
    uploadMediaFiles,
    getUnreadCount
}