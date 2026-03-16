import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useWallet } from '../context/WalletContext'
import { useBets } from '../context/BetContext'
import { useNotification } from '../context/NotificationContext'
import { DollarSign, TrendingUp, TrendingDown, Plus, Minus } from 'lucide-react'

export default function WalletPage() {
  const { user } = useAuth()
  const { transactions, getBalance, deposit, withdraw } = useWallet()
  const { getTotalWagered, getTotalWinnings, getWinRate } = useBets()
  const { success, error } = useNotification()
  const [amount, setAmount] = useState('')
  const [transactionType, setTransactionType] = useState('deposit')

  const handleTransaction = () => {
    if (!amount || parseFloat(amount) <= 0) {
      error('Please enter a valid amount')
      return
    }

    if (transactionType === 'deposit') {
      deposit(parseFloat(amount))
      success(`Deposited $${amount}`)
    } else {
      if (parseFloat(amount) > getBalance()) {
        error('Insufficient balance')
        return
      }
      withdraw(parseFloat(amount))
      success(`Withdrawn $${amount}`)
    }

    setAmount('')
  }

  const recentTransactions = transactions.slice(-5).reverse()

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-accent font-bold">Wallet</h1>
          <p className="text-text-muted">Manage your balance and track your activity</p>
        </div>

        {/* Balance Card */}
        <div className="card-hover bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-text-muted text-sm mb-2">Total Balance</p>
              <h2 className="text-5xl font-accent font-bold text-primary">
                ${getBalance().toFixed(2)}
              </h2>
            </div>
            <DollarSign className="w-12 h-12 text-primary opacity-50" />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-primary/20">
            <div>
              <p className="text-text-muted text-sm">Total Wagered</p>
              <p className="text-xl font-bold text-secondary">${getTotalWagered().toFixed(2)}</p>
            </div>
            <div>
              <p className="text-text-muted text-sm">Total Winnings</p>
              <p className="text-xl font-bold text-success">${getTotalWinnings().toFixed(2)}</p>
            </div>
            <div>
              <p className="text-text-muted text-sm">Win Rate</p>
              <p className="text-xl font-bold text-accent">{getWinRate()}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Deposit/Withdraw */}
          <div className="card">
            <h3 className="text-xl font-accent font-bold mb-6">Add Funds</h3>

            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setTransactionType('deposit')}
                  className={`flex-1 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                    transactionType === 'deposit'
                      ? 'bg-primary text-background'
                      : 'bg-surface hover:bg-surface-alt'
                  }`}
                >
                  <Plus size={18} />
                  Deposit
                </button>
                <button
                  onClick={() => setTransactionType('withdraw')}
                  className={`flex-1 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                    transactionType === 'withdraw'
                      ? 'bg-primary text-background'
                      : 'bg-surface hover:bg-surface-alt'
                  }`}
                >
                  <Minus size={18} />
                  Withdraw
                </button>
              </div>

              <input
                type="number"
                placeholder="Amount"
                className="input-base"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
              />

              <button
                onClick={handleTransaction}
                className="button-primary w-full"
              >
                {transactionType === 'deposit' ? 'Deposit' : 'Withdraw'}
              </button>

              <p className="text-xs text-text-muted text-center">
                {transactionType === 'withdraw' && `Available: $${getBalance().toFixed(2)}`}
              </p>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-2 card">
            <h3 className="text-xl font-accent font-bold mb-6">Recent Activity</h3>

            {recentTransactions.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentTransactions.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${
                        tx.type === 'credit'
                          ? 'bg-green-900/20 text-success'
                          : 'bg-red-900/20 text-danger'
                      }`}>
                        {tx.type === 'credit' ? (
                          <TrendingUp size={20} />
                        ) : (
                          <TrendingDown size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{tx.description}</p>
                        <p className="text-xs text-text-muted">
                          {new Date(tx.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`font-bold ${
                      tx.type === 'credit' ? 'text-success' : 'text-text'
                    }`}>
                      {tx.type === 'credit' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-muted text-center py-8">No transactions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
