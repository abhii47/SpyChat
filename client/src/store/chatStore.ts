import { create } from "zustand"
import type { Message } from "../types"

interface ChatStore {
    messages:Record<string, Message[]>,
    onlineUsers: Set<number>,
    typingUsers: Record<string, number[]>

    setMessages: (roomKey:string, message:Message[]) => void,
    addMessage: (roomKey:string, message:Message) => void,
    removeMessage: (roomKey:string, messageId:number) => void,
    addOnlineUser: (userId:number) => void,
    removeOnlineUser: (userId:number) => void,
    setTyping: (room:string, userId:number, isTyping:boolean) => void,
    isUserOnline: (userId:number) => boolean    
}

export const useChatStore = create<ChatStore>((set,get) => ({
    messages:{},
    onlineUsers:new Set(),
    typingUsers:{},

    setMessages: (roomKey, messages) =>
        set((state) => ({
            messages: {...state.messages, [roomKey]:messages}
        })),

    addMessage: (roomKey, message) =>
        set((state) => ({
            messages:{
                ...state.messages,
                [roomKey]:[message, ...state.messages[roomKey]]
            }
        })),

    removeMessage: (roomKey, messageId) => 
        set((state) => ({
            messages:{
                ...state.messages,
                [roomKey]:(state.messages[roomKey] || []).filter(
                    (m) => m.message_id !== messageId
                ),
            },
        })),

    addOnlineUser: (userId) => 
        set((state) => ({
            onlineUsers: new Set([...state.onlineUsers, userId]),
        })),

    removeOnlineUser: (userId) =>
        set((state) => {
            const next = new Set(state.onlineUsers)
            next.delete(userId)
            return { onlineUsers: next }
        }),

    setTyping: (room, userId, isTyping) =>
        set((state) => {
            const current = state.typingUsers[room] || []
            const updated = isTyping
                ? [...new Set([...current, userId])]
                : current.filter((id) => id !== userId)
            return { typingUsers: { ...state.typingUsers, [room]: updated } }
        }),

    isUserOnline: (userId) => get().onlineUsers.has(userId),
}))