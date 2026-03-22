import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useBets } from '../context/BetContext'
import { useNotification } from '../context/NotificationContext'
import { 
  ArrowLeft, 
  Plus, 
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
  Target,
  Eye
} from 'lucide-react'

export default function AdminUserManagement() {
  const navigate = useNavigate()
  const { updateUser } = useAuth()
  const { getUserStats } = useBets()
  const { success, error } = useNotification()
  
  const [users, setUsers] = useState(() => {
    return JSON.parse(localStorage.getItem('allUsers') || '[]')
  })
  
  const [selectedUser, setSelectedUser] = useState(null)
  const [showBalanceModal, setShowBalanceModal] = useState(false)
  const [balanceAmount, setBalanceAmount] = useState('')
  const [balanceAction, setBalanceAction] = useState('add') // 'add' or 'set'

  const refreshUsers = () => {
    setUsers(JSON.parse(localStorage.getItem('allUsers') || '[]'))
  }

  const handleBalanceUpdate = () => {
    if (!selectedUser || !balanceAmount) {
      error('Please enter a valid amount')
      return
    }

    const amount = parseFloat(balanceAmount)
    if (isNaN(amount) || amount <= 0) {
      error('Please enter a positive number')
      return
    }

    const updatedUsers = users.map(user => {
      if (user.id === selectedUser.id) {
        const newBalance = balanceAction === 'add' 
          ? user.balance + amount 
          : amount
        
        const updatedUser = { ...user, balance: newBalance }
        
        // Update in localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        return updatedUser
      }
      return user
    })

    setUsers(updatedUsers)
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers))
    
    success(`Balance ${balanceAction === 'add' ? 'added to' : 'set for'} ${selectedUser.username}`)
    setShowBalanceModal(false)
    setSelectedUser(null)
    setBalanceAmount('')
  }

  const getLocalUserStats = (userId) => {
    const userBets = JSON.parse(localStorage.getItem(`bets_${userId}`) || '[]')
    const settled = userBets.filter(b => b.status === 'settled')
    const won = settled.filter(b => b.won)
    const totalWinnings = won.reduce((sum, b) => sum + b.potentialPayout, 0)
    const winRate = settled.length > 0 ? ((won.length / settled.length) * 100).toFixed(1) : 0
    
    return {
      totalBets: userBets.length,
      settledBets: settled.length,
      wonBets: won.length,
      totalWinnings,
      winRate: parseFloat(winRate),
      totalWagered: userBets.reduce((sum, b) => sum + b.amountPlaced, 0)
    }
  }

  const openBalanceModal = (user, action = 'add') => {
    setSelectedUser(user)
    setBalanceAction(action)
    setBalanceAmount('')
    setShowBalanceModal(true)
  }

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="button-ghost p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="section-title">USER MANAGEMENT</h1>
          </div>
          <button
            onClick={refreshUsers}
            className="button-secondary"
          >
            REFRESH
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="mono-label text-primary">Total Users</div>
            <div className="mono-value text-primary">{users.length}</div>
          </div>
          <div className="card">
            <div className="mono-label text-secondary">Active Bettors</div>
            <div className="mono-value text-secondary">
              {users.filter(u => getLocalUserStats(u.id).totalBets > 0).length}
            </div>
          </div>
          <div className="card">
            <div className="mono-label text-accent">Total Balance</div>
            <div className="mono-value text-accent">
              ${users.reduce((sum, u) => sum + u.balance, 0).toFixed(0)}
            </div>
          </div>
          <div className="card">
            <div className="mono-label text-primary">Avg Balance</div>
            <div className="mono-value text-primary">
              ${users.length > 0 ? (users.reduce((sum, u) => sum + u.balance, 0) / users.length).toFixed(0) : '0'}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-surface-alt">
                  <th className="text-left py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">User</th>
                  <th className="text-right py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">Balance</th>
                  <th className="text-right py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">
                    <Target className="w-4 h-4 inline mr-1" />
                    Bets
                  </th>
                  <th className="text-right py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">Win Rate</th>
                  <th className="text-right py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">Total Wagered</th>
                  <th className="text-right py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">Winnings</th>
                  <th className="text-left py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Joined
                  </th>
                  <th className="text-left py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => {
                  const stats = getLocalUserStats(user.id)
                  return (
                    <tr key={user.id} className="border-b border-surface-alt hover:bg-surface transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-mono font-bold">{user.username}</div>
                          <div className="font-mono text-xs text-text-muted">{user.email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-mono font-bold text-primary">
                          ${user.balance.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-mono">{stats.totalBets}</td>
                      <td className="py-4 px-4 text-right">
                        <span className={`font-mono font-bold ${
                          stats.winRate >= 60 ? 'text-primary' : 
                          stats.winRate >= 40 ? 'text-accent' : 'text-text-muted'
                        }`}>
                          {stats.winRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-mono">${stats.totalWagered.toFixed(2)}</td>
                      <td className="py-4 px-4 text-right font-mono">${stats.totalWinnings.toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <div className="font-mono text-xs text-text-muted">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openBalanceModal(user, 'add')}
                            className="button-ghost p-2 text-primary"
                            title="Add Balance"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openBalanceModal(user, 'set')}
                            className="button-ghost p-2 text-secondary"
                            title="Set Balance"
                          >
                            <DollarSign className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            
            {users.length === 0 && (
              <div className="text-center py-12">
                <div className="text-text-muted font-mono">No users found</div>
              </div>
            )}
          </div>
        </div>

        {/* Balance Modal */}
        {showBalanceModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-surface border-2 border-surface-alt p-8 max-w-md w-full">
              <h3 className="text-xl font-display font-bold mb-4">
                {balanceAction === 'add' ? 'ADD BALANCE' : 'SET BALANCE'}
              </h3>
              
              <div className="mb-6">
                <div className="font-mono text-sm text-text-muted mb-2">
                  User: <span className="text-text">{selectedUser.username}</span>
                </div>
                <div className="font-mono text-sm text-text-muted mb-4">
                  Current Balance: <span className="text-primary">${selectedUser.balance.toFixed(2)}</span>
                </div>
                
                <div>
                  <label className="mono-label block mb-2">
                    {balanceAction === 'add' ? 'Amount to Add' : 'New Balance'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={balanceAmount}
                    onChange={(e) => setBalanceAmount(e.target.value)}
                    className="input-base"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="font-mono text-sm text-text-muted">
                  {balanceAction === 'add' 
                    ? `New balance will be: $${(selectedUser.balance + parseFloat(balanceAmount || 0)).toFixed(2)}`
                    : `Balance will be set to: $${parseFloat(balanceAmount || 0).toFixed(2)}`
                  }
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleBalanceUpdate}
                  className="button-primary flex-1"
                >
                  {balanceAction === 'add' ? 'ADD' : 'SET'} BALANCE
                </button>
                <button
                  onClick={() => {
                    setShowBalanceModal(false)
                    setSelectedUser(null)
                    setBalanceAmount('')
                  }}
                  className="button-secondary flex-1"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
