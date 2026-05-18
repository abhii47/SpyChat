import { useEffect, useState } from "react"
import { getSocket } from "../../socket/socketInstance"
import { Wifi, WifiOff } from "lucide-react"

const  ConnectionBanner = () => {
    const [status, setStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('connected')
    const [showReconnected, setShowReconnected] = useState(false)

    useEffect(() => {
        const socket = getSocket()
        if(!socket) return

        const onDisconnect = () => setStatus('disconnected')

        const onReconnecting = () => setStatus('reconnecting')

        const onConnect = () => {
            setStatus('connected')
            setShowReconnected(true)
            setTimeout(() => setShowReconnected(false), 3000)
        }

        socket.on('disconnect', onDisconnect)
        socket.on('reconnect_attempt', onReconnecting)
        socket.on('connect', onConnect)

        return () => {
            socket.off('disconnect', onDisconnect)
            socket.off('reconnect_attempt', onReconnecting)
            socket.off('connect', onConnect)
        }
    }, [])

    if(status === 'connected' && !showReconnected) return null

    return (
        <div className={`fixed top-0 left-0 right-0
            z-[100] flex items-center justify-center
            gap-2, py-2 text-sm font-medium
            transition-all duration-300
            ${status === 'disconnected'
                ? 'bg-red-500/90 text-white'
                : status === 'reconnecting'
                ? 'bg-yellow-500/90 text-black' 
                : 'bg-green-600/90 text-white'
            }
        `}>
            {status === 'disconnected' && (
                <>
                    <WifiOff size={15} />
                    No internet Connection
                </>
            )}
            {status === 'reconnecting' && (
                <>
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent
                                    rounded-full animate-spin" />
                    Reconnecting....
                </>
            )}
            {showReconnected && status === 'connected' && (
                <>
                    <Wifi size={15} />
                    Connected
                </>
            )}
        </div>
    )
}

export default ConnectionBanner