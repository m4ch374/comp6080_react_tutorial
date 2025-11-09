import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import ChannelList from '../components/ChannelList'
import CreateChannelForm from '../components/CreateChannelForm'
import ChannelDetails from '../components/ChannelDetails'
import MessageList from '../components/MessageList'
import MessageInput from '../components/MessageInput'
import { channelApi, type ChannelBasic, type Message } from '../../utils/api'

const Dashboard = () => {
  const [channels, setChannels] = useState<ChannelBasic[]>([])
  const [isLoadingChannels, setIsLoadingChannels] = useState(true)
  const addMessageRef = useRef<((message: Message) => void) | null>(null)
  const { channelId } = useParams<{ channelId?: string }>()
  const userId = parseInt(localStorage.getItem('userId') || '0', 10)

  useEffect(() => {
    const loadChannels = async () => {
      try {
        setIsLoadingChannels(true)
        const response = await channelApi.list()
        setChannels(response.channels)
      } catch (error) {
        console.error('Failed to load channels:', error)
      } finally {
        setIsLoadingChannels(false)
      }
    }

    loadChannels()
  }, [])

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

  const handleChannelCreated = useCallback(
    (newChannel: ChannelBasic) => {
      upsertChannel(newChannel)
    },
    [upsertChannel]
  )

  const handleChannelChanged = useCallback(
    (updatedChannel: ChannelBasic) => {
      upsertChannel(updatedChannel)
    },
    [upsertChannel]
  )

  const handleMessageSent = useCallback((newMessage: Message) => {
    if (addMessageRef.current) {
      addMessageRef.current(newMessage)
    }
  }, [])

  return (
    <div className="h-screen w-full bg-zinc-50 dark:bg-black flex flex-col pt-16">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Channel List */}
        <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
            <CreateChannelForm onChannelCreated={handleChannelCreated} />
          </div>
          <div className="flex-1 overflow-y-auto">
            <ChannelList channels={channels} isLoading={isLoadingChannels} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Channel Details */}
          <ChannelDetails
            channelId={parseInt(channelId!, 10)}
            onChannelChange={handleChannelChanged}
          />

          {/* Messages List */}
          <MessageList
            channelId={parseInt(channelId!, 10)}
            currentUserId={userId}
            onAddMessageRef={callback => {
              addMessageRef.current = callback
            }}
          />

          {/* Message Input - Fixed at bottom of screen */}
          <div className="fixed bottom-0 left-64 right-0 z-40">
            <MessageInput
              channelId={parseInt(channelId!, 10)}
              onMessageSent={handleMessageSent}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
