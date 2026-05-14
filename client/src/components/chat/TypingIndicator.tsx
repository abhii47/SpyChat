import { useAuthStore } from "../../store/authStore";
import { useChatStore } from "../../store/chatStore";
import { useConvStore } from "../../store/convStore";
// import { useGroupStore } from "../../store/groupStore";
import type { ActiveChat } from "../../types";

interface Props {
    activeChat: ActiveChat
    roomKey: string
}

const TypingIndicator = ({ activeChat, roomKey }:Props) => {
    const { user } = useAuthStore()
    const { conversations } = useConvStore()
    // const { groups } = useGroupStore()
    const { typingUsers } = useChatStore()

    const typingUsersIds = typingUsers[roomKey] || []

    if(typingUsersIds.length === 0) return null

    const getTypingName = (userId:number) => {
        if(activeChat.type === 'conversation'){
            const conv = conversations.find(
                (c) => c.conversation_id === activeChat.id
            )
            const member = conv?.members.find((m) => m.user.user_id === userId)
            return member?.user.name || 'Someone'
        }
        return 'Someone'
    }

    const names = typingUsersIds.filter(
        (id) => id !== user?.user_id
    ).map(getTypingName)

    if(names.length === 0) return null

    return (
        <div className="flex items-center gap-2 px-4 py-1">
            {/* Animated dots */}
            <div className="flex items-center gap-1 bg-slate-700
                            rounded-full px-3 py-2">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                        style={{
                        animation: 'typing-bounce 1.2s infinite',
                        animationDelay: `${i * 0.2}s`,
                        }}
                    />
                ))}
            </div>
            <span className="text-xs text-slate-500">
                {names.join(', ')} {names.length === 1 ? 'is' : 'are'} typing...
            </span>
        </div>
    )
}

export default TypingIndicator