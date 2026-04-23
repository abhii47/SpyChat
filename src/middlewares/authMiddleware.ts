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
            logger.debug("Authorization Failed: header missing");
            throw new AppError("Unauthorized", 401);
        }

        if(!authHeader.startsWith('Bearer ')){
            logger.debug("Authorization Failed: Wrong header");
            throw new AppError("Unauthorized", 401);
        }

        const token = authHeader.split(" ")[1];

        if(!token){
            logger.debug("Authorization Failed: Token doesn't exist");
            throw new AppError("Unauthorized", 401);
        }

        req.user = verifyAccessToken(token);
        return next();
    } catch (err:any) {
        if(err instanceof AppError){
            return next(err);
        }
        if(err instanceof TokenExpiredError){
            logger.debug("JWT expired");
            return next(new AppError("Unauthorized: Token expired", 401));
        }
        if(err instanceof JsonWebTokenError){
            logger.debug("JWT invalid");
            return next(new AppError("Unauthorized: Invalid token", 401));
        }
        return next(new AppError("Internal Server Error", 500));
    }
}