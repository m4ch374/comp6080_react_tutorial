import { useEffect, useState, useRef, useCallback } from 'react'
import { messageApi, type Message } from '../../utils/api'
import MessageItem from './MessageItem'

interface MessageListProps {
  channelId: number
  currentUserId: number
  onMessageUpdate?: () => void
  onAddMessageRef?: (callback: () => void) => void
}

const MessageList = ({
  channelId,
  currentUserId,
  onMessageUpdate,
  onAddMessageRef,
}: MessageListProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const lastMessageCountRef = useRef(0)

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true)
      const response = await messageApi.getMessages(channelId, 0)
      // Messages are returned in reverse chronological order (newest first)
      // We want to display newest at bottom, so we reverse them
      const newMessages = [...response.messages].reverse()
      setMessages(newMessages)

      // Scroll to bottom after initial load
      requestAnimationFrame(() => {
        const container = scrollContainerRef.current
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      })
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setLoading(false)
    }
  }, [channelId])

  useEffect(() => {
    setMessages([])
    setLoading(true)
    fetchMessages()
  }, [channelId, fetchMessages])

  // Auto-scroll to bottom when new messages arrive (if user is near bottom)
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || messages.length === 0) return

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100

    if (isNearBottom && messages.length > lastMessageCountRef.current) {
      requestAnimationFrame(() => {
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      })
    }

    lastMessageCountRef.current = messages.length
  }, [messages.length])

  const handleMessageUpdate = useCallback(
    (updatedMessage?: Message, action?: 'add' | 'update' | 'delete') => {
      if (action === 'add' && updatedMessage) {
        setMessages(prev => [...prev, updatedMessage])
      } else if (action === 'update' && updatedMessage) {
        setMessages(prev =>
          prev.map(msg => (msg.id === updatedMessage.id ? updatedMessage : msg))
        )
      } else if (action === 'delete' && updatedMessage) {
        setMessages(prev => prev.filter(msg => msg.id !== updatedMessage.id))
      } else {
        // Fallback: refetch messages
        fetchMessages()
      }
      if (onMessageUpdate) {
        onMessageUpdate()
      }
    },
    [fetchMessages, onMessageUpdate]
  )

  const handleAddMessage = useCallback(async () => {
    // Fetch the latest messages to get the newly sent message
    try {
      const response = await messageApi.getMessages(channelId, 0)
      const newMessages = [...response.messages].reverse()
      setMessages(newMessages)

      // Scroll to bottom
      requestAnimationFrame(() => {
        const container = scrollContainerRef.current
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      })
    } catch (error) {
      console.error('Failed to fetch new messages:', error)
    }
  }, [channelId])

  // Expose handleAddMessage to parent
  useEffect(() => {
    if (onAddMessageRef) {
      onAddMessageRef(handleAddMessage)
    }
  }, [onAddMessageRef, handleAddMessage])

  if (loading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </div>
      </div>
    )
  }

  return (
    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pb-32">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-zinc-500 dark:text-zinc-400 text-center">
            <p className="text-lg mb-2">No messages yet</p>
            <p className="text-sm">Be the first to send a message!</p>
          </div>
        </div>
      ) : (
        <div className="py-2">
          {messages.map(message => (
            <MessageItem
              key={message.id}
              message={message}
              channelId={channelId}
              currentUserId={currentUserId}
              onMessageUpdate={handleMessageUpdate}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MessageList
