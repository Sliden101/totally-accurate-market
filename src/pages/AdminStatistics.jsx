import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEvents } from '../context/EventContext'
import { useBets } from '../context/BetContext'
import { ArrowLeft, BarChart3, TrendingUp, Users, DollarSign, Activity } from 'lucide-react'

export default function AdminStatistics() {
  const navigate = useNavigate()
  const { events } = useEvents()
  const { getAllUsersBets, getLeaderboardData } = useBets()
  
  const [timeRange, setTimeRange] = useState('all') // 'week', 'month', 'all'

  // Calculate statistics
  const allBets = getAllUsersBets()
  const leaderboardData = getLeaderboardData()
  const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]')

  // Volume over time (simplified - by month)
  const volumeByMonth = allBets.reduce((acc, bet) => {
    const month = new Date(bet.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    acc[month] = (acc[month] || 0) + bet.amountPlaced
    return acc
  }, {})

  // User growth over time (simplified - by month)
  const usersByMonth = allUsers.reduce((acc, user) => {
    const month = new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {})

  // Category distribution
  const categoryStats = events.reduce((acc, event) => {
    const eventBets = allBets.filter(bet => bet.eventId === event.id)
    const volume = eventBets.reduce((sum, bet) => sum + bet.amountPlaced, 0)
    
    if (!acc[event.category]) {
      acc[event.category] = {
        count: 0,
        volume: 0,
        bets: 0
      }
    }
    
    acc[event.category].count += 1
    acc[event.category].volume += volume
    acc[event.category].bets += eventBets.length
    
    return acc
  }, {})

  // Top performers
  const topWinners = leaderboardData.slice(0, 5)
  const topBettors = [...leaderboardData].sort((a, b) => b.totalWagered - a.totalWagered).slice(0, 5)

  const totalVolume = allBets.reduce((sum, bet) => sum + bet.amountPlaced, 0)
  const totalWinnings = allBets.filter(b => b.status === 'settled' && b.won).reduce((sum, bet) => sum + bet.potentialPayout, 0)
  const avgWinRate = leaderboardData.length > 0 
    ? leaderboardData.reduce((sum, u) => sum + u.winRate, 0) / leaderboardData.length 
    : 0

  // Simple bar chart component
  const SimpleBarChart = ({ data, title, color = 'bg-primary' }) => {
    const maxValue = Math.max(...Object.values(data))
    
    return (
      <div className="card">
        <h3 className="font-display font-bold mb-4">{title}</h3>
        <div className="space-y-2">
          {Object.entries(data).map(([label, value]) => (
            <div key={label} className="flex items-center gap-4">
              <div className="font-mono text-sm w-20 text-right">{label}</div>
              <div className="flex-1 bg-surface-alt rounded-full h-6 relative overflow-hidden">
                <div 
                  className={`h-full ${color} transition-all duration-500`}
                  style={{ width: `${(value / maxValue) * 100}%` }}
                />
              </div>
              <div className="font-mono text-sm w-16 text-right">
                {typeof value === 'number' ? `$${value.toFixed(0)}` : value}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Horizontal bar chart for categories
  const CategoryChart = () => {
    const sortedCategories = Object.entries(categoryStats).sort((a, b) => b[1].volume - a[1].volume)
    const maxVolume = Math.max(...sortedCategories.map(([_, stats]) => stats.volume))
    
    return (
      <div className="card">
        <h3 className="font-display font-bold mb-4">CATEGORY PERFORMANCE</h3>
        <div className="space-y-3">
          {sortedCategories.map(([category, stats]) => (
            <div key={category} className="border-b border-surface-alt pb-3 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold">{category}</span>
                <span className="font-mono text-sm text-primary">${stats.volume.toFixed(0)}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs font-mono text-text-muted">
                <div>Events: {stats.count}</div>
                <div>Bets: {stats.bets}</div>
                <div>Avg: ${stats.bets > 0 ? (stats.volume / stats.bets).toFixed(2) : '0'}</div>
              </div>
              <div className="mt-2 bg-surface-alt rounded-full h-2 relative overflow-hidden">
                <div 
                  className="h-full bg-secondary transition-all duration-500"
                  style={{ width: `${(stats.volume / maxVolume) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
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
            <h1 className="section-title">STATISTICS</h1>
          </div>
          <div className="flex gap-2">
            {['week', 'month', 'all'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 font-mono text-sm uppercase tracking-wider transition-all ${
                  timeRange === range 
                    ? 'bg-primary text-background' 
                    : 'bg-surface text-text hover:text-primary'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="mono-label text-primary">Total Volume</div>
            <div className="mono-value text-primary">${totalVolume.toFixed(0)}</div>
          </div>
          <div className="card">
            <div className="mono-label text-secondary">Total Users</div>
            <div className="mono-value text-secondary">{allUsers.length}</div>
          </div>
          <div className="card">
            <div className="mono-label text-accent">Total Bets</div>
            <div className="mono-value text-accent">{allBets.length}</div>
          </div>
          <div className="card">
            <div className="mono-label text-primary">Avg Win Rate</div>
            <div className="mono-value text-primary">{avgWinRate.toFixed(1)}%</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SimpleBarChart 
            data={volumeByMonth} 
            title="VOLUME OVER TIME" 
            color="bg-primary" 
          />
          <SimpleBarChart 
            data={usersByMonth} 
            title="USER GROWTH" 
            color="bg-secondary" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CategoryChart />
          
          {/* Top Performers */}
          <div className="card">
            <h3 className="font-display font-bold mb-4">TOP PERFORMERS</h3>
            
            <div className="mb-6">
              <h4 className="font-mono text-sm uppercase tracking-widest text-text-muted mb-3">Biggest Winners</h4>
              <div className="space-y-2">
                {topWinners.map((user, index) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm w-6">{index + 1}.</span>
                      <span className="font-mono">{user.username}</span>
                    </div>
                    <span className="font-mono text-sm text-primary">${user.totalWinnings.toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-mono text-sm uppercase tracking-widest text-text-muted mb-3">Highest Volume</h4>
              <div className="space-y-2">
                {topBettors.map((user, index) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm w-6">{index + 1}.</span>
                      <span className="font-mono">{user.username}</span>
                    </div>
                    <span className="font-mono text-sm text-secondary">${user.totalWagered.toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="card">
          <h3 className="font-display font-bold mb-4">PLATFORM ACTIVITY</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{events.length}</div>
              <div className="mono-label">Total Events</div>
              <div className="font-mono text-sm text-text-muted mt-2">
                {events.filter(e => e.status === 'open').length} open
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">{allBets.length}</div>
              <div className="mono-label">Total Bets Placed</div>
              <div className="font-mono text-sm text-text-muted mt-2">
                {allBets.filter(b => b.status === 'active').length} active
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">${totalWinnings.toFixed(0)}</div>
              <div className="mono-label">Total Winnings Paid</div>
              <div className="font-mono text-sm text-text-muted mt-2">
                {allBets.filter(b => b.status === 'settled' && b.won).length} winning bets
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
