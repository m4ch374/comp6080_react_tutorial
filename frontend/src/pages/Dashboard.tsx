import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import ChannelList from '../components/ChannelList'
import CreateChannelForm from '../components/CreateChannelForm'
import ChannelDetails from '../components/ChannelDetails'
import MessageList from '../components/MessageList'
import MessageInput from '../components/MessageInput'
import {
  channelApi,
  messageApi,
  type ChannelBasic,
  type Message,
} from '../../utils/api'

const Dashboard = () => {
  const [channels, setChannels] = useState<ChannelBasic[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const { channelId } = useParams<{ channelId?: string }>()
  const userId = parseInt(localStorage.getItem('userId') || '0', 10)

  useEffect(() => {
    channelApi
      .list()
      .then(response => {
        setChannels(response.channels)
      })
      .catch(error => {
        console.error('Failed to load channels:', error)
      })
  }, [])

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

  const upsertChannel = useCallback((incomingChannel: ChannelBasic) => {
    setChannels(prevChannels => {
      const exists = prevChannels.some(ch => ch.id === incomingChannel.id)
      if (exists) {
        return prevChannels.map(ch =>
          ch.id === incomingChannel.id ? incomingChannel : ch
        )
      }
      return [...prevChannels, incomingChannel]
    })
  }, [])

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
    <div className="h-screen w-full bg-zinc-50 dark:bg-black flex flex-col pt-16">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Channel List */}
        <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
            <CreateChannelForm onChannelCreated={upsertChannel} />
          </div>
          <div className="flex-1 overflow-y-auto">
            <ChannelList channels={channels} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Channel Details */}
          <ChannelDetails
            channelId={parseInt(channelId!, 10)}
            onChannelChange={upsertChannel}
          />

          {/* Messages List */}
          <MessageList
            channelId={parseInt(channelId!, 10)}
            currentUserId={userId}
            messages={messages}
            onMessageUpdate={handleMessageUpdate}
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
      </div>
    </div>
  )
}

export default Dashboard
