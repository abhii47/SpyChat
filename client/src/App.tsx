import { useEffect } from 'react'
import './App.css'
import { useAuthStore } from './store/authStore'
import { getMe, refresh } from './api/authApi'
import { connectSocket } from './socket/socketInstance'
import { Toaster } from 'react-hot-toast'
import AppRouter from './router/AppRouter'

function App() {
  
  useEffect(() => {
      const init = async () => {
        try {
          const token = await refresh()
          useAuthStore.getState().setToken(token)
          const user = await getMe()
          useAuthStore.getState().setAuth(user, token)
          connectSocket(token)
        } catch {
          useAuthStore.getState().clearAuth()
        }
      }

      init()
  }, [])

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155',
          },
        }}
      />
      <AppRouter />
    </>
  )
}

export default App
