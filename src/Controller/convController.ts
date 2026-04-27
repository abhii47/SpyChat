import { Request, Response, NextFunction } from "express";
import convService from "../services/convService";
import { successResponse } from "../utils/response";
import AppError from "../utils/appError";

export const startConversation = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const user_id:number = req.user?.id;
        const receiverId:number = req.body;

        const {conversation, isNew} = await convService.startConversation(user_id, receiverId);

        const statusCode = isNew ? 201 : 200;
        const message = isNew ? "Converstion Started" : "Conversation Already Existed";

        successResponse(message,statusCode,res,conversation);
    } catch (err:any) {
        next(err);
    }
}

export const getMyConversations = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const user_id:number = req.user?.id;
        const conversations = await convService.getMyConversations(user_id);

        successResponse("Conversations fetched successfully",200,res,conversations);
    } catch (err:any) {
        next(err);
    }
}

export const getConversationMessages = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const user_id:number = req.user?.id;
        const conversation_id = Number(req.params.id);
        const limit = Number(req.query.limit);
        const offset = Number(req.query.offset);

        if(isNaN(conversation_id)){
            throw new Error("Invalid conversation ID");
        }

        const data = await convService.getConversationMessages(user_id,conversation_id,limit,offset);
        successResponse("Messages fetched successfully",200,res,data);
    } catch (err:any) {
        next(err);
    }
}

export default {
    startConversation,
    getMyConversations,
    getConversationMessages
}