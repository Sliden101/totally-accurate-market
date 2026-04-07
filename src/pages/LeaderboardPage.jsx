import { useState } from 'react'
import { useBets } from '../context/BetContext'
import { Trophy, TrendingUp, Target, DollarSign } from 'lucide-react'

export default function LeaderboardPage() {
  const { getLeaderboardData } = useBets()
  const [sortBy, setSortBy] = useState('winnings') // 'winnings' or 'winRate'
  
  const leaderboardData = getLeaderboardData()
  
  const sortedData = [...leaderboardData].sort((a, b) => {
    if (sortBy === 'winnings') {
      return b.totalWinnings - a.totalWinnings
    } else {
      return b.winRate - a.winRate
    }
  })

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-500" />
      case 2: return <Trophy className="w-5 h-5 text-gray-400" />
      case 3: return <Trophy className="w-5 h-5 text-amber-600" />
      default: return <span className="font-mono text-sm">#{rank}</span>
    }
  }

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title mb-4">LEADERBOARD</h1>
          <p className="text-text-muted font-mono max-w-2xl mx-auto">
            Top bettors ranked by performance. See who's crushing it and who's just getting crushed.
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex border-2 border-surface-alt">
            <button
              onClick={() => setSortBy('winnings')}
              className={`px-6 py-3 font-mono text-sm uppercase tracking-wider transition-all ${
                sortBy === 'winnings' 
                  ? 'bg-primary text-background' 
                  : 'bg-surface text-text hover:text-primary'
              }`}
            >
              <DollarSign className="w-4 h-4 inline mr-2" />
              Total Winnings
            </button>
            <button
              onClick={() => setSortBy('winRate')}
              className={`px-6 py-3 font-mono text-sm uppercase tracking-wider transition-all border-l-2 border-surface-alt ${
                sortBy === 'winRate' 
                  ? 'bg-primary text-background' 
                  : 'bg-surface text-text hover:text-primary'
              }`}
            >
              <Target className="w-4 h-4 inline mr-2" />
              Win Rate
            </button>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-surface-alt">
                  <th className="text-left py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">Rank</th>
                  <th className="text-left py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">User</th>
                  <th className="text-right py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">Total Bets</th>
                  <th className="text-right py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">Win Rate</th>
                  <th className="text-right py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">Total Wagered</th>
                  <th className="text-right py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">Total Winnings</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((user, index) => {
                  console.log(`👤 User ${user.username}:`, {
                    totalBets: user.totalBets,
                    settledBets: user.settledBets,
                    wonBets: user.wonBets,
                    winRate: user.winRate,
                    totalWinnings: user.totalWinnings
                  })
                  
                  return (
                    <tr
                      key={user.id}
                      className={`border-b border-surface-alt hover:bg-surface transition-colors ${
                        index < 3 ? 'bg-surface/50' : ''
                      }`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {getRankIcon(index + 1)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-mono font-bold">{user.username}</div>
                          <div className="font-mono text-xs text-text-muted">{user.email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-mono">{user.totalBets}</td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`font-mono font-bold ${
                            user.winRate >= 60 ? 'text-primary' : 
                            user.winRate >= 40 ? 'text-accent' : 'text-text-muted'
                          }`}>
                            {user.winRate.toFixed(1)}%
                          </span>
                          {user.winRate >= 60 && <TrendingUp className="w-4 h-4 text-primary" />}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-mono">${user.totalWagered.toFixed(2)}</td>
                      <td className="py-4 px-4 text-right">
                        <span className={`font-mono font-bold ${
                          user.totalWinnings > 0 ? 'text-primary' : 'text-text-muted'
                        }`}>
                          ${user.totalWinnings.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            
            {sortedData.length === 0 && (
              <div className="text-center py-12">
                <div className="text-text-muted font-mono">No bettors yet. Be the first to place a bet!</div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Summary */}
        {sortedData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="card">
              <div className="mono-label text-primary">Total Bettors</div>
              <div className="mono-value text-primary">{sortedData.length}</div>
            </div>
            <div className="card">
              <div className="mono-label text-accent">Avg Win Rate</div>
              <div className="mono-value text-accent">
                {(sortedData.reduce((sum, u) => sum + u.winRate, 0) / sortedData.length).toFixed(1)}%
              </div>
            </div>
            <div className="card">
              <div className="mono-label text-secondary">Total Volume</div>
              <div className="mono-value text-secondary">
                ${sortedData.reduce((sum, u) => sum + u.totalWagered, 0).toFixed(0)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
