import { useState, useEffect } from 'react'
import ChannelList from '../components/ChannelList'
import CreateChannelForm from '../components/CreateChannelForm'
import { channelApi, type ChannelBasic } from '../../utils/api'

const DashboardOnboard = () => {
  const [channels, setChannels] = useState<ChannelBasic[]>([])
  const [isLoadingChannels, setIsLoadingChannels] = useState(true)

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

  const upsertChannel = (incomingChannel: ChannelBasic) => {
    setChannels(prevChannels => {
      const exists = prevChannels.some(ch => ch.id === incomingChannel.id)
      if (exists) {
        return prevChannels.map(ch =>
          ch.id === incomingChannel.id ? incomingChannel : ch
        )
      }
      return [...prevChannels, incomingChannel]
    })
  }

  const handleChannelCreated = (newChannel: ChannelBasic) => {
    upsertChannel(newChannel)
  }

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

        {/* Main Content Area - Empty State */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md px-4">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Welcome to your Dashboard
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                Select a channel from the sidebar to start chatting, or create a
                new channel to get started.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardOnboard
