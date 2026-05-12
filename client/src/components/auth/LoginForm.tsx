import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"
import { loginSchema, type LoginFormData } from "../../utils/validation"
import { connectSocket } from '../../socket/socketInstance'
import { login } from '../../api/authApi'
import toast from 'react-hot-toast'
import Input from '../ui/Input'
import Button from '../ui/Button'

const LoginForm = () => {
    const navigate = useNavigate()
    const { setAuth } = useAuthStore()

    const {
        register,
        handleSubmit,
        formState:{ errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver:zodResolver(loginSchema),
    })

    const onSubmit = async (data:LoginFormData) => {
        try {
            const response = await login(data.email, data.password)

            setAuth(response.user, response.accessToken)

            connectSocket(response.accessToken)

            toast.success(`welcome back ${response.user.name}!`)

            navigate('/')
        } catch (err:any) {
            const message = err.response?.data?.message || 'Login failed, Try again.'
            toast.error(message)
        }
    }

    return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
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
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      {/* Submit button */}
      <Button
        type="submit"
        isLoading={isSubmitting}
        className="mt-2"
      >
        Sign In
      </Button>
    </form>
  )
}

export default LoginForm