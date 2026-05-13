import { useAuthStore } from "../../store/authStore"
import { useChatStore } from "../../store/chatStore"
import { useUiStore } from "../../store/uiStore"
import type { Conversation } from "../../types"
import Avatar from "../ui/Avatar"
import { formatDistanceToNow } from 'date-fns'

interface Props {
    conversation:Conversation
}

const ConversationItem = ({ conversation }:Props) => {
    const { user } = useAuthStore()
    const { isUserOnline } = useChatStore()
    const { activeChat, setActiveChat } = useUiStore()

    const otherMember = conversation.members.find(
        (m) => m.user.user_id !== user?.user_id
    )
    const otherUser =   otherMember?.user

    if(!otherUser) return null

    const isOnline = isUserOnline(otherUser.user_id)
    const isActive = activeChat?.type === 'conversation' &&
                     activeChat?.id === conversation.conversation_id

    const getLastMessagePreview = () => {
        const msg = conversation.lastMessage
        if (!msg) return 'No messages yet'
        if (msg.type === 'media') return '📷 Photo'
        return msg.content.length > 20
            ? msg.content.slice(0, 20) + '...'
            : msg.content
    }

    const handleClick = () => {
        setActiveChat({ type: 'conversation', id: conversation.conversation_id })
    }

    return (
        <div
            onClick={handleClick}
            className={`
                flex items-center gap-3 px-3 py-3
                rounded-xl cursor-pointer
                transition-colors duration-150
                ${isActive
                    ? 'bg-blue-600/20 border border-blue-600/30'
                    : 'hover:bg-slate-800/50'
                }
            `}
        >
            {/* Avatar with online indicator */}
            <Avatar
                src={otherUser.avatar}
                name={otherUser.name}
                size="md"
                isOnline={isOnline}
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white truncate">
                        {otherUser.name}
                    </span>

                    {/* Time */}
                    {conversation.lastMessage && (
                        <span className="text-xs text-slate-500 flex-shrink-0 ml-1">
                            {formatDistanceToNow(
                                new Date(conversation.lastMessage.created_at),
                                { addSuffix: false }
                            )}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs text-slate-400 truncate">
                        {getLastMessagePreview()}
                    </span>

                    {/* Unread badge */}
                    {conversation.unread_count > 0 && (
                        <span className="
                            flex-shrink-0 ml-1
                            min-w-[18px] h-[18px]
                            bg-blue-500 rounded-full
                            text-[10px] font-bold text-white
                            flex items-center justify-center px-1
                        ">
                        {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ConversationItem