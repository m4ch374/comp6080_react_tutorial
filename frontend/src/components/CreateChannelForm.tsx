import { useState, useTransition } from 'react'
import { useNavigate } from 'react-router-dom'
import { channelApi } from '../../utils/api'
import { Checkbox } from '@/components/animate-ui/components/base/checkbox'
import { Plus, X } from 'lucide-react'

interface CreateChannelFormProps {
  onChannelCreated?: () => void
}

const CreateChannelForm = ({ onChannelCreated }: CreateChannelFormProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [isPending, startTransition] = useTransition()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      return
    }

    startTransition(async () => {
      try {
        const response = await channelApi.create({
          name: name.trim(),
          description: description.trim() || 'No description',
          private: isPrivate,
        })

        // Reset form
        setName('')
        setDescription('')
        setIsPrivate(false)
        setIsOpen(false)

        // Navigate to the new channel
        navigate(`/dashboard/${response.channelId}`)
        
        // Notify parent to refresh channel list
        if (onChannelCreated) {
          onChannelCreated()
        }
      } catch (error) {
        console.error('Failed to create channel:', error)
      }
    })
  }

  if (!isOpen) {
    return (
      <button
        id="create-channel-button"
        onClick={() => setIsOpen(true)}
        className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Create Channel
      </button>
    )
  }

  return (
    <div
      id="create-channel-container"
      className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Create New Channel
        </h3>
        <button
          onClick={() => {
            setIsOpen(false)
            setName('')
            setDescription('')
            setIsPrivate(false)
          }}
          className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="create-channel-name"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            Channel Name *
          </label>
          <input
            id="create-channel-name"
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            placeholder="Enter channel name"
          />
        </div>

        <div>
          <label
            htmlFor="create-channel-description"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            Description (optional)
          </label>
          <textarea
            id="create-channel-description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 resize-none"
            placeholder="Enter channel description"
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="create-channel-is-private"
            checked={isPrivate}
            onCheckedChange={setIsPrivate}
          />
          <label
            htmlFor="create-channel-is-private"
            className="text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer"
          >
            Private Channel
          </label>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              setName('')
              setDescription('')
              setIsPrivate(false)
            }}
            className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            id="create-channel-submit"
            type="submit"
            disabled={isPending || !name.trim()}
            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Creating...' : 'Create Channel'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateChannelForm

