import ChatWindow from "../components/chat/ChatWindow"
import Sidebar from "../components/sidebar/Sidebar"
import ConnectionBanner from "../components/ui/ConnectionBanner"
import { useUiStore } from "../store/uiStore"
import { ArrowLeft } from 'lucide-react'

const ChatPage = () => {
  const { activeChat, setActiveChat } = useUiStore()

  return (
    <>
    {/* Connection status — top pe float karta hai */}
    <ConnectionBanner />
    <div
      className="flex h-[100svh] overflow-hidden bg-slate-950"
    >
      {/* Sidebar */}
      <div className={`
        w-full md:w-80 md:flex-shrink-0 border-r border-slate-700/50
        ${activeChat ? 'hidden md:block' : 'block'}
      `}>
        <Sidebar />
      </div>  
      {/* Chat Window */}
      <div className={`min-w-0 flex-1 overflow-hidden flex-col
          ${activeChat ? 'flex' : 'hidden md:flex'}
      `}>
        {activeChat ? (
          <div className="flex min-h-0 flex-col h-full">
              {/**
               * Mobile back button
               * Desktop pe nahi dikhega (md:hidden)
               */}
              <div className="flex items-center gap-2 px-3 py-2
                              border-b border-slate-700/50 md:hidden">
                <button
                  onClick={() => setActiveChat(null)}
                  className="p-1.5 text-slate-400 hover:text-white
                             rounded-lg hover:bg-slate-800"
                  title="Back"
                >
                  <ArrowLeft size={20} />
                </button>
              </div>
              <ChatWindow activeChat={activeChat} />
            </div>
        ) : (
              <EmptyState />
        )}
      </div>
      
    </div>
    </>
  )
}

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center
                  h-full text-slate-500 select-none">
    <div className="w-24 h-24 rounded-full bg-slate-800/80
                    flex items-center justify-center mb-5">
      <svg className="w-12 h-12 opacity-30" fill="none"
           viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round"
              strokeWidth={1.2}
              d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75
                 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375
                 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375
                 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994
                 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183
                 a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498
                 c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123
                 -2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392
                 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25
                 6.741v6.018z" />
      </svg>
    </div>
    <p className="text-xl font-semibold text-slate-400 mb-1">
      Your messages
    </p>
    <p className="text-sm text-center max-w-xs leading-relaxed">
      Search for a user to start chatting,
      or select an existing conversation
    </p>
  </div>
)

export default ChatPage
