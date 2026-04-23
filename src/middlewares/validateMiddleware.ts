import {Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import AppError from "../utils/appError";

// const formatPath = (path: PropertyKey[]) => {
//     return path.length ? path.join(".") : "body";
// };

// export const validateBody = <T>(schema: ZodType<T>): RequestHandler => {
//     return (req, res, next) => {
//         const result = schema.safeParse(req.body);

//         if (!result.success) {
//             const message = result.error.issues
//                 .map((issue) => `${formatPath(issue.path)}: ${issue.message}`)
//                 .join(", ");

//             return next(new AppError(message, 422));
//         }

//         req.body = result.data;
//         next();
//     };
// };

export const  validateBody = (schema:ZodType) => {
    return ( 
        req:Request,
        res:Response,
        next:NextFunction
    ) => {
        const result = schema.safeParse(req.body);

        if(!result.success){
            const message = result.error.issues
                .map((issue) => issue.message)
                .join(", ");
            return next(new AppError(message, 422));
        }
        req.body = result.data;
        next();
    }
}