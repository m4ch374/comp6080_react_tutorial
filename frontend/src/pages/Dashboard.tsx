import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import ChannelList from '../components/ChannelList'
import CreateChannelForm from '../components/CreateChannelForm'
import ChannelDetails from '../components/ChannelDetails'
import MessageList from '../components/MessageList'
import MessageInput from '../components/MessageInput'

const Dashboard = () => {
  const [channelListRefresh, setChannelListRefresh] = useState(0)
  const addMessageRef = useRef<(() => void) | null>(null)
  const { channelId } = useParams<{ channelId?: string }>()
  const userId = parseInt(localStorage.getItem('userId') || '0', 10)

  const handleChannelUpdate = () => {
    // Trigger channel list refresh
    setChannelListRefresh(prev => prev + 1)
  }

  const handleMessageSent = () => {
    // Trigger message list refresh
    if (addMessageRef.current) {
      addMessageRef.current()
    }
  }

  return (
    <div className="h-screen w-full bg-zinc-50 dark:bg-black flex flex-col pt-16">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Channel List */}
        <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
            <CreateChannelForm onChannelCreated={handleChannelUpdate} />
          </div>
          <div className="flex-1 overflow-y-auto">
            <ChannelList refreshTrigger={channelListRefresh} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Channel Details */}
          <ChannelDetails
            channelId={parseInt(channelId!, 10)}
            onChannelUpdate={handleChannelUpdate}
          />

          {/* Messages List */}
          <MessageList
            channelId={parseInt(channelId!, 10)}
            currentUserId={userId}
            onMessageUpdate={handleChannelUpdate}
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
