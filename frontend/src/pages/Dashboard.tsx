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
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-black flex flex-col pt-16">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Channel List */}
        <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <CreateChannelForm onChannelCreated={handleChannelUpdate} />
          </div>
          <ChannelList refreshTrigger={channelListRefresh} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {channelId ? (
            <>
              {/* Channel Details */}
              <ChannelDetails
                channelId={parseInt(channelId, 10)}
                onChannelUpdate={handleChannelUpdate}
              />

              {/* Messages List */}
              <MessageList
                channelId={parseInt(channelId, 10)}
                currentUserId={userId}
                onMessageUpdate={handleChannelUpdate}
                onAddMessageRef={callback => {
                  addMessageRef.current = callback
                }}
              />

              {/* Message Input - Fixed at bottom of screen */}
              <div className="fixed bottom-0 left-64 right-0 z-40">
                <MessageInput
                  channelId={parseInt(channelId, 10)}
                  onMessageSent={handleMessageSent}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md px-4">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Welcome to your Dashboard
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                  Select a channel from the sidebar to start chatting, or create
                  a new channel to get started.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
