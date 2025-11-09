import { useState, useEffect } from 'react'
import { messageApi, type Message } from '../../utils/api'
import MessageItem from './MessageItem'
import { Pin, X } from 'lucide-react'

interface PinnedMessagesViewProps {
  channelId: number
  currentUserId: number
  onClose: () => void
}

const PinnedMessagesView = ({
  channelId,
  currentUserId,
  onClose,
}: PinnedMessagesViewProps) => {
  const [pinnedMessages, setPinnedMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        setLoading(true)
        // Fetch messages in batches to find all pinned messages
        let allMessages: Message[] = []
        let start = 0
        let hasMore = true

        while (hasMore) {
          const response = await messageApi.getMessages(channelId, start)
          const messages = response.messages
          allMessages = [...allMessages, ...messages]

          // Filter pinned messages
          const pinned = messages.filter(m => m.pinned)
          setPinnedMessages(prev => {
            const existingIds = new Set(prev.map(m => m.id))
            return [...prev, ...pinned.filter(m => !existingIds.has(m.id))]
          })

          // If we got less than 25 messages, we've reached the end
          if (messages.length < 25) {
            hasMore = false
          } else {
            start += 25
          }
        }
      } catch (error) {
        console.error('Failed to fetch pinned messages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllMessages()
  }, [channelId])

  const handleMessageUpdate = () => {
    // Refresh pinned messages
    const fetchAllMessages = async () => {
      try {
        let allMessages: Message[] = []
        let start = 0
        let hasMore = true

        while (hasMore) {
          const response = await messageApi.getMessages(channelId, start)
          const messages = response.messages
          allMessages = [...allMessages, ...messages]

          if (messages.length < 25) {
            hasMore = false
          } else {
            start += 25
          }
        }

        setPinnedMessages(allMessages.filter(m => m.pinned))
      } catch (error) {
        console.error('Failed to refresh pinned messages:', error)
      }
    }
    fetchAllMessages()
  }

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pin className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Pinned Messages
            </h2>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              ({pinnedMessages.length})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-zinc-500 dark:text-zinc-400">
                Loading pinned messages...
              </div>
            </div>
          ) : pinnedMessages.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center text-zinc-500 dark:text-zinc-400">
                <Pin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No pinned messages</p>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {pinnedMessages.map(message => (
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
      </div>
    </div>
  )
}

export default PinnedMessagesView
