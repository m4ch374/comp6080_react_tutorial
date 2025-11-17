import React, { useState } from 'react'
import type { User } from '../../utils/api'
import ProfileView from './ProfileView'

type TNavBarProfileButton = {
  currentUser: User | null
}

const NavBarProfileButton: React.FC<TNavBarProfileButton> = ({
  currentUser,
}) => {
  const [imageError, setImageError] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowProfile(true)}
        className="relative p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
        title="My Profile"
      >
        {currentUser?.image && !imageError ? (
          <img
            src={currentUser.image}
            alt={currentUser.name || 'Profile'}
            className="w-8 h-8 rounded-full object-cover border-2 border-zinc-200 dark:border-zinc-700"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold border-2 border-zinc-200 dark:border-zinc-700">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
        )}
      </button>
      {showProfile && (
        <ProfileView user={currentUser} onClose={() => setShowProfile(false)} />
      )}
    </>
  )
}

export default NavBarProfileButton
