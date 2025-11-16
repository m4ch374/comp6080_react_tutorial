import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { userApi, type User } from '../../utils/api'
import { X } from 'lucide-react'

interface ProfileViewProps {
  userId: number
  onClose: () => void
}

const ProfileView = ({ userId, onClose }: ProfileViewProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const userData = await userApi.getDetails(userId)
        setUser(userData)
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  const defaultAvatar =
    'https://ui-avatars.com/api/?name=' +
    encodeURIComponent(user?.name || 'User')

  const modalContent = (
    <div
      id="profile-container"
      className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            User Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-zinc-500 dark:text-zinc-400">
                Loading profile...
              </div>
            </div>
          ) : user ? (
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Profile Image */}
              <img
                id="profile-image"
                src={user.image || defaultAvatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-zinc-200 dark:border-zinc-700"
                onError={e => {
                  const target = e.target as HTMLImageElement
                  target.src = defaultAvatar
                }}
              />

              {/* Name */}
              <h3
                id="profile-name"
                className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100"
              >
                {user.name}
              </h3>

              {/* Email */}
              <div className="w-full">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                  Email
                </p>
                <p
                  id="profile-email"
                  className="text-base text-zinc-900 dark:text-zinc-100 break-all"
                >
                  {user.email}
                </p>
              </div>

              {/* Bio */}
              <div className="w-full">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                  Bio
                </p>
                <p
                  id="profile-bio"
                  className="text-base text-zinc-900 dark:text-zinc-100 min-h-12 break-words"
                >
                  {user.bio || 'No bio available'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32">
              <div className="text-zinc-500 dark:text-zinc-400">
                Failed to load profile
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default ProfileView
