import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, Wallet, Zap } from 'lucide-react'

export default function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false)
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-background border-b-2 border-surface-alt">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-2xl tracking-tight">
            <Zap className="w-6 h-6 text-primary" />
            <span className="hidden sm:inline">TAM</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <Link to="/events" className="font-mono text-sm uppercase tracking-widest hover:text-primary transition-colors">
                  MARKETS
                </Link>
                <Link to="/wallet" className="flex items-center gap-2 font-mono text-sm hover:text-primary transition-colors">
                  <Wallet className="w-4 h-4" />
                  <span className="text-primary">${user.balance.toFixed(2)}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="font-mono text-sm uppercase tracking-widest hover:text-danger transition-colors"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="font-mono text-sm uppercase tracking-widest hover:text-primary transition-colors">
                  LOGIN
                </Link>
                <Link to="/register" className="button-primary text-sm">
                  JOIN
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 border-t border-surface-alt pt-4 overflow-x-auto">
            <div className="flex gap-4">
              {user ? (
                <>
                  <Link
                    to="/events"
                    className="font-mono text-sm uppercase tracking-widest whitespace-nowrap"
                    onClick={() => setIsOpen(false)}
                  >
                    MARKETS
                  </Link>
                  <Link
                    to="/wallet"
                    className="font-mono text-sm uppercase tracking-widest whitespace-nowrap text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    ${user.balance.toFixed(2)}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="font-mono text-sm uppercase tracking-widest whitespace-nowrap text-danger"
                  >
                    LOGOUT
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="font-mono text-sm uppercase tracking-widest whitespace-nowrap"
                    onClick={() => setIsOpen(false)}
                  >
                    LOGIN
                  </Link>
                  <Link
                    to="/register"
                    className="font-mono text-sm uppercase tracking-widest whitespace-nowrap text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    JOIN
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
