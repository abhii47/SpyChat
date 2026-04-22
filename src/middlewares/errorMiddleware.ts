import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import logger from "../utils/logger";

export const errorMiddleware = (
    err:any, 
    req:Request,
    res:Response,
    next:NextFunction
) => {
    
    let statusCode = 
        err instanceof AppError 
            ? err.statusCode 
            : 500;
    let message = err.message || "Internal Server Error";

    logger.error("Unhandled Error", {
        method:req.method,
        path:req.originalUrl,
        statusCode,
        stack:err.stack
    });

    res.status(statusCode).json({
            success:false,
            message
        });
}

export default errorMiddleware;