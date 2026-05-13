import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { registerSchema, type RegisterFormData } from '../../utils/validation'
import { register as registerApi } from '../../api/authApi'
import Input from '../ui/Input'
import Button from '../ui/Button'

const RegisterForm = () => {
  const navigate = useNavigate()
  const [avatarFile, setAvatarFile]       = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // File size check — 5MB max
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
      return
    }

    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('email', data.email)
      formData.append('password', data.password)

      if (avatarFile) {
        formData.append('avatar', avatarFile)
      }

      await registerApi(formData)

      toast.success('Account created! Please login.')
      navigate('/login')

    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed.'
      toast.error(message)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      {/* Avatar Upload */}
      <div className="flex flex-col items-center gap-2">
        <label htmlFor="avatar" className="cursor-pointer group">
          <div className={`
            w-20 h-20 rounded-full
            border-2 border-dashed border-slate-600
            group-hover:border-blue-500
            transition-colors duration-200
            flex items-center justify-center
            overflow-hidden
            ${avatarPreview ? '' : 'bg-slate-800'}
          `}>
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-1">
                {/* Camera icon */}
                <svg className="w-8 h-8 text-slate-500 group-hover:text-blue-400"
                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
                <span className="text-xs text-slate-500">Photo</span>
              </div>
            )}
          </div>
        </label>

        {/* Hidden file input */}
        <input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
        />

        <p className="text-xs text-slate-500">
          Click to upload photo (optional)
        </p>
      </div>

      {/* Name field */}
      <Input
        label="Full Name"
        type="text"
        placeholder="Abhi Rajpurohit"
        error={errors.name?.message}
        {...register('name')}
      />

      {/* Email field */}
      <Input
        label="Email"
        type="email"
        placeholder="abhi@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      {/* Password field */}
      <Input
        label="Password"
        type="password"
        placeholder="Min 8 chars with number"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" isLoading={isSubmitting} className="mt-2">
        Create Account
      </Button>
    </form>
  )
}

export default RegisterForm