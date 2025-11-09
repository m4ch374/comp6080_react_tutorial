import { Sun, Moon } from 'lucide-react'
import { Switch } from '@/components/animate-ui/components/radix/switch'
import { useTheme } from '@/contexts/ThemeContext'

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2">
      <Sun className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={checked => setTheme(checked ? 'dark' : 'light')}
      />
      <Moon className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
    </div>
  )
}

export default ThemeToggle

