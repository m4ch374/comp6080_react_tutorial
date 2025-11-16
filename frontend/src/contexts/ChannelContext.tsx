import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react'
import { channelApi, type ChannelBasic } from '../../utils/api'

interface ChannelContextType {
  channels: ChannelBasic[]
  upsertChannel: (channel: ChannelBasic) => void
  refreshChannels: () => Promise<void>
}

const ChannelContext = createContext<ChannelContextType | undefined>(undefined)

export function ChannelProvider({ children }: { children: ReactNode }) {
  const [channels, setChannels] = useState<ChannelBasic[]>([])

  const refreshChannels = useCallback(async () => {
    try {
      const response = await channelApi.list()
      setChannels(response.channels)
    } catch (error) {
      console.error('Failed to fetch channels:', error)
    }
  }, [])

  useEffect(() => {
    refreshChannels()
  }, [refreshChannels])

  const upsertChannel = useCallback((channel: ChannelBasic) => {
    setChannels(prev => {
      const existingIndex = prev.findIndex(ch => ch.id === channel.id)
      if (existingIndex >= 0) {
        // Update existing channel
        const updated = [...prev]
        updated[existingIndex] = channel
        return updated
      } else {
        // Add new channel
        return [...prev, channel]
      }
    })
  }, [])

  return (
    <ChannelContext.Provider value={{ channels, upsertChannel, refreshChannels }}>
      {children}
    </ChannelContext.Provider>
  )
}

export function useChannels() {
  const context = useContext(ChannelContext)
  if (context === undefined) {
    throw new Error('useChannels must be used within a ChannelProvider')
  }
  return context
}

