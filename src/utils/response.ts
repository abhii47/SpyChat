import { Response } from "express";
import { success } from "zod";

export const sucessResponse = (
    msg:string,
    statusCode:number,
    res:Response,
    data?:any
) => {
    res.status(statusCode).json({
        success:true,
        message:msg,
        data:data||null
    });
}