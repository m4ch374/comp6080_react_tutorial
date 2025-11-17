import { useTransition } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Sun, Moon, LogOut } from 'lucide-react'
import { Switch } from '@/components/animate-ui/components/radix/switch'
import { useTheme } from '@/contexts/ThemeContext'
import { useUser } from '@/contexts/UserContext'
import { authApi } from '../../utils/api'
import NavBarProfileButton from './NavBarProfileButton'

const Navbar = () => {
  const { theme, setTheme } = useTheme()
  const { currentUser } = useUser()
  const location = useLocation()
  const navigate = useNavigate()
  const [isPending, startTransition] = useTransition()
  const isLoggedIn = !!localStorage.getItem('token')

  const handleLogout = async () => {
    startTransition(async () => {
      await authApi.logout()

      // Clear token and user info (matching what Login.tsx sets)
      localStorage.removeItem('token')
      localStorage.removeItem('userId')

      // Navigate to login page on success
      navigate('/login')
    })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            onClick={e => {
              if (location.pathname === '/') {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
            className="flex items-center gap-2 text-xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            Faker.ai
          </Link>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            {!isLoggedIn && location.pathname !== '/login' && (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                Sign In
              </Link>
            )}
            {!isLoggedIn && location.pathname !== '/register' && (
              <Link
                to="/register"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-indigo-500/50 dark:shadow-indigo-500/20"
              >
                Get Started
              </Link>
            )}

            {isLoggedIn && (
              <button
                onClick={handleLogout}
                disabled={isPending}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="h-4 w-4" />
                {isPending ? 'Signing out...' : 'Sign Out'}
              </button>
            )}

            {/* Profile Button - only show when logged in */}
            {isLoggedIn && <NavBarProfileButton currentUser={currentUser} />}

            {/* Theme Toggle */}
            <div className="flex items-center gap-2 pl-3 border-l border-zinc-200 dark:border-zinc-700">
              <Sun className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={checked =>
                  setTheme(checked ? 'dark' : 'light')
                }
              />
              <Moon className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
