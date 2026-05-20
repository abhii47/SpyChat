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
import { MessageSquare, Users, LogOut, Plus } from 'lucide-react'
import SearchBar from './SearchBar'
import CreateGroupModal from '../group/CreateGroupModal'
import ProfilePanel from '../profile/ProfilePanel'

const Sidebar = () => {
  const { user, clearAuth } = useAuthStore()
  const { conversations, setConversations } = useConvStore()
  const { groups, setGroups } = useGroupStore()
  const { sidebarTab, setSidebarTab } = useUiStore()
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

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
        <h1 className="m-0 font-['Times_New_Roman'] text-lg leading-none font-bold tracking-wide text-zinc-200">SpyChat</h1>
      </div>
      {/* SearchBar add */}
        <SearchBar />

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

        {/* ✅ Create Group button — Groups tab mein ho toh dikhao */}
        {sidebarTab === 'groups' && (
          <button
            onClick={() => setShowCreateGroup(true)}
            className="p-2 text-slate-400 hover:text-blue-400
                      hover:bg-slate-700/50 rounded-lg
                      transition-colors"
            title="Create Group"
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      {/* Modal */}
      {showCreateGroup && (
        <CreateGroupModal onClose={() => setShowCreateGroup(false)} />
      )}

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
        <button onClick={() => setShowProfile(true)}
                className="w-full flex items-center gap-3
                          hover:bg-slate-800/50 rounded-xl
                          p-2 transition-clors duration-150
                          text-left"
        >
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

          {/* Settings icon */}
          <div className="text-slate-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724
                      1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724
                      1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724
                      1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724
                      1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724
                      1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724
                      1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724
                      1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608
                      2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </button>

        {/* Profile Panel Modal */}
        {showProfile && (
          <ProfilePanel onClose={() => setShowProfile(false)} />
        )}

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
