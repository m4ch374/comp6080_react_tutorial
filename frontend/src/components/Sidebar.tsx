import { useState } from 'react'
import CreateChannelForm from './CreateChannelForm'
import ChannelList from './ChannelList'
import ProfileView from './ProfileView'
import { useChannels } from '../contexts/ChannelContext'
import { User } from 'lucide-react'

const Sidebar = () => {
  const { channels } = useChannels()
  const [showProfile, setShowProfile] = useState(false)
  const userId = parseInt(localStorage.getItem('userId') || '0', 10)

  return (
    <>
      <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <CreateChannelForm />
        </div>
        <div className="flex-1 overflow-y-auto">
          <ChannelList channels={channels} />
        </div>
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
          <button
            onClick={() => setShowProfile(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors"
          >
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">My Profile</span>
          </button>
        </div>
      </div>
      {showProfile && (
        <ProfileView userId={userId} onClose={() => setShowProfile(false)} />
      )}
    </>
  )
}

export default Sidebar
