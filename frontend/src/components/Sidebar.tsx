import { useState } from 'react'
import CreateChannelForm from './CreateChannelForm'
import ChannelList from './ChannelList'
import ProfileView from './ProfileView'
import { useChannels } from '../contexts/ChannelContext'
import { useUser } from '../contexts/UserContext'

const Sidebar = () => {
  const { channels } = useChannels()
  const { currentUser } = useUser()
  const [showProfile, setShowProfile] = useState(false)
  const [imageError, setImageError] = useState(false)

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
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors"
          >
            {currentUser?.image && !imageError ? (
              <img
                src={currentUser.image}
                alt={currentUser.name || 'Profile'}
                className="w-8 h-8 rounded-full object-cover border-2 border-zinc-200 dark:border-zinc-700"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold border-2 border-zinc-200 dark:border-zinc-700 shrink-0">
                {currentUser?.name
                  ? currentUser.name.charAt(0).toUpperCase()
                  : 'U'}
              </div>
            )}
            <span className="text-sm font-medium truncate">
              {currentUser?.name || 'My Profile'}
            </span>
          </button>
        </div>
      </div>
      {showProfile && (
        <ProfileView user={currentUser} onClose={() => setShowProfile(false)} />
      )}
    </>
  )
}

export default Sidebar
