import { Socket } from "socket.io";
import logger from "../utils/logger";
import { emitSocketError } from "../utils/socketError";
import userService from "../services/userService";

type SearchPayload = {
    query:string,
    limit?:number,
    offset?:number
}
type SearchGroupPayload = {
    query:string,
    limit?:number,
    page?:number
}

export const searchhandler = (socket:Socket) => {
    const userId = (socket as any).user.id;

    socket.on("search", async(payload:SearchPayload) => {
        try {
            const { query, limit=10, offset=0 } = payload;

            //Validation
            if(!query || query.trim().length === 0){
                emitSocketError(socket, "search", "query is required");
                return;
            }
            if(limit && isNaN(Number(limit))){
                emitSocketError(socket, "search", "Invalid limit");
                return;
            }
            if(offset && isNaN(Number(offset))){
                emitSocketError(socket, "search", "Invalid page");
                return;
            }

            const result = await userService.searchUsers(query.trim(),userId,limit,offset);
            socket.emit("search_result", { query:query.trim(), result });
            logger.info("User searched", { userId, query });
        } catch (err:any) {
            logger.error("search error", { stack:err.stack });
            emitSocketError(socket, "search", err.message);
        }
    });

    socket.on("search_group", async(payload:SearchGroupPayload) => {
        try {
            const { query, limit=10, page=1 } = payload;

            //Validation
            if(!query || query.trim().length === 0){
                emitSocketError(socket, "search_group", "query is required");
                return;
            }
            if(limit && isNaN(Number(limit))){
                emitSocketError(socket, "search_group", "Invalid limit");
                return;
            }
            if(page && isNaN(Number(page))){
                emitSocketError(socket, "search_group", "Invalid page");
                return;
            }

            const result = await userService.searchGroups(query.trim(),userId,limit,page);
            socket.emit("search_group_result", { query:query.trim(), result });
            logger.info("User searched groups", { userId, query });
        } catch (err:any) {
            logger.error("search_group_error", { stack:err.stack });
            emitSocketError(socket, "search_group", err.message);
        }
    });
}