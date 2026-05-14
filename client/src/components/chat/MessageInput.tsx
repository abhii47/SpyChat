import { useState, useRef, useCallback } from 'react'
import { getSocket } from '../../socket/socketInstance'
import { uploadMedia } from '../../api/messageApi'
import { Send, Paperclip, X } from 'lucide-react'
import toast from 'react-hot-toast'
import type { ActiveChat, MessageMedia } from '../../types'

interface Props {
  activeChat: ActiveChat
}

const MessageInput = ({ activeChat }: Props) => {
  const [content, setContent] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const typingTimerRef = useRef<ReturnType<typeof setTimeout>>(0)

  const emitTyping = useCallback((isTyping: boolean) => {
    const socket = getSocket()
    if (!socket) return

    socket.emit('typing', {
      id: activeChat.id,
      isGroup: activeChat.type === 'group',
      isTyping,
    })
  }, [activeChat])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)

    // Typing indicator
    emitTyping(true)

    // Previous timer clear karo
    clearTimeout(typingTimerRef.current)

    // 1.5 sec baad typing stop emit karo
    typingTimerRef.current = setTimeout(() => {
      emitTyping(false)
    }, 1500)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Max 5 files
    if (mediaFiles.length + files.length > 5) {
      toast.error('Maximum 5 files allowed')
      return
    }

    // Size check
    const oversized = files.find((f) => f.size > 10 * 1024 * 1024)
    if (oversized) {
      toast.error('Each file must be less than 10MB')
      return
    }

    setMediaFiles((prev) => [...prev, ...files])

    // Preview URLs banao
    const previews = files.map((f) => URL.createObjectURL(f))
    setMediaPreviews((prev) => [...prev, ...previews])
  }

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index))
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSend = async () => {
    if (!content.trim() && mediaFiles.length === 0) return

    const socket = getSocket()
    if (!socket) {
      toast.error('Not connected. Please refresh.')
      return
    }

    setIsSending(true)
    emitTyping(false)

    try {
      let uploadedMedia: MessageMedia[] | undefined

      // Media files hain → pehle upload karo
      if (mediaFiles.length > 0) {
        const roomType = activeChat.type
        const uploaded = await uploadMedia(mediaFiles, roomType, activeChat.id)
        uploadedMedia = uploaded
      }

      const payload: any = {
        content: content.trim(),
        type: uploadedMedia ? 'media' : 'text',
      }

      if (activeChat.type === 'conversation') {
        payload.conversation_id = activeChat.id
      } else {
        payload.group_id = activeChat.id
      }

      if (uploadedMedia) {
        payload.media = uploadedMedia
      }

      socket.emit('send_message', payload)

      // Input clear karo
      setContent('')
      setMediaFiles([])
      setMediaPreviews([])
      if (fileInputRef.current) fileInputRef.current.value = ''

    } catch (err: any) {
      toast.error('Failed to send message. Try again.')
      console.error('Send message error:', err)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const canSend = (content.trim() || mediaFiles.length > 0) && !isSending

  return (
    <div className="border-t border-slate-700/50 p-3"
         style={{ backgroundColor: 'var(--color-chat-sidebar)' }}>

      {/* Media previews */}
      {mediaPreviews.length > 0 && (
        <div className="flex gap-2 mb-3 flex-wrap">
          {mediaPreviews.map((preview, index) => (
            <div key={index} className="relative">
              {mediaFiles[index]?.type.startsWith('image/') ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-slate-700
                                flex items-center justify-center">
                  <span className="text-2xl">📎</span>
                </div>
              )}

              {/* Remove button */}
              <button
                onClick={() => removeMedia(index)}
                className="absolute -top-1.5 -right-1.5
                           w-5 h-5 bg-red-500 rounded-full
                           flex items-center justify-center
                           hover:bg-red-400"
                title="Remove"
              >
                <X size={10} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2">

        {/* Attachment button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-slate-400 hover:text-blue-400
                     transition-colors duration-150 flex-shrink-0"
          title="Attach file"
        >
          <Paperclip size={20} />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          placeholder='Attach files'
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Text area */}
        <textarea
          value={content}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send)"
          rows={1}
          className="
            flex-1 bg-slate-800 text-white text-sm
            rounded-xl px-4 py-2.5
            border border-slate-700 focus:border-blue-500
            outline-none resize-none
            placeholder:text-slate-500
            transition-colors duration-200
            max-h-32 overflow-y-auto
          "
          style={{
            // Auto resize textarea
            height: 'auto',
            minHeight: '42px',
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement
            target.style.height = 'auto'
            target.style.height = Math.min(target.scrollHeight, 128) + 'px'
          }}
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`
            p-2.5 rounded-xl flex-shrink-0
            transition-all duration-150
            ${canSend
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }
          `}
        >
          {isSending ? (
            <div className="w-5 h-5 border-2 border-white
                            border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
    </div>
  )
}

export default MessageInput