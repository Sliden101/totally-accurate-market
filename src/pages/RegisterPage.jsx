import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { register } = useAuth()
  const { success, error } = useNotification()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username || !email || !password || !confirmPassword) {
      error('FILL ALL FIELDS')
      return
    }

    if (password !== confirmPassword) {
      error('PASSWORDS DONT MATCH')
      return
    }

    if (password.length < 6) {
      error('PASSWORD TOO SHORT')
      return
    }

    try {
      register(email, password, username)
      success('WELCOME. $1,000 FREE MONEY ADDED.')
      navigate('/events')
    } catch (err) {
      error('REGISTRATION FAILED')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md space-y-8">
        <div className="text-left">
          <h1 className="text-4xl md:text-5xl font-display font-bold">
            JOIN
          </h1>
          <p className="font-mono text-sm text-text-muted mt-2">
            CREATE YOUR ACCOUNT
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="font-mono text-xs uppercase tracking-widest text-text-muted block">
              USERNAME
            </label>
            <input
              type="text"
              className="input-base"
              placeholder="USERNAME"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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

          <div className="space-y-2">
            <label className="font-mono text-xs uppercase tracking-widest text-text-muted block">
              CONFIRM PASSWORD
            </label>
            <input
              type="password"
              className="input-base"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="border-l-4 border-primary pl-4 py-2">
            <span className="font-mono text-sm text-primary font-bold">
              +$1,000 FREE MONEY
            </span>
          </div>

          <button
            type="submit"
            className="button-primary w-full"
          >
            START
          </button>
        </form>

        <p className="font-mono text-sm text-text-muted">
          HAVE ACCOUNT?{' '}
          <Link to="/login" className="text-primary hover:underline">
            LOGIN
          </Link>
        </p>
      </div>
    </div>
  )
}
