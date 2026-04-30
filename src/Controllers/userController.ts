import { Request, Response, NextFunction } from "express";
import userService from "../services/userService";
import { successResponse } from "../utils/response";
import { searchQuerySchema } from "../validations/userValidation";
import AppError from "../utils/appError";

export const searchUsers = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const requesterId:number = req.user?.id;

        //Validate Query
        const result = searchQuerySchema.safeParse(req.query);
        if(!result.success){
            const message = result.error.issues.map((i)=>i.message).join(",");
            throw new AppError(message, 422);
        }

        const { name, limit, offset } = result.data;

        const data = await userService.searchUsers(name,requesterId,limit,offset);
        successResponse("Users fetched successfully", 200, res, data);
    } catch (err:any) {
        next(err);
    }
}

export const updateProfile = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const userId = req.user?.id;
        const avatar = req.file as Express.Multer.File | undefined;
        const data = await userService.updateProfile(userId,req.body,avatar);
        successResponse("Profile updated successfully", 200, res, data);
    } catch (err:any) {
        next(err);
    }
}

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = Number(req.params.id);

    if (isNaN(user_id)) {
      throw new Error("Invalid user ID");
    }

    const user = await userService.getUserProfile(user_id);
    successResponse("User Profile Fetched Successfully", 200, res, user);
  } catch (err: any) {
    next(err);
  }
};

export default {
    searchUsers,
    updateProfile,
    getUserProfile
}