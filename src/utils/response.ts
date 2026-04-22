import { Response } from "express";

export const successResponse = (
    msg:string,
    statusCode:number,
    res:Response,
    data?:any
) => {
    res.status(statusCode).json({
        success:true,
        message:msg,
        data
    });
}