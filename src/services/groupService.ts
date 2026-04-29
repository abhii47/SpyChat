import { Op, Sequelize } from "sequelize";
import sequelize from "../config/db";
import { getEnv } from "../config/env";
import { Group, GroupMember, Message, MessageRead, User } from "../models"
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
    description:string = "",
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

export const getMyGroups = async(user_id:number) => {
    const groups = await GroupMember.findAll({
        where:{ user_id, left_at:null },
        include:[
            {
                model:Group,
                as:"group",
                attributes:["group_id","name","avatar"],
                required:true,
                include:[
                    {
                        model:User,
                        as:"admin",
                        attributes:["user_id","name"]
                    },
                    {
                        model:Message,
                        as:"messages",
                        separate:true,
                        limit:1,
                        attributes:["content","created_at"],
                        order:[["created_at",'DESC']]
                    }
                ]
            }
        ]
    });

    const result = await Promise.all(
        groups.map(async(m:any) => {
            const group = m.group;
            const unreadMessages = await Message.findAll({
                    where:{ 
                        group_id:group.group_id,
                        sender_id:{ [Op.ne]:user_id }
                    },
                    attributes:{exclude:["media"]},
                    include:[
                        {
                            model:MessageRead,
                            as:"reads",
                            where:{ user_id },
                            required:false
                        }
                    ]
            });
        
            const unreadCount =  unreadMessages.filter(
                (msg:any) => msg.reads.length === 0 
            );

            return {
                group:group,
                role:m.role,
                joined_at:m.joined_at,
                last_message:group.messages[0],
                unread_count:unreadCount.length,   
            };
        })
    );
    return result;
}

export const getGroupDetails = async(user_id:number, group_id:number) => {
    const isMember = await GroupMember.findOne({
        where:{ 
            user_id, 
            left_at:null,
            group_id
        }
    });

    if(!isMember){
        logger.warn("Access Denied");
        throw new AppError("You are not a member of this group", 403);
    }

    const group = await Group.findOne({
        where:{ group_id },
        attributes:{ exclude: ["created_by","updated_at"] },
        include:[
            {
                model:User,
                as:"admin",
                attributes:["user_id","name","avatar"],
            },
            {
                model:GroupMember,
                as:"members",
                attributes:[
                    "group_member_id",
                    [Sequelize.literal("`members->user`.`name`"),"name"],
                    [Sequelize.literal("`members->user`.`avatar`"),"avatar"],
                    "joined_at"
                ],
                where:{ left_at:null, role:role.MEMBER },
                include:[
                    {
                        model:User, 
                        as:"user",
                        attributes:[]
                    }
                ]
            }
        ]
    });

    if(!group){
        logger.warn("Group Not Found");
        throw new AppError("Group not found", 404);
    }

    return group;
}

export const getGroupMessages = async(
    user_id:number,
    group_id:number,
    limit:number = 20,
    offset:number = 0
) => {
    const isMember = await GroupMember.findOne({
        where:{ group_id, user_id, left_at:null }
    });

    if(!isMember){
        logger.warn("You are not memmber of this group");
        throw new AppError("You are not memmber of this group", 403);
    }

    const messages = await Message.findAndCountAll({
        where:{ group_id },
        limit,
        offset,
        order:[["created_at","DESC"]],
        include:[
            {
                model:User,
                as:"sender",
                attributes:["user_id","avatar","name"],
            },
        ]
    });

    return {
        total:messages.count,
        limit,
        offset,
        messages:messages.rows
    };
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
    getMyGroups,
    getGroupDetails,
    getGroupMessages,
    getGroupMembers
}