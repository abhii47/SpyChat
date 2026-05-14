import { useEffect, useRef, useState, useCallback } from 'react'
import { useChatStore } from '../../store/chatStore'
import { useConvStore } from '../../store/convStore'
import { useGroupStore } from '../../store/groupStore'
import { getMessage } from '../../api/messageApi'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import type { ActiveChat } from '../../types'

interface Props {
  activeChat: ActiveChat
}

const MessageList = ({ activeChat }: Props) => {
  const { messages, setMessages } = useChatStore()
  const { resetUnread: resetConvUnread } = useConvStore()
  const { resetUnread: resetGroupUnread } = useGroupStore()

  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const roomKey = activeChat.type === 'conversation'
    ? `conv_${activeChat.id}`
    : `group_${activeChat.id}`

  const roomMessages = messages[roomKey] || []

  useEffect(() => {
    const fetchInitialMessages = async () => {
      setIsLoading(true)
      setCurrentPage(1)
      setHasMore(true)

      try {
        const data = await getMessage(
          activeChat.type,
          activeChat.id,
          1,
          20
        )

        setMessages(roomKey, [...data.messages].reverse())
        setHasMore(data.pagination.next_page !== null)

      } catch (err) {
        console.error('Failed to load messages:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialMessages()

    // Unread reset karo — chat open kiya
    if (activeChat.type === 'conversation') {
      resetConvUnread(activeChat.id)
    } else {
      resetGroupUnread(activeChat.id)
    }

  }, [activeChat.id, activeChat.type])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [roomMessages.length])

  const loadMoreMessages = useCallback(async () => {
    if (!hasMore || isLoadingMore) return

    setIsLoadingMore(true)
    const nextPage = currentPage + 1

    try {
      const container = containerRef.current
      const prevScrollHeight = container?.scrollHeight || 0

      const data = await getMessage(
        activeChat.type,
        activeChat.id,
        nextPage,
        20
      )

      const olderMessages = [...data.messages].reverse()

      setMessages(roomKey, [...olderMessages, ...roomMessages])
      setCurrentPage(nextPage)
      setHasMore(data.pagination.next_page !== null)

      requestAnimationFrame(() => {
        if (container) {
          container.scrollTop =
            container.scrollHeight - prevScrollHeight
        }
      })

    } catch (err) {
      console.error('Failed to load more messages:', err)
    } finally {
      setIsLoadingMore(false)
    }
  }, [hasMore, isLoadingMore, currentPage, activeChat, roomMessages])

  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    // Top ke 50px ke andar → load more
    if (container.scrollTop < 50 && hasMore && !isLoadingMore) {
      loadMoreMessages()
    }
  }, [hasMore, isLoadingMore, loadMoreMessages])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500
                        border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">

      {/* Messages scrollable area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
      >
        {/* Load more indicator */}
        {isLoadingMore && (
          <div className="flex justify-center py-2">
            <div className="w-5 h-5 border-2 border-slate-500
                            border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* No more messages */}
        {!hasMore && roomMessages.length > 0 && (
          <p className="text-center text-xs text-slate-600 py-2">
            Beginning of conversation
          </p>
        )}

        {/* Empty state */}
        {roomMessages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center
                          h-full text-slate-600 py-8">
            <p className="text-sm">No messages yet</p>
            <p className="text-xs mt-1">Say hello! 👋</p>
          </div>
        )}

        {/* Message bubbles */}
        {roomMessages.map((message) => (
          <MessageBubble
            key={message.message_id}
            message={message}
          />
        ))}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* Typing indicator */}
      <TypingIndicator activeChat={activeChat} roomKey={roomKey} />
    </div>
  )
}

export default MessageList