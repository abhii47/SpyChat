import { Request, Response, NextFunction } from "express";
import userService from "../services/userService";
import { successResponse } from "../utils/response";

export const searchUsers = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const query:string = req.query.name as string;
        const requesterId:number = req.user?.id;
        const limit:number = Number(req.query.limit) || 10;
        const offset:number = Number(req.query.offset) || 0;

        const data = await userService.searchUsers(query,requesterId,limit,offset);
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