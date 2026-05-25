import { Socket } from "socket.io-client";
import type { Message } from "../types";
import { useChatStore } from "../store/chatStore";
import { useUiStore } from "../store/uiStore";
import { useConvStore } from "../store/convStore";
import { useGroupStore } from "../store/groupStore";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

export const registerChatEvents = (socket:Socket) => {
    socket.on('new_message', (payload) => {
        const message:Message = {
            ...payload.message,
            sender: payload.message.sender || {
                user_id: payload.sender_id,
                name: payload.sender_name,
                avatar: payload.sender_image,
            },
        }
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

        if (isActiveRoom && activeChat) {
            socket.emit('mark_all_read', {
                roomId: activeChat.id,
                roomType: activeChat.type
            });
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

    socket.on('messages_read', ({ roomId, roomType }) => {
        if (roomType === 'conversation') {
            useConvStore.getState().resetUnread(roomId);
        } else {
            useGroupStore.getState().resetUnread(roomId);
        }
    })

    socket.on('notify', (data:any) => {
        if(data.message_id && data.room){
            const roomKey = data.room
                .replace('room_conv_', 'conv_')
                .replace('room_group_', 'group_')

            useChatStore.getState().removeMessage(roomKey, data.message_id)
        }
    })

    socket.on('message_cleared', ({ conversation_id, cleared_by }:any) => {
        const roomKey = `conv_${conversation_id}`
        const currentUser = useAuthStore.getState().user

        useChatStore.getState().clearMessages(roomKey)
        useConvStore.getState().clearLastMessage(conversation_id)

        if(currentUser?.user_id === cleared_by){
            toast.success('Messages cleared')
        } else {
            toast('Messages were cleared')
        }
    })
}
