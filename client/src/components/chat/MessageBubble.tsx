import { useState } from "react";
import { getSocket } from "../../socket/socketInstance";
import { useAuthStore } from "../../store/authStore";
import type { Message } from "../../types";
import Avatar from "../ui/Avatar";
import { format } from 'date-fns'
import { Trash2 } from 'lucide-react'

interface Props {
    message: Message
}

const MessageBubble = ({ message }: Props) => {
    const { user } = useAuthStore()
    const [showDelete, setShowDelete] = useState(false)

    const isOwn = message.sender_id === user?.user_id;

    const handleDelete = () => {
        const socket = getSocket()
        if(!socket) return

        socket.emit('delete_message', { message_id: message.message_id })
        setShowDelete(false)
    }

    return (
        <div
            className={`flex items-end gap-2 group
                        ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
            onMouseEnter={() => setShowDelete(true)}
            onMouseLeave={() => setShowDelete(false)}
        >
            {/* Other user's Avatar */}
            {!isOwn && (
                <Avatar 
                    src={message.sender?.avatar}
                    name={message.sender?.name || 'User'}
                    size="sm"
                />
            )}

            {/* Bubble */}
            <div className={`
                px-4 py-2.5 rounded-2xl
                ${isOwn
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-slate-700 text-white rounded-bl-sm'
                }
            `}>

                {/* Text message */}
                {message.type === 'text' && (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                    </p>
                )}

                {/* Media message */}
                {message.type === 'media' && message.media && (
                    <div className="space-y-2">
                        {/* Text bhi hai toh dikhao */}
                        {message.content && (
                            <p className="text-sm leading-relaxed">
                                {message.content}
                            </p>
                        )}

                    {message.media.map((item, index) => (
                        <div key={index}>
                            {item.type === 'image' ? (
                                    <a                
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={item.url}
                                            alt="Media"
                                            className="max-w-full rounded-xl
                                                    max-h-64 object-cover
                                                    hover:opacity-90 transition-opacity"
                                        />
                                    </a>
                                ) : (
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2
                                                    bg-white/10 rounded-lg px-3 py-2
                                                    hover:bg-white/20 transition-colors"
                                    >
                                        <span className="text-lg">📎</span>
                                        <span className="text-sm truncate max-w-[180px]">
                                            {item.url.split('/').pop()}
                                        </span>
                                    </a>
                            )}
                        </div>
                    ))}
                    </div>
                )}
            </div>

            {/* Time + delete button */}
            <div className={`
                flex items-center gap-2 mt-1 px-1
                ${isOwn ? 'flex-row-reverse' : 'flex-row'}
            `}>
                <span className="text-[10px] text-slate-500">
                    {format(new Date(message.created_at), 'HH:mm')}
                </span>

                {/* Delete — sirf apna message, hover pe */}
                {isOwn && showDelete && (
                    <button
                        onClick={handleDelete}
                        className="text-slate-500 hover:text-red-400
                                    transition-colors duration-150"
                        title="Delete message"
                    >
                        <Trash2 size={12} />
                    </button>
                )}
            </div>
        </div>
    )
}

export default MessageBubble