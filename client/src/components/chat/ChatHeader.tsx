import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";
import { useConvStore } from "../../store/convStore";
import { useGroupStore } from "../../store/groupStore";
import type { ActiveChat } from "../../types";
import Avatar from "../ui/Avatar";
import { Info } from 'lucide-react'
import GroupDetailsModal from "../group/GroupDetailModal";

interface Props{
    activeChat:ActiveChat
}

const ChatHeader = ({ activeChat }:Props) => {
    const { user } = useAuthStore()
    const { conversations } = useConvStore()
    const { groups } = useGroupStore()
    const [showDetails, setShowDetails] = useState(false)
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

        return (
            <div className="flex items-center gap-3 px-4 py-3
                            border-b border-slate-700/50
                            bg-slate-900/50 backdrop-blur-sm">
                <Avatar
                    src={otherUser.avatar}
                    name={otherUser.name}
                    size="md"
                    isOnline={online}
                />
                <div>
                    <p className="text-sm font-semibold text-white">
                        {otherUser.name}
                    </p>
                    <p className={`text-xs ${online ? 'text-green-400' : 'text-slate-500'}`}>
                        {online ? 'Online' : 'Offline'}
                    </p>
                </div>
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
        <div className="flex items-center gap-3 px-4 py-3
                        border-b border-slate-700/50
                        bg-slate-900/50">
            <Avatar
                src={groupItem.group.avatar}
                name={groupItem.group.name}
                size="md"
            />
            <div>
                <p className="text-sm font-semibold text-white">
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