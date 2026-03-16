import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { Mail, Lock, LogIn } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { error } = useNotification()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!email || !password) {
      error('Please fill in all fields')
      setLoading(false)
      return
    }

    const user = login(email, password)
    if (user) {
      navigate('/events')
    } else {
      error('Invalid email or password')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-accent font-bold">Welcome Back</h1>
          <p className="text-text-muted">Sign in to your prediction market account</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="button-primary w-full flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-text-muted">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline font-medium">
            Create one
          </Link>
        </p>

        <div className="p-4 bg-surface border border-surface-alt rounded-lg text-sm text-text-muted">
          <p className="font-medium mb-2">Demo Credentials:</p>
          <p>Email: demo@example.com</p>
          <p>Password: demo123</p>
        </div>
      </div>
    </div>
  )
}
