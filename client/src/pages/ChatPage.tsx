import Sidebar from "../components/sidebar/Sidebar"
import { useUiStore } from "../store/uiStore"

const ChatPage = () => {
  const { activeChat } = useUiStore()

  return (
    <div
      className="flex h-screen overflow-hidden bg-slate-950"
    >
      {/* Sidebar — fixed width */}
      <div className="w-80 flex-shrink-0 border-r border-slate-700/50">
        <Sidebar />
      </div>  
      {/* Chat Window — baaki sari space */}
      <div className="flex-1">
        {activeChat ? (
          /* Phase 4 mein ChatWindow aayega */
          <div className="flex items-center justify-center h-full text-white">
            <p>
              {activeChat.type === 'conversation'
                ? `Conversation #${activeChat.id}`
                : `Group #${activeChat.id}`
              } — Chat window Phase 4 mein banega
            </p>
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center
                          h-full text-slate-500">
            <div className="w-20 h-20 rounded-full bg-slate-800
                            flex items-center justify-center mb-4">
              <svg className="w-10 h-10 opacity-40"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75
                         0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375
                         0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0
                         .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6
                         1.123 2.994 2.707 3.227 1.087.16 2.185.283
                         3.293.369V21l4.184-4.183a1.14 1.14 0
                         01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233
                         2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995
                         -2.707-3.228A48.394 48.394 0 0012 3c-2.392
                         0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25
                         6.741v6.018z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-slate-400">
              Select a chat to start messaging
            </p>
            <p className="text-sm mt-1">
              Choose from your conversations or groups
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatPage