import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { userApi, type User } from '../../utils/api'

interface UserContextType {
  currentUser: User | null
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const isLoggedIn = !!localStorage.getItem('token')
  const userId = parseInt(localStorage.getItem('userId') || '0', 10)

  useEffect(() => {
    if (isLoggedIn && userId > 0) {
      const fetchUserProfile = async () => {
        try {
          const userData = await userApi.getDetails(userId)
          setCurrentUser(userData)
        } catch (error) {
          console.error('Failed to fetch user profile:', error)
          setCurrentUser(null)
        }
      }
      fetchUserProfile()
    } else {
      setCurrentUser(null)
    }
  }, [isLoggedIn, userId])

  return (
    <UserContext.Provider value={{ currentUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
