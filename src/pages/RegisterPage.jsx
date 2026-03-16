import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { User, Mail, Lock, UserPlus } from 'lucide-react'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { success, error } = useNotification()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!username || !email || !password || !confirmPassword) {
      error('Please fill in all fields')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      error('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      error('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      register(email, password, username)
      success('Account created! Welcome to TAM Market with $1,000 bonus')
      navigate('/events')
    } catch (err) {
      error('Failed to create account')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-accent font-bold">Join TAM Market</h1>
          <p className="text-text-muted">Start predicting and earning today</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  className="input-base pl-11"
                  placeholder="Your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
                <input
                  type="email"
                  className="input-base pl-11"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
                <input
                  type="password"
                  className="input-base pl-11"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
                <input
                  type="password"
                  className="input-base pl-11"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
          </div>

          <div className="bg-surface/50 border border-surface-alt rounded p-3 text-sm text-text-muted">
            <p className="text-success font-medium">🎁 Get $1,000 welcome bonus!</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="button-primary w-full flex items-center justify-center gap-2"
          >
            <UserPlus size={20} />
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
