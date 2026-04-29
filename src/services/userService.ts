import { Op } from "sequelize";
import { User } from "../models"
import { redis } from "../config/redis";
import logger from "../utils/logger";
import AppError from "../utils/appError";
import { uploadFile } from "../utils/uploadToCloudinary";
import { getEnv } from "../config/env";

export const searchUsers = async(
    query:string,
    requesterId:number,
    limit:number,
    offset:number,
) => {
    const users = await User.findAndCountAll({
        limit,
        offset,
        where:{
            [Op.and]:[
                { name:{[Op.like]:`%${query}%` }},
                { user_id:{[Op.ne]:requesterId }}
            ]
        },
        attributes:["user_id","name","avatar","is_active","last_seen"],
        order:[["name","ASC"]],
    });

    const userStatus = await Promise.all(
        users.rows.map(async(user) => {
            const isOnline = await redis.get(`Online:${user.user_id}`);
            return {
                ...user.toJSON(),
                is_online:!isOnline ? false : true 
            }
        })
    );
    return {
        total:users.count,
        limit,
        offset,
        users:userStatus
    };
};

type UpdateProfileBody = {
    name?:string,
    email?:string
}
export const updateProfile = async(
    user_id:number,
    body:UpdateProfileBody,
    avatar?:Express.Multer.File
) => {
    const user = await User.findOne({
        where:{ user_id },
    });
    
    if(!user){
        logger.warn("User Not Found");
        throw new AppError("User Not Found", 404);
    }

    if(body.email !== undefined && body.email !== user.email){
        const existEmail = await User.findOne({
            where:{
                email:body.email,
                user_id:{ [Op.ne]:user_id },
            }
        });

        if(existEmail){
            logger.warn("Email Already Exists");
            throw new AppError("Email already used", 409);
        }
    }

    let avatarUrl:string | undefined; 
    if(avatar){
        const result = await uploadFile(avatar,getEnv("USER_FOLDER"),"image");
        avatarUrl = result.secure_url;
    }

    user.name = body.name ?? user.name;
    user.email = body.email ?? user.email;
    user.avatar = avatarUrl ?? user.avatar;

    const updated = await user.save();
    const { password: _, ...safeUser } = updated.toJSON();
    return safeUser;
}

export const getUserProfile = async (user_id: number) => {
  const user = await User.findOne({
    where: { user_id },
    attributes: ["user_id", "name", "email", "avatar", "is_active", "last_seen"],
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Redis se online status check karo
  const isOnline = await redis.exists(`Online:${user_id}`);

  return {
    ...user.toJSON(),
    is_online: isOnline === 1,
  };
};


export default {
    searchUsers,
    updateProfile,
    getUserProfile
}