import { Request, Response, NextFunction } from "express";
import groupService from "../services/groupService";
import { successResponse } from "../utils/response";

export const createGroup = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const userId:number = req.user?.id;
        const {name, description} = req.body;
        const avatar = req.file as Express.Multer.File;
        const memberIds: number[] = JSON.parse(req.body.memberIds);

        const group = await groupService.createGroup(userId,name,description,avatar,memberIds);
        successResponse("Group Created Successfully", 201, res, group);
    } catch (err:any) {
       next(err); 
    }
}

export const getMyGroups = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const userId:number = req.user?.id;
        const groups = await groupService.getMyGroups(userId);
        successResponse("Groups Fetched Successfully", 200, res, groups);
    } catch (err:any) {
        next(err);
    }
}

export const getGroupDetails = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const user_id:number = req.user?.id;
        const group_id:number = Number(req.params.id);

        if(isNaN(group_id)){
            throw new Error("Invalid group ID");
        }

        const group = await groupService.getGroupDetails(user_id,group_id);
        successResponse("Group Detail Fetched Successfully", 200, res, group);
    } catch (err:any) {
        next(err);
    }
}

export const addMember = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const adminId:number = req.user?.id;
        const { group_id, user_id } = req.body;
        const member = await groupService.addMember(adminId,group_id,user_id);
        successResponse("Member Added Successfully", 200, res, member);
    } catch (err:any) {
        next(err);
    }
}

export const removeMember = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const adminId:number = req.user?.id;
        const { group_id, user_id } = req.body;
        const member = await groupService.removeMember(adminId,group_id,user_id);
        successResponse("Member Removed Successfully", 200, res, member);
    } catch (err:any) {
        next(err);
    }
}

export const getGroupMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const groupId = Number(req.params.id);
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;

    if (isNaN(groupId)) {
      throw new Error("Invalid group ID");
    }

    const data = await groupService.getGroupMessages(userId, groupId, limit, offset);
    successResponse("Group Messages Fetched Successfully", 200, res, data);
  } catch (err: any) {
    next(err);
  }
};

export default {
    createGroup,
    getMyGroups,
    getGroupDetails,
    addMember,
    removeMember,
    getGroupMessages
}