import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getSocket } from '../../socket/socketInstance'
import { uploadGroupAvatar } from '../../api/groupApi'
import { searchUsers } from '../../api/userApi'
import { useAuthStore } from '../../store/authStore'
import Avatar from '../ui/Avatar'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { X, Search, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import type { SearchUser } from '../../types'

const createGroupSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name too long'),
  description: z.string().max(200, 'Description too long').optional(),
})

type CreateGroupForm = z.infer<typeof createGroupSchema>

interface Props {
  onClose: () => void
}

const CreateGroupModal = ({ onClose }: Props) => {
  const { user } = useAuthStore()

  // Avatar
  const [avatarFile, setAvatarFile]       = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
//   const [avatarUrl, setAvatarUrl]         = useState<string>('')

  // Member search
  const [memberQuery, setMemberQuery]       = useState('')
  const [memberResults, setMemberResults]   = useState<SearchUser[]>([])
  const [selectedMembers, setSelectedMembers] = useState<SearchUser[]>([])
  const [isSearching, setIsSearching]       = useState(false)
  const [isCreating, setIsCreating]         = useState(false)

//   const debounceRef = useState<ReturnType<typeof setTimeout>>()[0] 
  console.log(isSearching);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGroupForm>({
    resolver: zodResolver(createGroupSchema),
  })

  // Avatar change
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
      return
    }

    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  // Member search
  const handleMemberSearch = async (q: string) => {
    setMemberQuery(q)
    if (!q.trim()) {
      setMemberResults([])
      return
    }

    setIsSearching(true)
    try {
      const data = await searchUsers(q.trim(), 8, 0)
      const filtered = (data.users || []).filter(
        (u) =>
          u.user_id !== user?.user_id &&
          !selectedMembers.find((m) => m.user_id === u.user_id)
      )
      setMemberResults(filtered)
    } catch {
      setMemberResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const addMember = (member: SearchUser) => {
    setSelectedMembers((prev) => [...prev, member])
    setMemberResults((prev) => prev.filter((u) => u.user_id !== member.user_id))
    setMemberQuery('')
  }

  const removeMember = (userId: number) => {
    setSelectedMembers((prev) => prev.filter((m) => m.user_id !== userId))
  }

  const onSubmit = async (data: CreateGroupForm) => {
    if (selectedMembers.length === 0) {
      toast.error('Add at least one member')
      return
    }

    const socket = getSocket()
    if (!socket) return

    setIsCreating(true)

    try {
      let uploadedAvatarUrl = ''
      if (avatarFile) {
        uploadedAvatarUrl = await uploadGroupAvatar(avatarFile)
        toast.success('Avatar uploaded!')
      }

      socket.emit('create_group', {
        name: data.name,
        description: data.description || '',
        avatarUrl: uploadedAvatarUrl,
        memberIds: selectedMembers.map((m) => m.user_id),
      })
      
      onClose()

    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create group')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    /* Modal Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Modal */}
      <div className="w-full max-w-md bg-slate-900 rounded-2xl
                      border border-slate-700 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-4
                        border-b border-slate-700">
          <h2 className="text-base font-semibold text-white">
            Create Group
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white
                       rounded-lg hover:bg-slate-800"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">

          {/* Avatar */}
          <div className="flex justify-center">
            <label htmlFor="group-avatar" className="cursor-pointer">
              <div className="w-16 h-16 rounded-full border-2
                              border-dashed border-slate-600
                              hover:border-blue-500 transition-colors
                              flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Group"
                       className="w-full h-full object-cover" />
                ) : (
                  <Plus size={24} className="text-slate-500" />
                )}
              </div>
            </label>
            <input
              id="group-avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} id="create-group-form">
            <div className="space-y-3">
              <Input
                label="Group Name"
                placeholder="MCA Batch 2024"
                error={errors.name?.message}
                {...register('name')}
              />
              <Input
                label="Description (optional)"
                placeholder="What's this group about?"
                error={errors.description?.message}
                {...register('description')}
              />
            </div>
          </form>

          {/* Member Search */}
          <div>
            <label className="text-sm text-slate-400 font-medium">
              Add Members
            </label>

            <div className="relative mt-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                value={memberQuery}
                onChange={(e) => handleMemberSearch(e.target.value)}
                placeholder="Search users to add..."
                className="w-full pl-8 pr-4 py-2 bg-slate-800 text-white
                           text-sm rounded-xl border border-slate-700
                           focus:border-blue-500 outline-none
                           placeholder:text-slate-500"
              />
            </div>

            {/* Search results */}
            {memberResults.length > 0 && (
              <div className="mt-1 bg-slate-800 border border-slate-700
                              rounded-xl overflow-hidden">
                {memberResults.map((u) => (
                  <button
                    key={u.user_id}
                    type="button"
                    onClick={() => addMember(u)}
                    className="w-full flex items-center gap-3 px-3 py-2
                               hover:bg-slate-700 text-left"
                  >
                    <Avatar src={u.avatar} name={u.name} size="sm" />
                    <span className="text-sm text-white">{u.name}</span>
                    <Plus size={14} className="ml-auto text-slate-400" />
                  </button>
                ))}
              </div>
            )}

            {/* Selected members */}
            {selectedMembers.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedMembers.map((m) => (
                  <div
                    key={m.user_id}
                    className="flex items-center gap-1.5 bg-blue-600/20
                               border border-blue-600/30 rounded-full
                               px-2.5 py-1"
                  >
                    <Avatar src={m.avatar} name={m.name} size="sm" />
                    <span className="text-xs text-white">{m.name}</span>
                    <button
                      type="button"
                      onClick={() => removeMember(m.user_id)}
                      className="text-slate-400 hover:text-red-400 ml-0.5"
                      title="Remove member"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {selectedMembers.length > 0 && (
              <p className="text-xs text-slate-500 mt-2">
                {selectedMembers.length} member{selectedMembers.length > 1 ? 's' : ''} selected
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <Button
            type="submit"
            form="create-group-form"
            isLoading={isCreating}
          >
            Create Group
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateGroupModal