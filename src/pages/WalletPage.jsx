import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useWallet } from '../context/WalletContext'
import { useBets } from '../context/BetContext'
import { useNotification } from '../context/NotificationContext'

export default function WalletPage() {
  const { user } = useAuth()
  const { transactions, getBalance, deposit, withdraw } = useWallet()
  const { getTotalWagered, getTotalWinnings, getWinRate } = useBets()
  const { success, error } = useNotification()
  const [amount, setAmount] = useState('')
  const [transactionType, setTransactionType] = useState('deposit')

  const handleTransaction = () => {
    if (!amount || parseFloat(amount) <= 0) {
      error('INVALID AMOUNT')
      return
    }

    if (transactionType === 'deposit') {
      deposit(parseFloat(amount))
      success(`DEPOSITED $${amount}`)
    } else {
      if (parseFloat(amount) > getBalance()) {
        error('INSUFFICIENT BALANCE')
        return
      }
      withdraw(parseFloat(amount))
      success(`WITHDRAWN $${amount}`)
    }

    setAmount('')
  }

  const recentTransactions = transactions.slice(-5).reverse()

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="border-2 border-surface-alt p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-text-muted mb-2">
                BALANCE
              </p>
              <h2 className="font-mono text-5xl md:text-6xl font-bold text-primary">
                ${getBalance().toFixed(2)}
              </h2>
            </div>
            <div className="font-mono text-xs text-text-muted text-right">
              <div>WAGERED: ${getTotalWagered().toFixed(2)}</div>
              <div>WON: ${getTotalWinnings().toFixed(2)}</div>
              <div>WIN RATE: {getWinRate()}%</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setTransactionType('deposit')}
                className={`font-mono text-sm uppercase tracking-widest pb-2 transition-colors ${
                  transactionType === 'deposit'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                DEPOSIT
              </button>
              <button
                onClick={() => setTransactionType('withdraw')}
                className={`font-mono text-sm uppercase tracking-widest pb-2 transition-colors ${
                  transactionType === 'withdraw'
                    ? 'text-danger border-b-2 border-danger'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                WITHDRAW
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="number"
                placeholder="0.00"
                className="input-base font-mono text-xl"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
              />

              <button
                onClick={handleTransaction}
                className="button-primary w-full"
              >
                {transactionType === 'deposit' ? 'DEPOSIT' : 'WITHDRAW'}
              </button>

              {transactionType === 'withdraw' && (
                <p className="font-mono text-xs text-text-muted text-right">
                  AVAILABLE: ${getBalance().toFixed(2)}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-sm uppercase tracking-widest text-text-muted mb-6">
              RECENT ACTIVITY
            </h3>

            {recentTransactions.length > 0 ? (
              <div className="space-y-2">
                {recentTransactions.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between py-3 border-b border-surface-alt font-mono text-sm">
                    <div className="flex-1">
                      <p className="text-text-muted">{tx.description}</p>
                      <p className="text-xs text-text-muted">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`font-bold ${
                      tx.type === 'credit' ? 'text-success' : 'text-danger'
                    }`}>
                      {tx.type === 'credit' ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-mono text-sm text-text-muted">NO ACTIVITY YET</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
