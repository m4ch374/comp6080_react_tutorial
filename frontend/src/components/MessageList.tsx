import { useEffect, useState, useRef, useCallback } from 'react'
import { messageApi, userApi, type Message, type User } from '../../utils/api'
import MessageItem from './MessageItem'

interface MessageListProps {
  channelId: number
  currentUserId: number
  onMessageUpdate?: () => void
  onAddMessageRef?: (callback: (message: Message) => void) => void
}

const MessageList = ({
  channelId,
  currentUserId,
  onMessageUpdate,
  onAddMessageRef,
}: MessageListProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [userCache, setUserCache] = useState<Record<number, User>>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const lastMessageCountRef = useRef(0)
  const pendingUserRequestsRef = useRef<Record<number, Promise<User>>>({})

  const ensureUser = useCallback(
    async (userId: number) => {
      const cachedUser = userCache[userId]
      if (cachedUser) {
        return cachedUser
      }

      if (!pendingUserRequestsRef.current[userId]) {
        pendingUserRequestsRef.current[userId] = userApi
          .getDetails(userId)
          .then(userData => {
            setUserCache(prev => ({
              ...prev,
              [userId]: userData,
            }))
            delete pendingUserRequestsRef.current[userId]
            return userData
          })
          .catch(error => {
            delete pendingUserRequestsRef.current[userId]
            throw error
          })
      }

      return pendingUserRequestsRef.current[userId]
    },
    [userCache]
  )

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
        setMessages(prev => {
          if (prev.some(msg => msg.id === updatedMessage.id)) {
            return prev
          }
          return [...prev, updatedMessage]
        })
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

  const handleAddMessage = useCallback((newMessage: Message) => {
    setMessages(prev => {
      if (prev.some(msg => msg.id === newMessage.id)) {
        return prev
      }
      return [...prev, newMessage]
    })

    requestAnimationFrame(() => {
      const container = scrollContainerRef.current
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    })
  }, [])

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
              sender={userCache[message.sender]}
              ensureUser={ensureUser}
              onMessageUpdate={handleMessageUpdate}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MessageList
