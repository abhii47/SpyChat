import z from "zod";
import { useAuthStore } from "../../store/authStore";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { logout } from "../../api/authApi";
import { disconnectSocket } from "../../socket/socketInstance";
import { updateProfile } from "../../api/userApi";
import Avatar from '../ui/Avatar'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { X, Camera, LogOut } from 'lucide-react'

const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name too long'),
  email: z
    .email('Invalid email format'),
})

type ProfileForm = z.infer<typeof profileSchema>

interface Props {
    onClose:() => void
}

const ProfilePanel = ({ onClose }:Props) => {
    const { user, setAuth, clearAuth } = useAuthStore()

    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    
    const {
        register,
        handleSubmit,
        formState:{ errors, isDirty }, 
    } = useForm<ProfileForm>({
        resolver:zodResolver(profileSchema),
        defaultValues:{
            name:user?.name || '',
            email: user?.email || '',
        },
    })

    const handleAvatarChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if(!file) return

        if(file.size > 5 * 1024 * 1024){
            toast.error('Image must be less than 5MB')
            return
        }

        setAvatarFile(file)
        setAvatarPreview(URL.createObjectURL(file))
    }

    const onSubmit = async(data:ProfileForm) => {
        if(!isDirty && !avatarFile) {
            toast('Nothing to update')
            return
        }
        
        setIsUpdating(true)

        try {
            const formData = new FormData()
            formData.append('name', data.name)
            formData.append('email', data.email)
            if (avatarFile) {
                formData.append('avatar', avatarFile)
            }

            const updatedUser = await updateProfile(formData)

            setAuth(updatedUser, useAuthStore.getState().accessToken!)

            toast.success('Profile updated!')
            setAvatarFile(null)
            setAvatarPreview(null)
            onClose()
            
        } catch (err:any) {
            toast.error(err.response?.data?.message || 'Update failed')
        } finally {
            setIsUpdating(false)
        }
    }

    const handleLogout = async () => {
        setIsLoggingOut(true)
        try {
        await logout()
        } catch {
        // Fail ho toh bhi local clear karo
        } finally {
        disconnectSocket()
        clearAuth()
        }
    }

    return (
        <div
      className="fixed inset-0 z-50 flex"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Panel */}
      <div className="ml-auto w-full max-w-sm h-full
                      bg-slate-900 border-l border-slate-700
                      flex flex-col shadow-2xl
                      animate-slide-in-right">

        {/* Header */}
        <div className="flex items-center justify-between p-4
                        border-b border-slate-700">
          <h2 className="text-base font-semibold text-white">
            My Profile
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white
                       rounded-lg hover:bg-slate-800"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Avatar section */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Avatar
                src={avatarPreview || user?.avatar || null}
                name={user?.name || 'User'}
                size="xl"
                isOnline={true}
              />

              {/* Camera button */}
              <label
                htmlFor="profile-avatar"
                className="absolute bottom-0 right-0
                           w-8 h-8 bg-blue-600 rounded-full
                           flex items-center justify-center
                           cursor-pointer hover:bg-blue-500
                           border-2 border-slate-900"
              >
                <Camera size={14} className="text-white" />
              </label>
              <input
                id="profile-avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                aria-label="Upload profile avatar"
              />
            </div>

            <div className="text-center">
              <p className="font-semibold text-white">{user?.name}</p>
              <p className="text-sm text-slate-400">{user?.email}</p>
            </div>
          </div>

          {/* Edit form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            id="profile-form"
          >
            <Input
              label="Full Name"
              type="text"
              placeholder="Your name"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              error={errors.email?.message}
              {...register('email')}
            />
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 space-y-2">
          <Button
            type="submit"
            form="profile-form"
            isLoading={isUpdating}
            title="Save changes"
          >
            Save Changes
          </Button>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2
                       py-2.5 rounded-xl border border-red-500/30
                       text-red-400 hover:bg-red-500/10
                       transition-colors text-sm font-medium
                       disabled:opacity-50"
          >
            {isLoggingOut ? (
              <div className="w-4 h-4 border-2 border-red-400
                              border-t-transparent rounded-full animate-spin" />
            ) : (
              <LogOut size={16} />
            )}
            Logout
          </button>
        </div>
      </div>
    </div>
    )
}

export default ProfilePanel