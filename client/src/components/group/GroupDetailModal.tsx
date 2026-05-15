import { useState, useEffect } from 'react'
import { getSocket } from '../../socket/socketInstance'
import { getGroupDetail } from '../../api/groupApi'
import { searchUsers } from '../../api/userApi'
import { useAuthStore } from '../../store/authStore'
import { useGroupStore } from '../../store/groupStore'
// import { useUiStore } from '../../store/uiStore'
import Avatar from '../ui/Avatar'
import { X, Search, UserPlus, UserMinus, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import type { GroupDetail, SearchUser } from '../../types'

interface Props {
  groupId: number
  onClose: () => void
}

const GroupDetailsModal = ({ groupId, onClose }: Props) => {
  const { user } = useAuthStore()
  const { groups } = useGroupStore()
//   const { setActiveChat } = useUiStore()

  const [details, setDetails]       = useState<GroupDetail | null>(null)
  const [isLoading, setIsLoading]   = useState(true)
  const [addQuery, setAddQuery]     = useState('')
  const [addResults, setAddResults] = useState<SearchUser[]>([])
  const [isSearching, setIsSearching] = useState(false)

  /**
   * Current user ka role nikalo
   */
  console.log(isSearching);
  const myGroupItem = groups.find((g) => g.group.group_id === groupId)
  const isAdmin = myGroupItem?.role === 'admin'

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getGroupDetail(groupId)
        setDetails(data)
      } catch (err:any) {
        toast.error('Failed to load group details', err)
        onClose()
      } finally {
        setIsLoading(false)
      }
    }
    fetchDetails()
  }, [groupId])

  // Search users to add
  const handleAddSearch = async (q: string) => {
    setAddQuery(q)
    if (!q.trim()) {
      setAddResults([])
      return
    }

    setIsSearching(true)
    try {
      const data = await searchUsers(q.trim(), 8, 0)
      // Already members ko exclude karo
      const memberIds = details?.members.map((m) => m.user_id) || []
      const filtered = (data.users || []).filter(
        (u) => !memberIds.includes(u.user_id)
      )
      setAddResults(filtered)
    } catch {
      setAddResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddMember = (userId: number) => {
    const socket = getSocket()
    if (!socket) return
    socket.emit('add_member', { group_id: groupId, user_id: userId })
    setAddQuery('')
    setAddResults([])
    toast.success('Member added!')
    onClose()
  }

  const handleRemoveMember = (userId: number, name: string) => {
    const socket = getSocket()
    if (!socket) return
    socket.emit('remove_member', { group_id: groupId, user_id: userId })
    toast.success(`${name} removed`)
    onClose()
  }

  const handleLeaveGroup = () => {
    const socket = getSocket()
    if (!socket) return
    socket.emit('leave_group', { group_id: groupId })
    onClose()
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center"
           style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
        <div className="w-8 h-8 border-2 border-blue-500
                        border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!details) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-md bg-slate-900 rounded-2xl
                      border border-slate-700 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-4
                        border-b border-slate-700">
          <h2 className="text-base font-semibold text-white">
            Group Details
          </h2>
          <button onClick={onClose}
                  title='Close'
                  className="p-1 text-slate-400 hover:text-white
                             rounded-lg hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">

          {/* Group info */}
          <div className="flex items-center gap-3">
            <Avatar
              src={details.avatar}
              name={details.name}
              size="lg"
            />
            <div>
              <p className="font-semibold text-white">{details.name}</p>
              {details.description && (
                <p className="text-sm text-slate-400">{details.description}</p>
              )}
              <p className="text-xs text-slate-500 mt-0.5">
                {details.members.length} members · Created by {details.admin.name}
              </p>
            </div>
          </div>

          {/* Add member — sirf admin */}
          {isAdmin && (
            <div>
              <p className="text-sm text-slate-400 font-medium mb-2">
                Add Member
              </p>
              <div className="relative">
                <Search size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={addQuery}
                  onChange={(e) => handleAddSearch(e.target.value)}
                  placeholder="Search to add..."
                  className="w-full pl-8 pr-4 py-2 bg-slate-800 text-white
                             text-sm rounded-xl border border-slate-700
                             focus:border-blue-500 outline-none
                             placeholder:text-slate-500"
                />
              </div>

              {addResults.length > 0 && (
                <div className="mt-1 bg-slate-800 border border-slate-700
                                rounded-xl overflow-hidden">
                  {addResults.map((u) => (
                    <button
                      key={u.user_id}
                      onClick={() => handleAddMember(u.user_id)}
                      className="w-full flex items-center gap-3 px-3 py-2
                                 hover:bg-slate-700 text-left"
                    >
                      <Avatar src={u.avatar} name={u.name} size="sm" />
                      <span className="text-sm text-white flex-1">{u.name}</span>
                      <UserPlus size={14} className="text-blue-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Members list */}
          <div>
            <p className="text-sm text-slate-400 font-medium mb-2">
              Members
            </p>
            <div className="space-y-1">
              {details.members.map((member) => {
                const isSelf = member.user_id === user?.user_id
                const isMemberAdmin = member.role === 'admin'

                return (
                  <div
                    key={member.group_member_id}
                    className="flex items-center gap-3 px-2 py-2
                               rounded-xl hover:bg-slate-800/50"
                  >
                    <Avatar
                      src={member.avatar}
                      name={member.name}
                      size="sm"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white truncate">
                          {member.name}
                          {isSelf && (
                            <span className="text-slate-500"> (You)</span>
                          )}
                        </span>
                        {isMemberAdmin && (
                          <span className="text-[10px] bg-yellow-500/20
                                           text-yellow-400 px-1.5 py-0.5
                                           rounded-full font-medium">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Remove button — admin can remove non-admin non-self */}
                    {isAdmin && !isSelf && !isMemberAdmin && (
                      <button
                        onClick={() => handleRemoveMember(member.user_id, member.name)}
                        className="p-1.5 text-slate-500 hover:text-red-400
                                   hover:bg-red-400/10 rounded-lg
                                   transition-colors"
                        title="Remove member"
                      >
                        <UserMinus size={14} />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer — Leave group */}
        {!isAdmin && (
          <div className="p-4 border-t border-slate-700">
            <button
              onClick={handleLeaveGroup}
              className="w-full flex items-center justify-center gap-2
                         py-2.5 rounded-xl border border-red-500/30
                         text-red-400 hover:bg-red-500/10
                         transition-colors text-sm font-medium"
            >
              <LogOut size = {16} />
              Leave Group
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default GroupDetailsModal