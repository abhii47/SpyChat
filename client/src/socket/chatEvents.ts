import { Socket } from "socket.io-client";
import type { Message } from "../types";
import { useChatStore } from "../store/chatStore";
import { useUiStore } from "../store/uiStore";
import { useConvStore } from "../store/convStore";
import { useGroupStore } from "../store/groupStore";

export const registerChatEvents = (socket:Socket) => {
    socket.on('new_message', (message:Message) => {
        const roomKey = message.conversation_id
            ? `conv_${message.conversation_id}`
            : `group_${message.group_id}`
            
        useChatStore.getState().addMessage(roomKey, message);

        const activeChat = useUiStore.getState().activeChat
        const isActiveRoom = 
            activeChat?.type === 'conversation'
                ? activeChat.id === message.conversation_id
                : activeChat?.id === message.group_id

        if(message.conversation_id) {
            useConvStore.getState().updateLastMessage(message.conversation_id, message)

            if(!isActiveRoom){
                useConvStore.getState().incrementUnread(message.conversation_id)
            }
        }

        if (message.group_id) {
            useGroupStore.getState().updateLastMessage(message.group_id, message)
            
            if (!isActiveRoom) {
                useGroupStore.getState().incrementUnread(message.group_id)
            }
        }
    })

    socket.on('typing', ({userId, isTyping}) => {
        const activeChat = useUiStore.getState().activeChat
        if(!activeChat) return

        const room = activeChat.type === 'conversation'
            ? `conv_${activeChat.id}`
            : `group_${activeChat.id}`
        
        useChatStore.getState().setTyping(room, userId, isTyping)
    })

    socket.on('message_read', ({message_id, read_by}) => {
        console.log(`Message ${message_id} read by ${read_by}`)
    })

    socket.on('notify', (data:any) => {
        if(data.message_id && data.room){
            const roomKey = data.room
                .replace('room_conv_', 'conv_')
                .replace('room_group_', 'group_')

            useChatStore.getState().removeMessage(roomKey, data.message_id)
        }
    })
}