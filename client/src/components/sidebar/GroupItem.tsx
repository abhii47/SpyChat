import { useUiStore } from "../../store/uiStore";
import type { GroupListItem } from "../../types";
import Avatar from "../ui/Avatar";
import { formatDistanceToNow } from 'date-fns'

interface Props {
    groupItem: GroupListItem
}

const GroupItem = ({ groupItem }:Props) => {
    const { activeChat, setActiveChat } = useUiStore()
    const { group, last_message, unread_count } = groupItem

    const isActive = activeChat?.type === 'group' &&
                     activeChat?.id === group.group_id

    const getLastMessagePreview = () => {
        if(!last_message) return 'No messages yet'
        if (last_message.type === 'media') return '📷 Photo'
        const preview = last_message.content
        return preview.length > 20 ? preview.slice(0, 20) + '...' : preview
    }

    return(
        <div 
            onClick={() => setActiveChat({ type: 'group', id: group.group_id })}
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
        <Avatar
            src={group.avatar}
            name={group.name}
            size="md"
        />
        <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white truncate">
                {group.name}
            </span>

            {last_message && (
                <span className="text-xs text-slate-500 flex-shrink-0 ml-1">
                {formatDistanceToNow(
                    new Date(last_message.created_at),
                    { addSuffix: false }
                )}
                </span>
            )}
            </div>

            <div className="flex items-center justify-between mt-0.5">
            <span className="text-xs text-slate-400 truncate">
                {getLastMessagePreview()}
            </span>

            {unread_count > 0 && (
                <span className="
                flex-shrink-0 ml-1
                min-w-[18px] h-[18px]
                bg-blue-500 rounded-full
                text-[10px] font-bold text-white
                flex items-center justify-center px-1
                ">
                {unread_count > 99 ? '99+' : unread_count}
                </span>
            )}
            </div>
        </div>
    </div>
    )
} 

export default GroupItem