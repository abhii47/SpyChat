import sequelize from "../config/db";
import { getEnv } from "../config/env";
import { Group, GroupMember } from "../models"
import AppError from "../utils/appError";
import logger from "../utils/logger";
import { uploadFile } from "../utils/uploadToCloudinary";

enum role {
    ADMIN ='admin',
    MEMBER = 'member'
}

export const createGroup = async(
    creatorId:number,
    name:string,
    description:string,
    avatar:Express.Multer.File,
    memberIds:number[],
) => {
    const t = await sequelize.transaction();
    try {
        const avatarUrl = await uploadFile(avatar,getEnv("GROUP_FOLDER"),'image');

        const group = await Group.create({
            name,
            description,
            avatar:avatarUrl.secure_url,
            created_by:creatorId
        },
        { transaction:t});

        const members = [
            // { group_id, user_id, role}
            { 
                group_id:group.group_id, 
                user_id:group.created_by,
                role:role.ADMIN  
            },
            ...memberIds.map(m => ({
                    group_id:group.group_id,
                    user_id:m,
                    role:role.MEMBER
                })
            )
        ]

        await GroupMember.bulkCreate(
            members,
            { transaction:t }
        );

        await t.commit();
        return group;
    } catch (err:any) {
        await t.rollback();
        logger.error("Group Creation : failed", { stack:err.stack });
        throw err;
    }
}

export const addMember = async(
    adminId:number,
    group_id:number,
    user_id:number,
) => {
    const isAdmin = await GroupMember.findOne({
        where:{ 
            group_id, 
            user_id:adminId, 
            role:role.ADMIN,
            left_at:null 
        }
    });

    if(!isAdmin){
        logger.warn("Access Denied");
        throw new AppError("Only admin can add member", 403);
    }

    const existing = await GroupMember.findOne({
        where:{
            group_id:group_id,
            user_id
        }
    });

    if(existing && existing.left_at === null){
        logger.warn("User exist");
        throw new AppError("User already in group", 400);
    }

    if (existing) {
        await existing.update({ left_at: null, joined_at: new Date() });
        return existing;
    }

    return GroupMember.create({ group_id, user_id, left_at: null });
}

export const removeMember = async(
    adminId:number,
    group_id:number,
    user_id:number
) => {
    //check loggedIn user is Admin or not
    const isAdmin = await GroupMember.findOne({
        where:{
            user_id:adminId,
            group_id,
            role:role.ADMIN,
            left_at:null
        }
    });

    if(!isAdmin){
        logger.warn("Access Denied");
        throw new AppError("Only admin can remove the member", 403);
    }

    //check user is member of group or not
    const member = await GroupMember.findOne({
        where:{
            user_id,
            group_id,
            role:role.MEMBER,
            left_at:null
        }
    });

    if(!member){
        logger.warn("Member not found");
        throw new AppError("Member not found", 404);
    }

    //if member then remove
    await member.update({
        left_at:new Date()
    });

    return member;
}

export const getGroupMembers = async(user_id:number) => {
    const members = await GroupMember.findAll({
        where:{ user_id }
    });
    return members;
}

export default {
    createGroup,
    addMember,
    removeMember,
    getGroupMembers
}