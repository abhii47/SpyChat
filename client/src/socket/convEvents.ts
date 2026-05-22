import { Socket } from "socket.io-client";
import { useConvStore } from "../store/convStore";
import { useUiStore } from "../store/uiStore";
import { useChatStore } from "../store/chatStore";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";


export const registerConvEvents = (socket:Socket) => {
    socket.on('join_conv_success', ({ conversation, isNew }:any) => {
        if(isNew){
            useConvStore.getState().addConversation(conversation);
        }
        useUiStore.getState().setActiveChat({
            type:'conversation',
            id:conversation.conversation_id
        })
    });

    socket.on('notify', (data:any) => {
        if(data.type === 'conversation_created'){
            useConvStore.getState().addConversation(data.conversation)
        }
    })

    socket.on('conv_list', ({ conversations }:any) => {
        useConvStore.getState().setConversations(conversations)
    })

    socket.on('conv_msg', ({ conversation_id, messages }:any) => {
        const roomKey = `conv_${conversation_id}`;
        useChatStore.getState().setMessages(roomKey, messages)
    })

    socket.on("conversation_cleared", ({ conversation_id, cleared_by }:any) => {
        const roomKey = `conv_${conversation_id}`;
        const activeChat = useUiStore.getState().activeChat;
        const currentUser = useAuthStore.getState().user;

        useConvStore.getState().removeConversation(conversation_id);
        useChatStore.getState().clearMessages(roomKey);

        if(activeChat?.type === 'conversation' && activeChat.id === conversation_id){
            useUiStore.getState().setActiveChat(null);
        }

        if(currentUser?.user_id === cleared_by){
            toast.success('Conversation cleared');
        } else {
            toast('Conversation was cleared');
        }
    })

}
