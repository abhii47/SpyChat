import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import type { ActiveChat } from '../../types'

interface Props {
  activeChat: ActiveChat
}

const ChatWindow = ({ activeChat }: Props) => {
  return (
    <div className="flex flex-col h-full">
      <ChatHeader activeChat={activeChat} />
      <MessageList activeChat={activeChat} />
      <MessageInput activeChat={activeChat} />
    </div>
  )
}

export default ChatWindow