import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useConvStore } from '../../store/convStore'
import { useGroupStore } from '../../store/groupStore'
import { useUiStore } from '../../store/uiStore'
import { getMyConversations } from '../../api/convApi'
import { getGroups } from '../../api/groupApi'
import { disconnectSocket } from '../../socket/socketInstance'
import Avatar from '../ui/Avatar'
import ConversationItem from './ConversationItem'
import GroupItem from './GroupItem'
import { MessageSquare, Users, LogOut } from 'lucide-react'

const Sidebar = () => {
  const { user, clearAuth } = useAuthStore()
  const { conversations, setConversations } = useConvStore()
  const { groups, setGroups } = useGroupStore()
  const { sidebarTab, setSidebarTab } = useUiStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [convs, grps] = await Promise.all([
          getMyConversations(),
          getGroups(),
        ])
        setConversations(convs)
        setGroups(grps)
      } catch (err) {
        console.error('Failed to fetch sidebar data:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleLogout = async () => {
    try {
      const { logout } = await import('../../api/authApi')
      await logout()
    } catch {
      // logout fail ho toh bhi local clear karo
    } finally {
      disconnectSocket()
      clearAuth()
    }
  }

  return (
    <div
      className="flex flex-col h-full bg-slate-800"
    >
      {/* Header */}
      <div className="flex h-11 items-center justify-center px-3 border-b border-slate-700/50 bg-slate-900/30">
        <h1
          className="m-0 font-['Times_New_Roman'] text-lg leading-none font-bold tracking-wide text-zinc-200"
        >
          SpyChat
        </h1>
      </div>

      {/* Tab Switcher */}
      <div className="flex p-2 gap-1 border-b border-slate-700/50">
        <button
          onClick={() => setSidebarTab('conversations')}
          className={`
            flex-1 flex items-center justify-center gap-2
            py-2 rounded-lg text-sm font-medium
            transition-colors duration-150
            ${sidebarTab === 'conversations'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }
          `}
        >
          <MessageSquare size={15} />
          Chats
          {/* Total unread badge */}
          {conversations.reduce((sum, c) => sum + c.unread_count, 0) > 0 && (
            <span className="bg-red-500 text-white text-[10px]
                             rounded-full min-w-[16px] h-4
                             flex items-center justify-center px-1">
              {conversations.reduce((sum, c) => sum + c.unread_count, 0)}
            </span>
          )}
        </button>

        <button
          onClick={() => setSidebarTab('groups')}
          className={`
            flex-1 flex items-center justify-center gap-2
            py-2 rounded-lg text-sm font-medium
            transition-colors duration-150
            ${sidebarTab === 'groups'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }
          `}
        >
          <Users size={15} />
          Groups
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {isLoading ? (
          /* Skeleton loader */
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-700 rounded animate-pulse w-24" />
                <div className="h-2 bg-slate-700 rounded animate-pulse w-36" />
              </div>
            </div>
          ))
        ) : sidebarTab === 'conversations' ? (
          conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center
                            h-40 text-slate-500 text-sm">
              <MessageSquare size={32} className="mb-2 opacity-40" />
              <p>No conversations yet</p>
              <p className="text-xs mt-1">Search users to start chatting</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <ConversationItem
                key={conv.conversation_id}
                conversation={conv}
              />
            ))
          )
        ) : (
          groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center
                            h-40 text-slate-500 text-sm">
              <Users size={32} className="mb-2 opacity-40" />
              <p>No groups yet</p>
              <p className="text-xs mt-1">Create a group to get started</p>
            </div>
          ) : (
            groups.map((groupItem) => (
              <GroupItem
                key={groupItem.group.group_id}
                groupItem={groupItem}
              />
            ))
          )
        )}
      </div>

      {/* Profile Footer */}
      <div className="p-3 border-t border-slate-700/50
                      flex items-center gap-3">
        <Avatar
          src={user?.avatar || null}
          name={user?.name || 'User'}
          size="sm"
          isOnline={true}
        />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {user?.name}
          </p>
          <p className="text-xs text-slate-400 truncate">
            {user?.email}
          </p>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-slate-400
                     hover:text-red-400 hover:bg-red-400/10
                     transition-colors duration-150"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  )
}

export default Sidebar
