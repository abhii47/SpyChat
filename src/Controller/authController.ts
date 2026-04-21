import { Request, Response, NextFunction } from "express";
import authService from "../services/authService";
import { sucessResponse } from "../utils/response";

export const register = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const user = await authService.register(req.body);
        sucessResponse("User Registered Successfully",201,res,user);
    } catch (err:any) {
        next(err);
    }
}

export default {
    register
}