import { useNavigate, useParams } from 'react-router-dom'
import { type ChannelBasic } from '../../utils/api'
import { Lock, Globe } from 'lucide-react'

interface ChannelListProps {
  channels: ChannelBasic[]
  isLoading?: boolean
}

const ChannelList = ({ channels, isLoading = false }: ChannelListProps) => {
  const navigate = useNavigate()
  const { channelId } = useParams<{ channelId?: string }>()
  const userId = parseInt(localStorage.getItem('userId') || '0', 10)

  const publicChannels = channels.filter(ch => !ch.private)
  const privateChannels = channels.filter(
    ch => ch.private && ch.members.includes(userId)
  )

  const handleChannelClick = (id: number) => {
    navigate(`/dashboard/${id}`)
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-zinc-500 dark:text-zinc-400">
          Loading channels...
        </div>
      </div>
    )
  }

  return (
    <div id="channel-list" className="h-full flex flex-col">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Channels
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Public Channels */}
        {publicChannels.length > 0 && (
          <div className="p-2">
            <div className="px-2 py-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Globe className="h-3 w-3" />
              Public Channels
            </div>
            {publicChannels.map(channel => (
              <div
                key={channel.id}
                className={`channel-container px-3 py-2 rounded-lg cursor-pointer transition-colors mb-1 ${
                  channelId === channel.id.toString()
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100'
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                }`}
                onClick={() => handleChannelClick(channel.id)}
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 shrink-0" />
                  <span className="truncate font-medium">{channel.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Private Channels */}
        {privateChannels.length > 0 && (
          <div className="p-2">
            <div className="px-2 py-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Private Channels
            </div>
            {privateChannels.map(channel => (
              <div
                key={channel.id}
                className={`channel-container px-3 py-2 rounded-lg cursor-pointer transition-colors mb-1 ${
                  channelId === channel.id.toString()
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100'
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                }`}
                onClick={() => handleChannelClick(channel.id)}
              >
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 shrink-0" />
                  <span className="truncate font-medium">{channel.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {publicChannels.length === 0 && privateChannels.length === 0 && (
          <div className="p-4 text-center text-zinc-500 dark:text-zinc-400 text-sm">
            No channels available
          </div>
        )}
      </div>
    </div>
  )
}

export default ChannelList
