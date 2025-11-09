import { useState, useEffect, useTransition, useCallback } from 'react'
import {
  channelApi,
  userApi,
  messageApi,
  type Channel,
  type User,
  type Message,
  type ChannelBasic,
} from '../../utils/api'
import {
  Edit2,
  Save,
  X,
  Lock,
  Globe,
  UserPlus,
  LogOut,
  Calendar,
  User as UserIcon,
  Pin,
} from 'lucide-react'
import MessageItem from './MessageItem'

interface ChannelDetailsProps {
  channelId: number
  onChannelChange?: (channel: ChannelBasic) => void
}

const ChannelDetails = ({
  channelId,
  onChannelChange,
}: ChannelDetailsProps) => {
  const [channel, setChannel] = useState<Channel | null>(null)
  const [creator, setCreator] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [isPending, startTransition] = useTransition()
  const [showPinnedMessages, setShowPinnedMessages] = useState(false)
  const [pinnedMessages, setPinnedMessages] = useState<Message[]>([])
  const [loadingPinned, setLoadingPinned] = useState(false)
  const userId = parseInt(localStorage.getItem('userId') || '0', 10)

  const emitChannelChange = useCallback(
    (channelData: Channel) => {
      if (!onChannelChange) {
        return
      }
      onChannelChange({
        id: channelId,
        name: channelData.name,
        creator: channelData.creator,
        private: channelData.private,
        members: channelData.members,
      })
    },
    [channelId, onChannelChange]
  )

  useEffect(() => {
    const fetchChannelDetails = async () => {
      try {
        const channelData = await channelApi.getDetails(channelId)
        setChannel(channelData)
        setEditName(channelData.name)
        setEditDescription(channelData.description)
        emitChannelChange(channelData)

        // Fetch creator details
        try {
          const creatorData = await userApi.getDetails(channelData.creator)
          setCreator(creatorData)
        } catch (error) {
          console.error('Failed to fetch creator:', error)
        }
      } catch (error) {
        console.error('Failed to fetch channel details:', error)
      }
    }

    fetchChannelDetails()
  }, [channelId, emitChannelChange])

  useEffect(() => {
    if (showPinnedMessages && channel?.members.includes(userId)) {
      const fetchPinnedMessages = async () => {
        try {
          setLoadingPinned(true)
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
          console.error('Failed to fetch pinned messages:', error)
        } finally {
          setLoadingPinned(false)
        }
      }

      fetchPinnedMessages()
    } else if (!showPinnedMessages) {
      // Reset pinned messages when modal closes
      setPinnedMessages([])
    }
  }, [showPinnedMessages, channelId, channel?.members, userId])

  const handleMessageUpdate = () => {
    if (showPinnedMessages) {
      const fetchPinnedMessages = async () => {
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
      fetchPinnedMessages()
    }
  }

  const isMember = channel?.members.includes(userId) ?? false

  const handleSave = async () => {
    if (!channel) return

    startTransition(async () => {
      try {
        await channelApi.update(channelId, {
          name: editName.trim(),
          description: editDescription.trim(),
        })
        setIsEditing(false)
        // Refresh channel details
        const updatedChannel = await channelApi.getDetails(channelId)
        setChannel(updatedChannel)
        emitChannelChange(updatedChannel)
      } catch (error) {
        console.error('Failed to update channel:', error)
      }
    })
  }

  const handleJoin = async () => {
    startTransition(async () => {
      try {
        await channelApi.join(channelId)
        // Refresh channel details
        const updatedChannel = await channelApi.getDetails(channelId)
        setChannel(updatedChannel)
        emitChannelChange(updatedChannel)
      } catch (error) {
        console.error('Failed to join channel:', error)
      }
    })
  }

  const handleLeave = async () => {
    startTransition(async () => {
      try {
        await channelApi.leave(channelId)
        // Refresh channel details
        const updatedChannel = await channelApi.getDetails(channelId)
        setChannel(updatedChannel)
        emitChannelChange(updatedChannel)
      } catch (error) {
        console.error('Failed to leave channel:', error)
      }
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!channel) {
    return (
      <div className="px-4 py-2 text-xs text-zinc-500 dark:text-zinc-400">
        Loading channel details...
      </div>
    )
  }

  if (!isMember) {
    return (
      <div
        id="channel-details-container"
        className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {channel.private ? (
              <Lock className="h-4 w-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
            ) : (
              <Globe className="h-4 w-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {channel.name}
              </h2>
              {channel.description && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  {channel.description}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleJoin}
            disabled={isPending}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
          >
            <UserPlus className="h-3.5 w-3.5" />
            {isPending ? 'Joining...' : 'Join'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      id="channel-details-container"
      className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
    >
      {!isEditing ? (
        <>
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {channel.private ? (
                <Lock className="h-4 w-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
              ) : (
                <Globe className="h-4 w-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  {channel.name}
                </h2>
                {channel.description && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {channel.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setShowPinnedMessages(true)}
                className="p-1.5 text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 rounded-md hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                title="View pinned messages"
              >
                <Pin className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Edit channel"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleLeave}
                disabled={isPending}
                className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Leave channel"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span className="truncate">{formatDate(channel.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <UserIcon className="h-3 w-3" />
              <span className="truncate">
                {creator?.name || `User ${channel.creator}`}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {channel.private ? (
                <>
                  <Lock className="h-3 w-3" />
                  <span>Private</span>
                </>
              ) : (
                <>
                  <Globe className="h-3 w-3" />
                  <span>Public</span>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2 mb-2">
            <div>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="Channel name"
                className="w-full px-2.5 py-1.5 text-sm border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              />
            </div>
            <div>
              <textarea
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                placeholder="Description"
                rows={2}
                className="w-full px-2.5 py-1.5 text-sm border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 resize-none"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsEditing(false)
                setEditName(channel.name)
                setEditDescription(channel.description)
              }}
              className="flex-1 px-3 py-1.5 text-xs border border-zinc-300 dark:border-zinc-600 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isPending || !editName.trim()}
              className="flex-1 px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              {isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </>
      )}

      {/* Pinned Messages Modal */}
      {showPinnedMessages && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPinnedMessages(false)}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pin className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  Pinned Messages
                </h2>
                {pinnedMessages.length > 0 && (
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    ({pinnedMessages.length})
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowPinnedMessages(false)}
                className="p-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {loadingPinned ? (
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
                      currentUserId={userId}
                      onMessageUpdate={handleMessageUpdate}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChannelDetails
