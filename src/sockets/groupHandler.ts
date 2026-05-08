import { Server, Socket } from "socket.io";
import { emitSocketError } from "../utils/socketError";
import logger from "../utils/logger";
import groupService from "../services/groupService";
import { joinNewRoom } from ".";
import { redis } from "../config/redis";

type GroupId = {
    group_id:number
}

type GroupMemberPayload = {
    group_id:number
    user_id:number
}

type GroupMessagePayload = {
    group_id:number,
    limit?:number,
    page?:number
}

type GroupPayload = {
    name:string,
    description?:string,
    avatarUrl:string,
    memberIds:number[]
}

export const groupHandler = (io:Server, socket:Socket) => {

    const userId = (socket as any).user.id;

    socket.on("create_group", async(payload:GroupPayload) => {
        try {
            const { name, description, avatarUrl, memberIds } = payload;
            
            //Validation
            if(!name || name.trim().length === 0){
                emitSocketError(socket, "create_group", "name is required");
                return;
            }
            if(!avatarUrl || avatarUrl.trim().length === 0){
                emitSocketError(socket, "create_group", "avatarUrl is required");
                return;
            }
            if(!memberIds || !Array.isArray(memberIds) || memberIds.length === 0){
                emitSocketError(socket, "create_group", "memberIds is required");
                return;
            }

            const group = await groupService.createGroupSocket(userId,name,avatarUrl,memberIds,description);

            const room = `room_group_${group.group_id}`;

            //join new room
            const allUserIds = [userId, ...memberIds];
            await Promise.all(
                allUserIds.map(id => joinNewRoom(io,id,room))
            )

            socket.emit("create_group_success", { type:"group created", group, member_count:allUserIds.length });
            io.to(room).emit("notify", { type:"added members",members:memberIds, actor_id:userId });
            memberIds.map((m) => 
                socket.to(`user_${m}`).emit("notify", { type:"added to group", user:m, group:group.name })
            );
            logger.info("User created group", { 
                group_id:group.group_id, 
                created_by:userId,
                member_count:allUserIds.length 
            });
            
        } catch (err:any) {
            logger.error("create_group_error", { stack:err.stack });
            emitSocketError(socket, "create_group", err.message);
        }
    });
    
    socket.on("get_groups", async() => {
        try {
            const groups = await groupService.getMyGroups(userId);
            socket.emit("groups_list", { count:groups.length, groups });
            logger.info("User got groups", { userId, count:groups.length });
        } catch (err:any) {
            logger.error("get_groups error", { stack:err.stack });
            emitSocketError(socket, "get_groups", err.message);
        }
    });

    socket.on("group_details", async(payload:GroupId) => {
        try {
            const { group_id } = payload;

            //Validation
            if(!group_id){
                emitSocketError(socket, "group_details", "group_id is required");
                return;
            }
            if(isNaN(Number(group_id))){
                emitSocketError(socket, "group_details", "Invalid group_id");
                return;
            }
        
            const groupDetails = await groupService.getGroupDetails(userId, group_id);
            socket.emit("group_details_list", { groupDetails });
            logger.info("User got group details", { userId, group_id });
        } catch (err:any) {
            logger.error("group_details error", { stack:err.stack });
            emitSocketError(socket, "group_details", err.message);
        }
    });

    socket.on("add_member", async(payload:GroupMemberPayload) => {
        try {
            const { group_id, user_id } = payload;
            
            //Validation
            if(!group_id || !user_id){
                emitSocketError(socket, "add_member", "group_id and user_id is required");
                return;
            }
            if(isNaN(group_id) || isNaN(user_id)){
                emitSocketError(socket, "add_member", "Invalid group_id or user_id");
                return;
            }

            const member = await groupService.addMember(userId, group_id, user_id);

            const room = `room_group_${group_id}`;
            await joinNewRoom(io, user_id, room);

            io.to(room).emit("notify", { user:user_id, added_by:userId, group:group_id});
            socket.emit("add_member_success", { member });
            logger.info("User added member", { adminId:userId, group_id, user_id });

        } catch (err:any) {
            logger.error("add_member error", { stack:err.stack });
            emitSocketError(socket, "add_member", err.message);
        }
    });

    socket.on("remove_member", async(payload:GroupMemberPayload) => {
        try {
            const { group_id, user_id } = payload;
            
            //Validation
            if(!group_id || !user_id){
                emitSocketError(socket, "remove_member", "group_id and user_id is required");
                return;
            }
            if(isNaN(group_id) || isNaN(user_id)){
                emitSocketError(socket, "remove_member", "Invalid group_id or user_id");
                return;
            }

            const member = await groupService.removeMember(userId, group_id, user_id);

            const room = `room_group_${group_id}`;
            const socketId = await redis.get(`Online:${user_id}`);
            if(socketId){
                const socket = io.sockets.sockets.get(socketId)
                if(socket){
                    socket.leave(room);
                    socket.emit("notify", { user:userId, removed_from:group_id });
                }
            }
            io.to(room).emit("notify", { user:user_id, removed_by:userId, group:group_id });
            socket.emit("remove_member_success", { member });
            logger.info("User removed member", { adminId:userId, group_id, user_id });
        } catch (err:any) {
            logger.error("remove_member error", { stack:err.stack });
            emitSocketError(socket, "remove_member", err.message);
        }
    });

    socket.on("leave_group", async(payload:GroupId) => {
        try {
            const { group_id } = payload;

            //Validation
            if(!group_id){
                emitSocketError(socket, "leave_group", "group_id is required");
                return;
            }
            if(isNaN(group_id)){
                emitSocketError(socket, "leave_group", "Invalid group_id");
                return; 
            }

            const member = await groupService.leaveGroup(userId, group_id);

            const room = `room_group_${group_id}`;
            socket.leave(room);
            io.to(room).emit("notify", { user:userId, left_from:group_id});
            socket.emit("leave_group_success", { member });
            logger.info("User left group", { userId, group_id });
        } catch (err:any) {
            logger.error("leave_group error", { stack:err.stack });
            emitSocketError(socket, "leave_group", err.message);
        }
    });

    socket.on("group_msg", async(payload:GroupMessagePayload) => {
        try {
            const { group_id, limit, page } = payload;

            //Validation
            if(!group_id){
                emitSocketError(socket, "group_msg", "group_id is required");
                return;
            }
            if(isNaN(group_id)){
                emitSocketError(socket, "group_msg", "Invalid group_id");
                return;
            }
            if(limit != undefined || page != undefined){
                if(limit && isNaN(limit)){
                    emitSocketError(socket, "group_msg", "Invalid limit");
                    return;
                }
                if(page && isNaN(page)){
                    emitSocketError(socket, "group_msg", "Invalid page");
                    return;
                }
            }

            const messages = await groupService.getGroupMessages(userId, group_id, limit, page);
            socket.emit("group_msg_list", { group_id, messages });
            logger.info("User got group messages", { userId, group_id });
        } catch (err:any) {
            logger.error("group_msg_error", { stack:err.stack });
            emitSocketError(socket, "group_msg", err.message);
        }
    });
}