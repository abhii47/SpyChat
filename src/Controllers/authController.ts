import { Request, Response, NextFunction } from "express";
import authService from "../services/authService";
import { successResponse } from "../utils/response";

export const register = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const avatar = req.file as Express.Multer.File;
        const user = await authService.register(req.body,avatar);
        successResponse("User Registered Successfully",201,res,user);
    } catch (err:any) {
        next(err);
    }
}

export const login = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {

        const {user,accessToken,refreshToken} = await authService.login(req.body);

        const expiryDate = 7 * 24 * 60 * 60 * 1000;
        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            sameSite:'strict',
            secure:true,
            maxAge:expiryDate
        });

        successResponse("User Login Successfully",200,res,{ user, accessToken });

    } catch (err:any) {
        next(err);
    }
}

export const refresh = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const refreshtoken = req.cookies?.refreshToken;
    const accessToken = await authService.refresh(refreshtoken);

    successResponse("Access Token Refreshed",200,res, accessToken);
    } catch (err:any) {
        next(err);
    }
}

export const logout = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        await authService.logout(refreshToken);
        res.clearCookie("refreshToken");
        successResponse("User Logout Successfully",200,res);
    } catch (err:any) {
        next(err);
    }
}

export const getMe = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const userId = req.user?.id;
        const user = await authService.getMe(userId);
        successResponse("Profile fetched successfully",200,res,user);
    } catch (err:any) {
        next(err);
    }
}

export default {
    register,
    login,
    refresh,
    logout,
    getMe
}