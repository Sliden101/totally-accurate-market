import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { ArrowLeft, Plus, X, Edit, Trash2, Users, DollarSign, Target, Calendar } from 'lucide-react'

export default function AdminDataManager() {
  const { success, error } = useNotification()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('users') // 'users', 'events', 'bets'
  
  // Get data from localStorage
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('allUsers') || '[]'))
  const [events, setEvents] = useState(() => JSON.parse(localStorage.getItem('events') || '[]'))
  const [allBets, setAllBets] = useState(() => {
    const bets = []
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]')
    allUsers.forEach(user => {
      const userBets = JSON.parse(localStorage.getItem(`bets_${user.id}`) || '[]')
      bets.push(...userBets.map(bet => ({ ...bet, user })))
    })
    return bets
  })

  const refreshData = () => {
    setUsers(JSON.parse(localStorage.getItem('allUsers') || '[]'))
    setEvents(JSON.parse(localStorage.getItem('events') || '[]'))
    const newAllBets = []
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]')
    allUsers.forEach(user => {
      const userBets = JSON.parse(localStorage.getItem(`bets_${user.id}`) || '[]')
      newAllBets.push(...userBets.map(bet => ({ ...bet, user })))
    })
    setAllBets(newAllBets)
  }

  const deleteUser = (userId) => {
    if (confirm('Are you sure you want to delete this user and all their data?')) {
      // Delete user's bets
      localStorage.removeItem(`bets_${userId}`)
      
      // Delete user from allUsers
      const updatedUsers = users.filter(u => u.id !== userId)
      localStorage.setItem('allUsers', JSON.stringify(updatedUsers))
      setUsers(updatedUsers)
      
      // Delete user transactions
      localStorage.removeItem(`transactions_${userId}`)
      
      success('User and all their data deleted successfully')
      refreshData()
    }
  }

  const updateUserBalance = (userId, newBalance) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, balance: newBalance } : user
    )
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers))
    setUsers(updatedUsers)
    
    // Update current session if this is the logged-in user
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    if (currentUser.id === userId) {
      localStorage.setItem('user', JSON.stringify({ ...currentUser, balance: newBalance }))
    }
    
    success('User balance updated successfully')
  }

  const addTestBet = (userId, eventId, outcome, amount, won = false) => {
    const bet = {
      id: Date.now().toString(),
      userId,
      eventId,
      outcome,
      amount,
      amountPlaced: amount,
      potentialPayout: amount * 1.8,
      status: won ? 'settled' : 'active',
      createdAt: new Date().toISOString(),
      resolvedAt: won ? new Date().toISOString() : null,
      resolvedOutcome: won ? outcome : null,
      won
    }
    
    const userBets = JSON.parse(localStorage.getItem(`bets_${userId}`) || '[]')
    userBets.push(bet)
    localStorage.setItem(`bets_${userId}`, JSON.stringify(userBets))
    
    // Update user balance
    const user = users.find(u => u.id === userId)
    if (user && won) {
      updateUserBalance(userId, user.balance + bet.potentialPayout)
    }
    
    success('Test bet added successfully')
    refreshData()
  }

  const settleEvent = (eventId, winningOutcome) => {
    const updatedEvents = events.map(event => 
      event.id === eventId 
        ? { ...event, status: 'closed', resolved: true, resolvedOutcome: winningOutcome }
        : event
    )
    localStorage.setItem('events', JSON.stringify(updatedEvents))
    setEvents(updatedEvents)
    
    // Settle all bets for this event
    const eventBets = allBets.filter(bet => bet.eventId === eventId)
    eventBets.forEach(bet => {
      const userBets = JSON.parse(localStorage.getItem(`bets_${bet.userId}`) || '[]')
      const updatedBets = userBets.map(b => 
        b.id === bet.id 
          ? { 
              ...b, 
              status: 'settled', 
              resolvedAt: new Date().toISOString(),
              resolvedOutcome: winningOutcome,
              won: b.outcome === winningOutcome 
            }
          : b
      )
      localStorage.setItem(`bets_${bet.userId}`, JSON.stringify(updatedBets))
      
      // Update user balance if they won
      if (bet.outcome === winningOutcome) {
        const user = users.find(u => u.id === bet.userId)
        if (user) {
          updateUserBalance(bet.userId, user.balance + bet.potentialPayout)
        }
      }
    })
    
    success(`Event resolved! ${winningOutcome} wins. Distributed $${eventBets.filter(b => b.outcome === winningOutcome).reduce((sum, b) => sum + b.potentialPayout, 0)} in winnings.`)
    refreshData()
  }

  const addTestUser = () => {
    const newUser = {
      id: Date.now().toString(),
      email: `testuser${Date.now()}@test.com`,
      username: `Test User ${users.length + 1}`,
      password: 'test123',
      balance: 1000,
      createdAt: new Date().toISOString()
    }
    
    const updatedUsers = [...users, newUser]
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers))
    setUsers(updatedUsers)
    refreshData()
    success('Test user created successfully')
  }

  const addTestEvent = () => {
    const newEvent = {
      id: (events.length + 1).toString(),
      title: `Test Event ${events.length + 1}`,
      category: 'Test',
      description: 'A test event for demonstration purposes',
      currentOdds: { yes: 0.6, no: 0.4 },
      totalVolume: 0,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'open',
      resolved: false,
      image: `https://images.unsplash.com/photo-${Date.now()}?w=400&h=300&fit=crop`
    }
    
    const updatedEvents = [...events, newEvent]
    localStorage.setItem('events', JSON.stringify(updatedEvents))
    setEvents(updatedEvents)
    refreshData()
    success('Test event created successfully')
  }

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="button-ghost p-2"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="section-title">DATA MANAGER</h1>
          </div>
          <button
            onClick={refreshData}
            className="button-secondary"
          >
            REFRESH DATA
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          {['users', 'events', 'bets'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-mono text-sm uppercase tracking-wider transition-all ${
                activeTab === tab 
                  ? 'bg-primary text-background' 
                  : 'bg-surface text-text hover:text-primary'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold">USER MANAGEMENT</h2>
              <button
                onClick={addTestUser}
                className="button-primary"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                ADD TEST USER
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-surface-alt">
                    <th className="text-left py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">USER</th>
                    <th className="text-left py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">EMAIL</th>
                    <th className="text-right py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">BALANCE</th>
                    <th className="text-right py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">BETS</th>
                    <th className="text-right py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">WINNINGS</th>
                    <th className="text-center py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => {
                    const userBets = allBets.filter(bet => bet.userId === user.id)
                    const totalWinnings = userBets.filter(bet => bet.won).reduce((sum, bet) => sum + bet.potentialPayout, 0)
                    const totalBets = userBets.length
                    
                    return (
                      <tr key={user.id} className="border-b border-surface-alt hover:bg-surface transition-colors">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-mono font-bold">{user.username}</div>
                            <div className="font-mono text-xs text-text-muted">{user.email}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right font-mono">${user.balance.toFixed(2)}</td>
                        <td className="py-4 px-4 text-right font-mono">{totalBets}</td>
                        <td className="py-4 px-4 text-right font-mono text-primary">${totalWinnings.toFixed(2)}</td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => updateUserBalance(user.id, user.balance + 500)}
                              className="button-ghost p-2 text-secondary"
                              title="Add $500"
                            >
                              <DollarSign className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateUserBalance(user.id, 2000)}
                              className="button-ghost p-2 text-accent"
                              title="Set to $2000"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="button-ghost p-2 text-danger"
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold">EVENT MANAGEMENT</h2>
              <button
                onClick={addTestEvent}
                className="button-primary"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                ADD TEST EVENT
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map(event => (
                <div key={event.id} className="card-hover">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-display font-bold text-lg">{event.title}</h3>
                      <span className={`px-3 py-1 text-xs font-mono uppercase tracking-widest ${
                        event.status === 'open' 
                          ? 'bg-success/10 text-success border border-success' 
                          : 'bg-surface border border-surface-alt text-text-muted'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                    <p className="font-mono text-sm text-text-muted">{event.description}</p>
                    <div className="font-mono text-xs text-text-muted">
                      <div>Ends: {new Date(event.endDate).toLocaleDateString()}</div>
                      <div>Volume: ${event.totalVolume}</div>
                    </div>
                    
                    {event.status === 'open' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => settleEvent(event.id, 'yes')}
                          className="button-secondary flex-1"
                        >
                          SETTLE AS YES
                        </button>
                        <button
                          onClick={() => settleEvent(event.id, 'no')}
                          className="button-secondary flex-1"
                        >
                          SETTLE AS NO
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bets Tab */}
        {activeTab === 'bets' && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold">BET MANAGEMENT</h2>
              <div className="flex gap-2">
                <select
                  onChange={(e) => {
                    const userId = e.target.value
                    if (userId) {
                      const user = users.find(u => u.id === userId)
                      if (user) {
                        const userBets = allBets.filter(bet => bet.userId === userId)
                        userBets.forEach(bet => {
                          if (bet.status === 'active') {
                            addTestBet(userId, bet.eventId, 'yes', Math.random() * 100 + 50, true)
                          }
                        })
                        success(`Added winning bets for ${user.username}`)
                      }
                    }
                  }}
                  className="input-base"
                  defaultValue=""
                >
                  <option value="">Select user to add winning bets...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-surface-alt">
                    <th className="text-left py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">USER</th>
                    <th className="text-left py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">EVENT</th>
                    <th className="text-left py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">OUTCOME</th>
                    <th className="text-right py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">AMOUNT</th>
                    <th className="text-right py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">PAYOUT</th>
                    <th className="text-center py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {allBets.map(bet => (
                    <tr key={bet.id} className="border-b border-surface-alt hover:bg-surface transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-mono">{bet.user?.username}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-mono">{events.find(e => e.id === bet.eventId)?.title || 'Unknown Event'}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-mono capitalize ${
                          bet.won === true ? 'text-primary' : 
                          bet.won === false ? 'text-danger' : 'text-text-muted'
                        }`}>
                          {bet.outcome}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-mono">${bet.amount}</td>
                      <td className="py-4 px-4 text-right font-mono">
                        <span className={bet.won ? 'text-primary' : ''}>
                          ${bet.potentialPayout.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`font-mono text-xs uppercase tracking-widest ${
                          bet.status === 'settled' ? 'text-accent' : 'text-text-muted'
                        }`}>
                          {bet.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="card">
          <h3 className="font-display font-bold mb-4">QUICK ACTIONS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-mono text-sm text-text-muted">Generate Test Data:</h4>
              <button
                onClick={() => {
                  // Add sample bets for each user
                  users.forEach((user, index) => {
                    if (index < 3) { // Only for first 3 users
                      addTestBet(user.id, events[0]?.id || '1', 'yes', 200 + index * 100, Math.random() > 0.5)
                      addTestBet(user.id, events[0]?.id || '1', 'no', 150 + index * 50, Math.random() > 0.7)
                    }
                  })
                  success('Test bets generated for first 3 users')
                }}
                className="button-secondary w-full"
              >
                <Target className="w-4 h-4 inline mr-2" />
                GENERATE TEST BETS
              </button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-mono text-sm text-text-muted">Clear All Data:</h4>
              <button
                onClick={() => {
                  if (confirm('This will delete ALL users, events, and bets. Are you sure?')) {
                    localStorage.clear()
                    success('All data cleared')
                    navigate('/register')
                  }
                }}
                className="button-danger w-full"
              >
                <Trash2 className="w-4 h-4 inline mr-2" />
                CLEAR EVERYTHING
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
