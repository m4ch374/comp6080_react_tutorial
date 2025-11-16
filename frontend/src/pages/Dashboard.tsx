import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import ChannelDetails from '../components/ChannelDetails'
import MessageList from '../components/MessageList'
import MessageInput from '../components/MessageInput'
import ProfileView from '../components/ProfileView'
import { messageApi, type Message } from '../../utils/api'
import { useChannels } from '../contexts/ChannelContext'

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const { channelId } = useParams<{ channelId?: string }>()
  const userId = parseInt(localStorage.getItem('userId') || '0', 10)
  const { upsertChannel } = useChannels()

  useEffect(() => {
    if (!channelId) return

    messageApi
      .getMessages(parseInt(channelId, 10), 0)
      .then(response => {
        // Messages are returned in reverse chronological order (newest first)
        // We want to display newest at bottom, so we reverse them
        const newMessages = [...response.messages].reverse()
        setMessages(newMessages)
      })
      .catch(error => {
        console.error('Failed to fetch messages:', error)
      })
  }, [channelId])

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
      }
    },
    []
  )

  return (
    <div className="h-screen w-full bg-zinc-50 dark:bg-black flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Channel Details */}
        <ChannelDetails
          channelId={parseInt(channelId!, 10)}
          onChannelChange={upsertChannel}
          onUserClick={setSelectedUserId}
        />

        {/* Messages List */}
        <MessageList
          channelId={parseInt(channelId!, 10)}
          currentUserId={userId}
          messages={messages}
          onMessageUpdate={handleMessageUpdate}
          onUserClick={setSelectedUserId}
        />

        {/* Message Input - Fixed at bottom of screen */}
        <div className="fixed bottom-0 left-64 right-0 z-40">
          <MessageInput
            channelId={parseInt(channelId!, 10)}
            onMessageSent={updatedMessage =>
              handleMessageUpdate(updatedMessage, 'add')
            }
          />
        </div>
      </div>

      {/* Profile View */}
      {selectedUserId !== null && (
        <ProfileView
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  )
}

export default Dashboard
