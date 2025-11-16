import { useState, useEffect, useTransition } from 'react'
import { messageApi, userApi, type Message, type User } from '../../utils/api'
import { Edit2, Trash2, Pin, PinOff, X, Save, MoreVertical } from 'lucide-react'

interface MessageItemProps {
  message: Message
  channelId: number
  currentUserId: number
  onMessageUpdate: (
    updatedMessage?: Message,
    action?: 'add' | 'update' | 'delete'
  ) => void
  sender?: User
  ensureUser?: (userId: number) => Promise<User>
  onUserClick?: (userId: number) => void
}

const REACTIONS = ['👍', '❤️', '😂'] // At least 3 UTF-8 emoji reactions

const MessageItem = ({
  message,
  channelId,
  currentUserId,
  onMessageUpdate,
  sender: initialSender,
  ensureUser,
  onUserClick,
}: MessageItemProps) => {
  const [sender, setSender] = useState<User | null>(initialSender ?? null)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(message.message)
  const [isPending, startTransition] = useTransition()
  const [showActions, setShowActions] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  const isOwnMessage = message.sender === currentUserId

  // Fetch sender details (with caching)
  useEffect(() => {
    let isMounted = true

    if (initialSender) {
      setSender(initialSender)
      return () => {
        isMounted = false
      }
    }

    const fetcher =
      ensureUser ??
      ((userId: number) => {
        return userApi.getDetails(userId)
      })

    fetcher(message.sender)
      .then(userData => {
        if (isMounted) {
          setSender(userData)
        }
      })
      .catch(error => {
        console.error('Failed to fetch sender:', error)
      })

    return () => {
      isMounted = false
    }
  }, [initialSender, ensureUser, message.sender])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleEdit = async () => {
    if (!editText.trim() || editText.trim() === message.message) {
      setIsEditing(false)
      setEditText(message.message)
      return
    }

    startTransition(async () => {
      try {
        await messageApi.updateMessage(channelId, message.id, {
          message: editText.trim(),
        })
        setIsEditing(false)
        // Fetch updated message to get the latest state
        const response = await messageApi.getMessages(channelId, 0)
        const updatedMessage = response.messages.find(m => m.id === message.id)
        if (updatedMessage) {
          onMessageUpdate(updatedMessage, 'update')
        } else {
          onMessageUpdate()
        }
      } catch (error) {
        console.error('Failed to update message:', error)
      }
    })
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this message?')) {
      return
    }

    startTransition(async () => {
      try {
        await messageApi.deleteMessage(channelId, message.id)
        onMessageUpdate(message, 'delete')
      } catch (error) {
        console.error('Failed to delete message:', error)
      }
    })
  }

  const handlePin = async () => {
    startTransition(async () => {
      try {
        if (message.pinned) {
          await messageApi.unpinMessage(channelId, message.id)
        } else {
          await messageApi.pinMessage(channelId, message.id)
        }
        // Fetch updated message to get the latest state
        const response = await messageApi.getMessages(channelId, 0)
        const updatedMessage = response.messages.find(m => m.id === message.id)
        if (updatedMessage) {
          onMessageUpdate(updatedMessage, 'update')
        } else {
          onMessageUpdate()
        }
      } catch (error) {
        console.error('Failed to pin/unpin message:', error)
      }
    })
  }

  const handleReact = async (react: string) => {
    startTransition(async () => {
      try {
        const hasReacted = message.reacts.some(
          r => r.react === react && r.user === currentUserId
        )
        if (hasReacted) {
          await messageApi.unreactToMessage(channelId, message.id, react)
        } else {
          await messageApi.reactToMessage(channelId, message.id, react)
        }
        // Fetch updated message to get the latest state
        const response = await messageApi.getMessages(channelId, 0)
        const updatedMessage = response.messages.find(m => m.id === message.id)
        if (updatedMessage) {
          onMessageUpdate(updatedMessage, 'update')
        } else {
          onMessageUpdate()
        }
      } catch (error) {
        console.error('Failed to react:', error)
      }
    })
  }

  const getReactionCount = (react: string) => {
    return message.reacts.filter(r => r.react === react).length
  }

  const hasUserReacted = (react: string) => {
    return message.reacts.some(
      r => r.react === react && r.user === currentUserId
    )
  }

  const defaultAvatar =
    'https://ui-avatars.com/api/?name=' +
    encodeURIComponent(sender?.name || 'User')

  return (
    <div
      className={`group flex ${isOwnMessage ? 'justify-end' : 'justify-start'} px-4 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors ${message.pinned ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false)
        setShowMoreMenu(false)
      }}
    >
      <div
        className={`flex gap-3 max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {/* Avatar - only show for other users */}
        {!isOwnMessage && (
          <div className="flex-shrink-0">
            <img
              src={sender?.image || defaultAvatar}
              alt={sender?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover"
              onError={e => {
                const target = e.target as HTMLImageElement
                target.src = defaultAvatar
              }}
            />
          </div>
        )}

        {/* Message Content */}
        <div
          className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}
        >
          {!isOwnMessage && (
            <div className="flex items-baseline gap-2 mb-1 px-1">
              <span
                className="message-user-name text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                onClick={e => {
                  e.stopPropagation()
                  if (onUserClick) {
                    onUserClick(message.sender)
                  }
                }}
              >
                {sender?.name || `User ${message.sender}`}
              </span>
            </div>
          )}

          {!isEditing ? (
            <>
              {/* Message Bubble with action bar above */}
              <div className="relative">
                {/* Action bar - appears above message on hover */}
                {showActions && (
                  <div
                    className={`absolute bottom-full mb-1 flex items-center gap-0.5 bg-zinc-800 dark:bg-zinc-900 rounded-md shadow-lg border border-zinc-700 dark:border-zinc-700 px-1.5 py-1 transition-opacity duration-150 z-10 ${
                      isOwnMessage ? 'right-0' : 'right-0 -translate-x-2'
                    }`}
                    onMouseEnter={() => setShowActions(true)}
                  >
                    {/* Reaction buttons */}
                    {REACTIONS.map(react => {
                      const hasReacted = hasUserReacted(react)
                      return (
                        <button
                          key={react}
                          onClick={e => {
                            e.stopPropagation()
                            handleReact(react)
                          }}
                          className={`px-1.5 py-0.5 rounded text-base hover:bg-zinc-700 dark:hover:bg-zinc-800 transition-colors ${
                            hasReacted
                              ? 'underline decoration-blue-500 underline-offset-2'
                              : ''
                          }`}
                          title={react}
                        >
                          {react}
                        </button>
                      )
                    })}

                    {/* Edit button - only for own messages */}
                    {isOwnMessage && (
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          setIsEditing(true)
                        }}
                        className="px-1.5 py-0.5 rounded hover:bg-zinc-700 dark:hover:bg-zinc-800 text-zinc-400 dark:text-zinc-500 hover:text-zinc-300 dark:hover:text-zinc-400 transition-colors"
                        title="Edit message"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    )}

                    {/* More options menu */}
                    <div className="relative">
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          setShowMoreMenu(!showMoreMenu)
                        }}
                        className="px-1.5 py-0.5 rounded hover:bg-zinc-700 dark:hover:bg-zinc-800 text-zinc-400 dark:text-zinc-500 hover:text-zinc-300 dark:hover:text-zinc-400 transition-colors"
                        title="More options"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>

                      {/* Dropdown menu */}
                      {showMoreMenu && (
                        <div
                          className={`absolute ${isOwnMessage ? 'right-0' : 'left-0'} top-full mt-1 min-w-[180px] bg-zinc-800 dark:bg-zinc-900 rounded-md shadow-lg border border-zinc-700 dark:border-zinc-700 py-1 z-50`}
                          onMouseEnter={() => setShowMoreMenu(true)}
                          onMouseLeave={() => setShowMoreMenu(false)}
                        >
                          {/* Pin/Unpin */}
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              handlePin()
                              setShowMoreMenu(false)
                            }}
                            disabled={isPending}
                            className="w-full px-3 py-2 text-left text-sm text-zinc-300 dark:text-zinc-300 hover:bg-zinc-700 dark:hover:bg-zinc-800 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {message.pinned ? (
                              <>
                                <PinOff className="h-4 w-4" />
                                Unpin message
                              </>
                            ) : (
                              <>
                                <Pin className="h-4 w-4" />
                                Pin message
                              </>
                            )}
                          </button>

                          {/* Delete - only for own messages */}
                          {isOwnMessage && (
                            <button
                              onClick={e => {
                                e.stopPropagation()
                                handleDelete()
                                setShowMoreMenu(false)
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-red-400 dark:text-red-400 hover:bg-red-900/20 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete message
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Message bubble */}
                <div
                  className={`rounded-lg px-3 py-1.5 ${
                    isOwnMessage
                      ? 'bg-indigo-600 dark:bg-indigo-600 text-white'
                      : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700'
                  } ${message.pinned ? 'ring-2 ring-yellow-400 dark:ring-yellow-500' : ''}`}
                >
                  <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                    {message.message}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div
                className={`flex items-center gap-2 mt-0.5 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {formatDate(message.sentAt)}
                </span>
                {message.edited && (
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 italic">
                    (edited)
                  </span>
                )}
                {message.pinned && (
                  <span className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                    <Pin className="h-3 w-3" />
                    Pinned
                  </span>
                )}
              </div>

              {/* Reactions - only show existing reactions */}
              <div
                className={`flex items-center gap-2 mt-1 px-1 flex-wrap ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                {REACTIONS.map(react => {
                  const count = getReactionCount(react)
                  const reacted = hasUserReacted(react)
                  if (count === 0 && !reacted) return null

                  return (
                    <button
                      key={react}
                      onClick={() => handleReact(react)}
                      className={`px-2 py-1 rounded-full text-sm border transition-colors ${
                        reacted
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700'
                          : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      <span className="mr-1">{react}</span>
                      {count > 0 && <span>{count}</span>}
                    </button>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="space-y-2 w-full">
              <textarea
                value={editText}
                onChange={e => setEditText(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditText(message.message)
                  }}
                  className="px-3 py-1.5 border border-zinc-300 dark:border-zinc-600 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  onClick={handleEdit}
                  disabled={
                    isPending ||
                    !editText.trim() ||
                    editText.trim() === message.message
                  }
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageItem
