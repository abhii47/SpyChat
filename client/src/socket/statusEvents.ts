import type { Socket } from "socket.io-client";
import { useChatStore } from "../store/chatStore";

export const registerStatusEvents = (socket:Socket) => {
    socket.on('user_online', (data) => {
        useChatStore.getState().addOnlineUser(data.userId)
    })

    socket.on('user_offline', (data) => {
        useChatStore.getState().removeOnlineUser(data.userId)
    })
    
}