import { Request, Response, NextFunction } from "express";
import messageService from "../services/messageService";
import { successResponse } from "../utils/response";

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

export default {
    uploadMediaFiles,   
}