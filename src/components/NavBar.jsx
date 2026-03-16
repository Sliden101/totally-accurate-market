import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, LogOut, Wallet, Zap } from 'lucide-react'

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
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-surface-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
           <Link to="/" className="flex items-center gap-2 font-accent font-bold text-xl">
             <Zap className="w-6 h-6 text-primary" />
             <span className="hidden sm:inline">TAM Prediction Market</span>
           </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <Link to="/events" className="hover:text-primary transition">Events</Link>
                <Link to="/wallet" className="flex items-center gap-2 hover:text-primary transition">
                  <Wallet className="w-4 h-4" />
                  ${user.balance.toFixed(2)}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 button-secondary text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="button-secondary text-sm">Login</Link>
                <Link to="/register" className="button-primary text-sm">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-surface-alt pt-4">
            {user ? (
              <>
                <Link
                  to="/events"
                  className="block hover:text-primary transition"
                  onClick={() => setIsOpen(false)}
                >
                  Events
                </Link>
                <Link
                  to="/wallet"
                  className="block hover:text-primary transition"
                  onClick={() => setIsOpen(false)}
                >
                  Wallet - ${user.balance.toFixed(2)}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full button-secondary text-left text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block button-secondary text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block button-primary text-sm text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
