import axios, { type AxiosInstance, type AxiosError } from 'axios'

// Base URL for the API
const API_BASE_URL = 'http://localhost:5005'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  config => {
    // Don't add Authorization header for login/register endpoints
    const isAuthEndpoint =
      config.url?.includes('/auth/login') ||
      config.url?.includes('/auth/register')
    if (!isAuthEndpoint) {
      const token = localStorage.getItem('token')
      if (token && token.trim() !== '') {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  response => response,
  (error: AxiosError<{ error: string }>) => {
    if (error.response?.status === 403) {
      // Token might be invalid, clear it
      localStorage.removeItem('token')
      localStorage.removeItem('isLoggedIn')
    }
    return Promise.reject(error)
  }
)

// Types based on Swagger schemas
export interface Token {
  token: string
  userId: number
}

export interface Email {
  email: string
}

export interface Password {
  password: string
}

export interface UserName {
  name: string
}

export interface UserId {
  userId: number
}

export interface UserBio {
  bio: string
}

export interface UserImage {
  image: string
}

export interface ChannelBasic {
  id: number
  name: string
  creator: number
  private: boolean
  members: number[]
}

export interface Channel {
  name: string
  creator: number
  private: boolean
  description: string
  createdAt: string
  members: number[]
}

export interface UserBasic {
  id: number
  email: string
}

export interface User {
  email: string
  name: string
  bio?: string
  image?: string
}

export interface Message {
  id: number
  message: string
  image?: string
  sender: number
  sentAt: string
  edited: boolean
  editedAt?: string
  pinned: boolean
  reacts: React[]
}

export interface React {
  react: string | number | boolean
  user: number
}

export interface ReactIdentifier {
  react: string | number | boolean
}

// Auth API
export const authApi = {
  register: async (data: {
    email: string
    password: string
    name: string
  }): Promise<Token> => {
    const response = await api.post<Token>('/auth/register', data)
    return response.data
  },

  login: async (data: { email: string; password: string }): Promise<Token> => {
    const response = await api.post<Token>('/auth/login', data)
    return response.data
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },
}

// Channel API
export const channelApi = {
  list: async (): Promise<{ channels: ChannelBasic[] }> => {
    const response = await api.get<{ channels: ChannelBasic[] }>('/channel')
    return response.data
  },

  create: async (data: {
    name: string
    private: boolean
    description?: string
  }): Promise<{ channelId: number }> => {
    const response = await api.post<{ channelId: number }>('/channel', data)
    return response.data
  },

  getDetails: async (channelId: number): Promise<Channel> => {
    const response = await api.get<Channel>(`/channel/${channelId}`)
    return response.data
  },

  update: async (
    channelId: number,
    data: { name?: string; description?: string }
  ): Promise<void> => {
    await api.put(`/channel/${channelId}`, data)
  },

  join: async (channelId: number): Promise<void> => {
    await api.post(`/channel/${channelId}/join`)
  },

  leave: async (channelId: number): Promise<void> => {
    await api.post(`/channel/${channelId}/leave`)
  },

  invite: async (channelId: number, userId: number): Promise<void> => {
    await api.post(`/channel/${channelId}/invite`, { userId })
  },
}

// User API
export const userApi = {
  list: async (): Promise<{ users: UserBasic[] }> => {
    const response = await api.get<{ users: UserBasic[] }>('/user')
    return response.data
  },

  getDetails: async (userId: number): Promise<User> => {
    const response = await api.get<User>(`/user/${userId}`)
    return response.data
  },

  updateProfile: async (data: {
    email?: string
    password?: string
    name?: string
    bio?: string
    image?: string
  }): Promise<void> => {
    await api.put('/user', data)
  },
}

// Message API
export const messageApi = {
  getMessages: async (
    channelId: number,
    start: number
  ): Promise<{ messages: Message[] }> => {
    const response = await api.get<{ messages: Message[] }>(
      `/message/${channelId}`,
      {
        params: { start },
      }
    )
    return response.data
  },

  sendMessage: async (
    channelId: number,
    data: { message?: string; image?: string }
  ): Promise<void> => {
    await api.post(`/message/${channelId}`, data)
  },

  updateMessage: async (
    channelId: number,
    messageId: number,
    data: { message?: string; image?: string }
  ): Promise<void> => {
    await api.put(`/message/${channelId}/${messageId}`, data)
  },

  deleteMessage: async (
    channelId: number,
    messageId: number
  ): Promise<void> => {
    await api.delete(`/message/${channelId}/${messageId}`)
  },

  pinMessage: async (channelId: number, messageId: number): Promise<void> => {
    await api.post(`/message/pin/${channelId}/${messageId}`)
  },

  unpinMessage: async (channelId: number, messageId: number): Promise<void> => {
    await api.post(`/message/unpin/${channelId}/${messageId}`)
  },

  reactToMessage: async (
    channelId: number,
    messageId: number,
    react: string | number | boolean
  ): Promise<void> => {
    await api.post(`/message/react/${channelId}/${messageId}`, { react })
  },

  unreactToMessage: async (
    channelId: number,
    messageId: number,
    react: string | number | boolean
  ): Promise<void> => {
    await api.post(`/message/unreact/${channelId}/${messageId}`, { react })
  },
}

// Export default api instance for custom requests if needed
export default api
