import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";
import { useConvStore } from "../../store/convStore";
import { useGroupStore } from "../../store/groupStore";
import type { ActiveChat } from "../../types";
import Avatar from "../ui/Avatar";
import { Info, Trash2 } from 'lucide-react'
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
    const [isClearing, setIsClearing] = useState(false)
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

        const handleClearConversation = async() => {
            const confirmed = window.confirm(`Clear conversation with ${otherUser.name}?`)
            if(!confirmed || isClearing) return

            const socket = getSocket()
            if(!socket?.connected){
                toast.error('Not connected. Please try again.')
                return
            }

            setIsClearing(true)
            socket.once('error', (err:any) => {
                if(err?.event === 'clear_conv'){
                    setIsClearing(false)
                }
            })
            socket.emit('clear_conv', activeChat.id)
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
                    onClick={handleClearConversation}
                    disabled={isClearing}
                    className="p-2 text-slate-400 hover:text-red-300
                            hover:bg-slate-800 rounded-lg transition-colors
                            disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Clear conversation"
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
