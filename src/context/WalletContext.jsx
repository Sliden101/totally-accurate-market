import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const WalletContext = createContext()

export function WalletProvider({ children }) {
  const { user, updateUser } = useAuth()
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`transactions_${user.id}`)
      if (stored) {
        setTransactions(JSON.parse(stored))
      }
    }
  }, [user])

  const getBalance = () => {
    return user?.balance || 0
  }

  const addTransaction = (type, amount, description, eventId) => {
    const transaction = {
      id: Date.now().toString(),
      type,
      amount,
      description,
      eventId,
      timestamp: new Date().toISOString(),
      balanceBefore: user.balance,
      balanceAfter: user.balance + (type === 'credit' ? amount : -amount)
    }

    const newBalance = transaction.balanceAfter
    const updatedUser = { ...user, balance: newBalance }
    updateUser(updatedUser)

    const newTransactions = [...transactions, transaction]
    setTransactions(newTransactions)
    
    if (user) {
      localStorage.setItem(`transactions_${user.id}`, JSON.stringify(newTransactions))
    }

    return transaction
  }

  const deposit = (amount) => {
    return addTransaction('credit', amount, 'Deposit', null)
  }

  const withdraw = (amount) => {
    if (user.balance >= amount) {
      return addTransaction('debit', amount, 'Withdrawal', null)
    }
    return null
  }

  const placeBet = (eventId, amount, outcome) => {
    if (user.balance >= amount) {
      return addTransaction('debit', amount, `Bet on ${outcome}`, eventId)
    }
    return null
  }

  const settleWin = (amount, eventId) => {
    return addTransaction('credit', amount, `Winnings from event`, eventId)
  }

  return (
    <WalletContext.Provider
      value={{
        transactions,
        getBalance,
        addTransaction,
        deposit,
        withdraw,
        placeBet,
        settleWin
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider')
  }
  return context
}
