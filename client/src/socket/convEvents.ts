import { Socket } from "socket.io-client";
import { useConvStore } from "../store/convStore";
import { useUiStore } from "../store/uiStore";
import { useChatStore } from "../store/chatStore";


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
        if(data.conversation_id && !data.message_id){
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
}