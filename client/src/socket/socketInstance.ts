// src/socket/socketInstance.ts

import { io, Socket } from 'socket.io-client'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import type { SocketError } from '../types'
import { registerConvEvents } from './convEvents'
import { registerStatusEvents } from './statusEvents'
import { registerChatEvents } from './chatEvents'

let socket: Socket | null = null

export const connectSocket = (token: string): Socket => {
  if (socket?.connected) socket.disconnect()

  socket = io(
    import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000',
    {
      auth:  { token },    // frontend clients ke liye
      query: { token },    // backend dono check karta hai
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    }
  )

  socket.on('connect', () => {
    console.log('Socket connected')
    registerStatusEvents(socket!)
    registerConvEvents(socket!)
    registerChatEvents(socket!)
  })

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason)
    if (reason === 'io server disconnect') socket?.connect()
  })

  socket.on('connect_error', async (err:any) => {
    const code = err?.data?.code
    if (code === 'TOKEN_EXPIRED') {
      try {
        const { refresh } = await import('../api/authApi')
        const newToken = await refresh()
        useAuthStore.getState().setToken(newToken)
        if (socket) {
          socket.auth = { token: newToken }
          socket.connect()
        }
      } catch {
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
      }
    }
    if (code === 'TOKEN_INVALID' || code === 'TOKEN_MISSING') {
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
    }
  })

  socket.on('error', (err: SocketError) => {
    toast.error(err.message || 'Something went wrong')
  })

  return socket
}

export const disconnectSocket = () => {
  socket?.disconnect()
  socket = null
}

export const getSocket = (): Socket | null => socket