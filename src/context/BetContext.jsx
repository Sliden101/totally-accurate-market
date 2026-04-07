import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const BetContext = createContext()

export function BetProvider({ children }) {
  const { user } = useAuth()
  const [bets, setBets] = useState([])

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`bets_${user.id}`)
      if (stored) {
        setBets(JSON.parse(stored))
      }
    }
  }, [user])

  const placeBet = (eventId, outcome, amount) => {
    // Check if user has sufficient balance
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]')
    const currentUser = allUsers.find(u => u.id === user.id)
    
    if (!currentUser || currentUser.balance < amount) {
      throw new Error('Insufficient balance')
    }

    const bet = {
      id: Date.now().toString(),
      userId: user.id,
      eventId,
      outcome,
      amount,
      amountPlaced: amount,
      potentialPayout: amount * 2,
      status: 'active',
      createdAt: new Date().toISOString(),
      resolvedAt: null,
      resolvedOutcome: null,
      won: null
    }

    const newBets = [...bets, bet]
    setBets(newBets)
    
    if (user) {
      localStorage.setItem(`bets_${user.id}`, JSON.stringify(newBets))
    }

    // Deduct balance from user
    const updatedUsers = allUsers.map(u => 
      u.id === user.id ? { ...u, balance: u.balance - amount } : u
    )
    localStorage.setItem('allUsers', JSON.stringify(updatedUsers))
    
    // Update current session
    const updatedCurrentUser = updatedUsers.find(u => u.id === user.id)
    if (updatedCurrentUser) {
      localStorage.setItem('user', JSON.stringify(updatedCurrentUser))
      // Trigger a storage event to update other components
      window.dispatchEvent(new Event('storage'))
    }

    return bet
  }

  const getUserBets = () => {
    return bets
  }

  const getActiveBets = () => {
    return bets.filter(b => b.status === 'active')
  }

  const getSettledBets = () => {
    return bets.filter(b => b.status === 'settled')
  }

  const getBetsByEvent = (eventId) => {
    return bets.filter(b => b.eventId === eventId)
  }

  const settleBet = (betId, eventOutcome, targetUserId = null) => {
    // If targetUserId is provided, settle bet for that specific user
    // Otherwise, settle for current user (backward compatibility)
    const userId = targetUserId || user?.id
    
    if (!userId) {
      return null
    }

    // Get the specific user's bets
    const userBets = JSON.parse(localStorage.getItem(`bets_${userId}`) || '[]')
    
    const updatedBets = userBets.map(b => {
      if (b.id === betId) {
        const won = b.outcome === eventOutcome
        return {
          ...b,
          status: 'settled',
          resolvedAt: new Date().toISOString(),
          resolvedOutcome: eventOutcome,
          won
        }
      }
      return b
    })

    // Save the updated bets for this user
    localStorage.setItem(`bets_${userId}`, JSON.stringify(updatedBets))
    
    const settledBet = updatedBets.find(b => b.id === betId)
    
    // If user won, add winnings to their balance
    if (settledBet && settledBet.won) {
      
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]')
      const userBeforeUpdate = allUsers.find(u => u.id === userId)
      const updatedUsers = allUsers.map(u => 
        u.id === userId ? { ...u, balance: u.balance + settledBet.potentialPayout } : u
      )
      localStorage.setItem('allUsers', JSON.stringify(updatedUsers))
      
      const userAfterUpdate = updatedUsers.find(u => u.id === userId)
      
      // Update current session if this is the logged-in user
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
      if (currentUser.id === userId) {
        const updatedCurrentUser = updatedUsers.find(u => u.id === userId)
        if (updatedCurrentUser) {
          localStorage.setItem('user', JSON.stringify(updatedCurrentUser))
          console.log(`🔄 Updated current user session: $${updatedCurrentUser.balance}`)
          // Trigger UI update
          window.dispatchEvent(new Event('storage'))
        }
      }
    }

    // Update current user's bets state if this is the logged-in user
    if (user && user.id === userId) {
      setBets(updatedBets)
    }

    return settledBet
  }

  const getWinRate = () => {
    const settled = getSettledBets()
    if (settled.length === 0) return 0
    const won = settled.filter(b => b.won).length
    return ((won / settled.length) * 100).toFixed(1)
  }

  const getTotalWagered = () => {
    return bets.reduce((sum, b) => sum + b.amountPlaced, 0)
  }

  const getTotalWinnings = () => {
    const won = getSettledBets().filter(b => b.won)
    return won.reduce((sum, b) => sum + b.potentialPayout, 0)
  }

  const getAllUsersBets = () => {
    const allBets = []
    const users = JSON.parse(localStorage.getItem('allUsers') || '[]')
    
    users.forEach(user => {
      const userBets = JSON.parse(localStorage.getItem(`bets_${user.id}`) || '[]')
      allBets.push(...userBets.map(bet => ({ ...bet, user })))
    })
    
    return allBets
  }

  const getUserStats = (userId) => {
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

  const getLeaderboardData = () => {
    const users = JSON.parse(localStorage.getItem('allUsers') || '[]')
    const leaderboard = users
      .filter(user => !isAdmin(user)) // Filter out admin users
      .map(user => {
        const stats = getUserStats(user.id)
        return {
          ...user,
          ...stats
        }
      }) // Show all non-admin users, even if they haven't bet yet
    
    return leaderboard.sort((a, b) => b.totalWinnings - a.totalWinnings)
  }

  // Helper function to check if user is admin
  const isAdmin = (user) => {
    return user && (user.email === 'admin@jak.com' || user.email?.includes('admin'))
  }

  return (
    <BetContext.Provider
      value={{
        bets,
        placeBet,
        getUserBets,
        getActiveBets,
        getSettledBets,
        getBetsByEvent,
        settleBet,
        getWinRate,
        getTotalWagered,
        getTotalWinnings,
        getAllUsersBets,
        getUserStats,
        getLeaderboardData
      }}
    >
      {children}
    </BetContext.Provider>
  )
}

export function useBets() {
  const context = useContext(BetContext)
  if (!context) {
    throw new Error('useBets must be used within BetProvider')
  }
  return context
}
