import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import AppError from "../utils/appError";
import { verifyAccessToken } from "../utils/token";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export const auth = (
    req:Request,
    res:Response,
    next:NextFunction
) => {

    try {
        const authHeader = req.headers.authorization;

        if(!authHeader){
            throw new AppError("Unauthorized", 401);
        }

        if(!authHeader.startsWith('Bearer ')){
            throw new AppError("Unauthorized", 401);
        }

        const token = authHeader.split(" ")[1];

        if(!token){
            throw new AppError("Unauthorized", 401);
        }

        req.user = verifyAccessToken(token);
        return next();
    } catch (err:any) {
        if(err instanceof AppError){
            logger.warn("Authorization Failed",{ message:err.message });
            return next(err);
        }
        if(err instanceof TokenExpiredError){
            logger.warn("JWT expired");
            return next(new AppError("Unauthorized: Token expired", 401));
        }
        if(err instanceof JsonWebTokenError){
            logger.warn("JWT invalid");
            return next(new AppError("Unauthorized: Invalid token", 401));
        }
        logger.error("Auth middleare failed", { stack:err.stack });
        return next(new AppError("Internal Server Error", 500));
    }
}