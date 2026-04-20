import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

const errorMiddleware = (
    err:any, 
    req:Request,
    res:Response,
    next:NextFunction
) => {
    let statusCode = err instanceof AppError ? err.statusCode : 500;
    let message = err.message || "Internal Server Error";

    res.status(statusCode)
        .json({
            success:false,
            message
        });
}

export default errorMiddleware;