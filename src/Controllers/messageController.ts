import { Request, Response, NextFunction } from "express";
import messageService from "../services/messageService";
import { successResponse } from "../utils/response";

export const sendMessage = async(
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    try {
        const sender_id:number = req.user?.id;
        const conversation_id:number = req.body.conversation_id;
        const group_id:number = req.body.group_id;
        const content:string = req.body.content;
        const type:'text' | 'media' = req.body.type;
        const media = req.files as Express.Multer.File[];

        const roomType = conversation_id ? "conversation" : "group";
        const roomId = conversation_id || group_id; 

        //Validation
        if(type === "media" && media.length === 0){
            throw new Error("You must provide media files for type 'media'");
        }
    
        const mediaData = type === "media" 
            ? await messageService.uploadMediaFiles(sender_id,media,{roomId,roomType}) 
            : undefined;

        const data = await messageService.sendMessage({sender_id,conversation_id,group_id,content,type,media:mediaData});
        successResponse("Message sent successfully", 200, res, data);
    } catch (err:any) {
        next(err);
    }
}

type RoomType = "conversation" | "group";
export const getMessage = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const roomType = req.params.roomType as RoomType;
        const roomId:number = Number(req.params.roomId);
        if (!["conversation", "group"].includes(roomType)) {
            throw new Error("Invalid room type only 'conversation' or 'group'");
        }
        if(isNaN(roomId)){
            throw new Error("Invalid Room ID");
        }
        const limit = Number(req.query.limit) || 20;
        const page = Number(req.query.page) || 1;
        const data = await messageService.getMessage(roomType,roomId,limit,page);
        successResponse("Messages Fetched Successfully", 200, res, data);
    } catch (err:any) {
        next(err);
    }
}

export const checkMessageRead = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const user_id = req.user?.id;
        const message_id = Number(req.params.messageId);
        if(isNaN(message_id)){
            throw new Error("Invalid message ID");
        }
        const data = await messageService.checkMessageRead(message_id,user_id);
        successResponse(data ? "Read Message" : `Unread Message`, 200, res);
    } catch (err:any) {
        next(err);
    }
}

export const createMessageRead = async(
    req:Request,
    res:Response,
    next:NextFunction
) =>{
    try {
        const user_id = req.user?.id;
        const message_id = Number(req.params.messageId);
        if(isNaN(message_id)){
            throw new Error("Invalid message ID");
        };
        const data = await messageService.createMessageRead(message_id,user_id);
        successResponse("Message Read Created Successfully", 200, res, data);
    } catch (err:any) {
        next(err);
    }
}

export const uploadMediaFiles = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const user_id = req.user?.id;
        const files = req.files as Express.Multer.File[];

        const mediaData = await messageService.uploadMediaFiles(user_id,files,req.body);
        successResponse("Media Uploaded Successfully", 200, res, mediaData);
    } catch (err:any) {
        next(err);
    }
}

export const getUnreadCount = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const user_id = req.user?.id;
        const roomType = req.params.roomType as "conversation" | "group";
        if(!["conversation","group"].includes(roomType)){
            throw new Error("Invalid room type only 'conversation' or 'group'");
        }
        const roomId = Number(req.params.roomId);
        if(isNaN(roomId)){
            throw new Error("Invalid room ID");
        }
        const data = await messageService.getUnreadCount(user_id,roomType,roomId);
        successResponse("Unread Count Fetched Successfully", 200, res, data);
    } catch (err:any) {
        next(err);
    }
}

export default {
    sendMessage,
    getMessage,
    checkMessageRead,
    createMessageRead,
    uploadMediaFiles,
    getUnreadCount
}