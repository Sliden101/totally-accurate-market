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

  const settleBet = (betId, eventOutcome) => {
    const updated = bets.map(b => {
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

    setBets(updated)
    if (user) {
      localStorage.setItem(`bets_${user.id}`, JSON.stringify(updated))
    }

    return updated.find(b => b.id === betId)
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
        getTotalWinnings
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
