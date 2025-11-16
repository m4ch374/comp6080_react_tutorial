import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Login from './Login'
import { authApi } from '../../utils/api'

// Mock the authApi
vi.mock('../../utils/api', () => ({
  authApi: {
    login: vi.fn(),
  },
}))

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Login Component', () => {
  beforeEach(() => {
    // Clear all mocks and localStorage before each test
    vi.clearAllMocks()
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )
  }

  describe('Rendering', () => {
    it('should render the login form with all required elements', () => {
      renderLogin()

      expect(screen.getByText('Sign in to your account')).toBeInTheDocument()
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /sign in/i })
      ).toBeInTheDocument()
      expect(screen.getByText(/don't have an account/i)).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument()
    })

    it('should render email and password inputs with correct types', () => {
      renderLogin()

      const emailInput = screen.getByLabelText(/email address/i)
      const passwordInput = screen.getByLabelText(/password/i)

      expect(emailInput).toHaveAttribute('type', 'email')
      expect(passwordInput).toHaveAttribute('type', 'password')
    })
  })

  describe('Form Inputs', () => {
    it('should update email input value when user types', async () => {
      const user = userEvent.setup()
      renderLogin()

      const emailInput = screen.getByLabelText(
        /email address/i
      ) as HTMLInputElement
      await user.type(emailInput, 'test@example.com')

      expect(emailInput.value).toBe('test@example.com')
    })

    it('should update password input value when user types', async () => {
      const user = userEvent.setup()
      renderLogin()

      const passwordInput = screen.getByLabelText(
        /password/i
      ) as HTMLInputElement
      await user.type(passwordInput, 'password123')

      expect(passwordInput.value).toBe('password123')
    })
  })

  describe('Form Submission', () => {
    it('should submit form successfully without errors', async () => {
      const user = userEvent.setup()
      const mockToken = 'test-token-123'
      const mockUserId = 42

      // Mock successful API response
      vi.mocked(authApi.login).mockResolvedValue({
        token: mockToken,
        userId: mockUserId,
      })

      renderLogin()

      // Fill in form fields
      const emailInput = screen.getByLabelText(/email address/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, 'user@example.com')
      await user.type(passwordInput, 'securepassword')
      await user.click(submitButton)

      // Verify API was called with correct credentials
      await waitFor(() => {
        expect(authApi.login).toHaveBeenCalledWith({
          email: 'user@example.com',
          password: 'securepassword',
        })
      })

      // Verify token and userId are stored in localStorage
      await waitFor(() => {
        expect(localStorage.getItem('token')).toBe(mockToken)
        expect(localStorage.getItem('userId')).toBe(mockUserId.toString())
      })

      // Verify navigation to dashboard
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
      })
    })
  })
})
