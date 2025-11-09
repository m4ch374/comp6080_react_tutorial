import { useState, useTransition, useRef, useEffect } from 'react'
import { messageApi } from '../../utils/api'
import { Send } from 'lucide-react'

interface MessageInputProps {
  channelId: number
  onMessageSent: () => void
}

const MessageInput = ({ channelId, onMessageSent }: MessageInputProps) => {
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [message])

  const sendMessage = () => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage || isPending) {
      return
    }

    startTransition(async () => {
      try {
        await messageApi.sendMessage(channelId, {
          message: trimmedMessage,
        })
        setMessage('')
        // Reset textarea height
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'
        }
        onMessageSent()
      } catch (error) {
        console.error('Failed to send message:', error)
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter, but allow Shift+Enter for new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4"
    >
      <div className="relative">
        <textarea
          ref={textareaRef}
          id="message-input"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="w-full px-4 py-4 pr-12 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white/70 dark:bg-zinc-800/70 backdrop-blur-md text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 resize-none overflow-y-auto min-h-[80px] max-h-[200px]"
          disabled={isPending}
        />
        <button
          id="message-send-button"
          type="submit"
          disabled={isPending || !message.trim()}
          className="absolute bottom-4 right-4 p-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          title="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  )
}

export default MessageInput

