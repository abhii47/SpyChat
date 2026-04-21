import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export const requestLogger = (
    req:Request,
    res:Response,
    next:NextFunction
) => {
    const start = Date.now();
    res.on('finish', ()=>{
        try {
            const duration = Date.now()-start;
            logger.http(`${req.method} ${req.originalUrl}  Duration:${duration}ms Ip:${req.ip}`)
        } catch (err:any) {
            logger.error("Error in request logger middleware",{
                method:req.method,
                path:req.originalUrl,
                stack:err.stack
            });
        }
    });
    next();
}