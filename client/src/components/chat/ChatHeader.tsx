import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";
import { useConvStore } from "../../store/convStore";
import { useGroupStore } from "../../store/groupStore";
import type { ActiveChat } from "../../types";
import Avatar from "../ui/Avatar";
import { Info, MessageSquareX, Trash2 } from 'lucide-react'
import GroupDetailsModal from "../group/GroupDetailModal";
import toast from "react-hot-toast";
import { getSocket } from "../../socket/socketInstance";

interface Props{
    activeChat:ActiveChat
}

const ChatHeader = ({ activeChat }:Props) => {
    const { user } = useAuthStore()
    const { conversations } = useConvStore()
    const { groups } = useGroupStore()
    const [showDetails, setShowDetails] = useState(false)
    const [pendingAction, setPendingAction] = useState<'messages' | 'conversation' | null>(null)
    const { isUserOnline } = useChatStore()

    // Conversation Header
    if(activeChat.type === 'conversation'){
        const conv = conversations.find(
            (c) => c.conversation_id === activeChat.id
        )
        const otherUser = conv?.members.find(
            (m) => m.user.user_id !== user?.user_id
        )?.user

        if(!otherUser) return null

        const online = isUserOnline(otherUser.user_id)

        const emitConversationAction = (
            event:string,
            successEvent:string,
            action:'messages' | 'conversation'
        ) => {
            const socket = getSocket()
            if(!socket?.connected){
                toast.error('Not connected. Please try again.')
                return
            }

            const onSuccess = ({ conversation_id }:any) => {
                if(conversation_id === activeChat.id){
                    setPendingAction(null)
                    socket.off('error', onError)
                }
            }
            const onError = (err:any) => {
                if(err?.event === event){
                    setPendingAction(null)
                    socket.off(successEvent, onSuccess)
                }
            }

            setPendingAction(action)
            socket.once(successEvent, onSuccess)
            socket.once('error', onError)
            socket.emit(event, activeChat.id)
        }

        const handleClearMessages = () => {
            if(pendingAction) return
            if(window.confirm(`Clear all messages with ${otherUser.name}?`)){
                emitConversationAction('clear_all_message', 'message_cleared', 'messages')
            }
        }

        const handleClearConversation = () => {
            if(pendingAction) return
            if(window.confirm(`Delete conversation with ${otherUser.name}?`)){
                emitConversationAction('clear_conv', 'conversation_cleared', 'conversation')
            }
        }

        return (
            <div className="flex min-w-0 items-center gap-3 px-3 py-2.5 md:px-4 md:py-3
                            border-b border-slate-700/50
                            bg-slate-900/50 backdrop-blur-sm">
                <Avatar
                    src={otherUser.avatar}
                    name={otherUser.name}
                    size="md"
                    isOnline={online}
                />
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                        {otherUser.name}
                    </p>
                    <p className={`text-xs ${online ? 'text-green-400' : 'text-slate-500'}`}>
                        {online ? 'Online' : 'Offline'}
                    </p>
                </div>
                <button
                    onClick={handleClearMessages}
                    disabled={pendingAction !== null}
                    className="p-2 text-slate-400 hover:text-red-300
                            hover:bg-slate-800 rounded-lg transition-colors
                            disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Clear messages"
                >
                    <MessageSquareX size={18} />
                </button>
                <button
                    onClick={handleClearConversation}
                    disabled={pendingAction !== null}
                    className="p-2 text-slate-400 hover:text-red-300
                            hover:bg-slate-800 rounded-lg transition-colors
                            disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete conversation"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        )
    }
    
    // Group Header
    const groupItem = groups.find(
        (g) => g.group.group_id === activeChat.id
    )
    if(!groupItem) return null
    return (
    <>
        <div className="flex min-w-0 items-center gap-3 px-3 py-2.5 md:px-4 md:py-3
                        border-b border-slate-700/50
                        bg-slate-900/50">
            <Avatar
                src={groupItem.group.avatar}
                name={groupItem.group.name}
                size="md"
            />
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                    {groupItem.group.name}
                </p>
                <p className="text-xs text-slate-500">
                    Group · {groupItem.role}
                </p>
            </div>
            {/* Details button */}
            <button
                onClick={() => setShowDetails(true)}
                className="p-2 text-slate-400 hover:text-white
                        hover:bg-slate-800 rounded-lg transition-colors"
                title="Group details"
            >
                <Info size={18} />
            </button>
        </div>
        {/* Modal */}
        {showDetails && (
        <GroupDetailsModal
            groupId={activeChat.id}
            onClose={() => setShowDetails(false)}
        />
        )}
    </>
    )
}

export default ChatHeader
