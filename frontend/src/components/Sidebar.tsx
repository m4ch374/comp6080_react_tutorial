import CreateChannelForm from './CreateChannelForm'
import ChannelList from './ChannelList'
import { useChannels } from '../contexts/ChannelContext'

const Sidebar = () => {
  const { channels } = useChannels()

  return (
    <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        <CreateChannelForm />
      </div>
      <div className="flex-1 overflow-y-auto">
        <ChannelList channels={channels} />
      </div>
    </div>
  )
}

export default Sidebar
