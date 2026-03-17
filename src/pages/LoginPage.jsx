import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const { error } = useNotification()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      error('FILL ALL FIELDS')
      return
    }

    const user = login(email, password)
    if (user) {
      navigate('/events')
    } else {
      error('INVALID CREDENTIALS')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md space-y-8">
        <div className="text-left">
          <h1 className="text-4xl md:text-5xl font-display font-bold">
            LOGIN
          </h1>
          <p className="font-mono text-sm text-text-muted mt-2">
            ACCESS YOUR ACCOUNT
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="font-mono text-xs uppercase tracking-widest text-text-muted block">
              EMAIL
            </label>
            <input
              type="email"
              className="input-base"
              placeholder="EMAIL@EXAMPLE.COM"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="font-mono text-xs uppercase tracking-widest text-text-muted block">
              PASSWORD
            </label>
            <input
              type="password"
              className="input-base"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="button-primary w-full"
          >
            ENTER
          </button>
        </form>

        <p className="font-mono text-sm text-text-muted">
          NO ACCOUNT?{' '}
          <Link to="/register" className="text-primary hover:underline">
            JOIN
          </Link>
        </p>

        <div className="border border-surface-alt p-4 font-mono text-xs text-text-muted">
          <span className="text-primary">DEMO:</span> demo@example.com / demo123
        </div>
      </div>
    </div>
  )
}
