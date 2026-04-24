import { Server, Socket } from "socket.io";
import { redis } from "../config/redis";
import { User } from "../models";

export const statusHandler = (io:Server, socket:Socket) => {
    const userId:number = (socket as any).user.id;

    const setOnline = async() => {
        await redis.set(`Online:${userId}`, socket.id, "EX", 60 * 60 * 24);  //24 hours
        socket.broadcast.emit("user_online", { userId });
    };

    const setoffline = async() => {
        await redis.del(`Online.${userId}`);
        await User.update({ last_seen:new Date() },{ where:{ user_id:userId } });
        socket.broadcast.emit("user_offline", { userId, last_seen:new Date() });
    };

    setOnline();

    socket.on("disconnect", () => {
        setoffline();
    });
}