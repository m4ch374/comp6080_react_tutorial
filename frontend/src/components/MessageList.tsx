import { useEffect, useState, useRef, useCallback } from 'react'
import { userApi, type Message, type User } from '../../utils/api'
import MessageItem from './MessageItem'

interface MessageListProps {
  channelId: number
  currentUserId: number
  messages: Message[]
  onMessageUpdate: (
    updatedMessage?: Message,
    action?: 'add' | 'update' | 'delete'
  ) => void
}

const MessageList = ({
  channelId,
  currentUserId,
  messages,
  onMessageUpdate,
}: MessageListProps) => {
  const [userCache, setUserCache] = useState<Record<number, User>>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const lastMessageCountRef = useRef(0)
  const pendingUserRequestsRef = useRef<Record<number, Promise<User>>>({})

  // Reset user cache when channel changes
  useEffect(() => {
    setUserCache({})
    lastMessageCountRef.current = 0
  }, [channelId])

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

  // Scroll to bottom when messages first load or when new messages arrive (if user is near bottom)
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    // If this is the first load (no previous messages), scroll to bottom
    if (lastMessageCountRef.current === 0 && messages.length > 0) {
      requestAnimationFrame(() => {
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      })
    } else if (messages.length > 0) {
      // For subsequent messages, only scroll if user is near bottom
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
    }

    lastMessageCountRef.current = messages.length
  }, [messages.length])

  return (
    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pb-48">
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
              onMessageUpdate={onMessageUpdate}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MessageList
