import { create } from "zustand";
import type { Conversation, Message } from "../types";

interface ConvState {
    conversations:Conversation[],
    isLoading:boolean,

    //Actions
    setConversations: (convs:Conversation[]) => void
    addConversation: (conv:Conversation) => void
    updateLastMessage: (convId:number, message:Message) => void
    incrementUnread: (convId:number) => void
    resetUnread: (convId:number) => void
}

export const useConvStore = create<ConvState>((set) => ({
    conversations:[],
    isLoading:false,

    setConversations: (convs) => set({ conversations:convs }),

    addConversation: (conv) => 
        set((state) => {
            const exists = state.conversations.find(
                (c) => c.conversation_id === conv.conversation_id
            )
            if(exists) return state
            return { conversations: [conv, ...state.conversations] }
        }),

    updateLastMessage: (convId, message) => 
        set((state) => ({
            conversations: state.conversations.map((c) =>
                c.conversation_id === convId
                    ? { ...c, lastMessage:message, updated_at: message.created_at }
                    : c
            ),
        })),

    incrementUnread: (convId) => 
        set((state) => ({
            conversations:state.conversations.map((c) => 
                c.conversation_id === convId
                    ? { ...c, unread_count: c.unread_count + 1 }
                    : c
                ),
        })),

    resetUnread: (convId) => 
        set((state) => ({
            conversations: state.conversations.map((c) =>
                c.conversation_id === convId
                    ? { ...c, unread_count: 0 }
                    : c
            ),
        })),

}))