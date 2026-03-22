import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEvents } from '../context/EventContext'
import { useAuth } from '../context/AuthContext'
import { useBets } from '../context/BetContext'
import { useWallet } from '../context/WalletContext'
import { useNotification } from '../context/NotificationContext'
import BettingCard from '../components/BettingCard'
import { ArrowLeft, Clock } from 'lucide-react'

export default function EventDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEventById } = useEvents()
  const { user, refreshUser } = useAuth()
  const { placeBet } = useBets()
  const { getBalance } = useWallet()
  const { success, error } = useNotification()

  const event = getEventById(id)
  const [betAmount, setBetAmount] = useState('')
  const [selectedOutcome, setSelectedOutcome] = useState(null)

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-display font-bold">NOT FOUND</h1>
          <button onClick={() => navigate('/events')} className="button-primary">
            BACK
          </button>
        </div>
      </div>
    )
  }

  const handlePlaceBet = () => {
    if (!selectedOutcome || !betAmount) {
      error('SELECT OUTCOME AND ENTER AMOUNT')
      return
    }

    // Refresh user data to get latest balance from localStorage
    refreshUser()
    
    const amount = parseFloat(betAmount)
    const currentBalance = getBalance()
    
    console.log(`💰 Betting check:`)
    console.log(`  - User state balance: $${user?.balance || 0}`)
    console.log(`  - Fresh balance: $${currentBalance}`)
    console.log(`  - Bet amount: $${amount}`)
    console.log(`  - Can bet: ${amount <= currentBalance}`)
    
    if (amount > currentBalance) {
      error('INSUFFICIENT BALANCE')
      return
    }

    try {
      placeBet(event.id, selectedOutcome, amount)
      success(`BET PLACED: $${amount} ON ${selectedOutcome.toUpperCase()}`)
      setBetAmount('')
      setSelectedOutcome(null)
      // Refresh again after betting to update UI
      refreshUser()
    } catch (err) {
      console.error('❌ Bet failed:', err.message)
      error('BET FAILED')
    }
  }

  const daysRemaining = Math.ceil(
    (new Date(event.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <button
          onClick={() => navigate('/events')}
          className="flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          BACK
        </button>

        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-64 object-cover border-2 border-surface-alt"
          />
        )}

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
                {event.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight mt-2">
                {event.title}
              </h1>
            </div>
            <div className={`px-4 py-2 font-mono text-sm uppercase tracking-widest ${
              event.status === 'open'
                ? 'bg-success/10 text-success border border-success'
                : 'bg-surface border border-surface-alt text-text-muted'
            }`}>
              {event.status === 'open' ? 'OPEN' : 'CLOSED'}
            </div>
          </div>

          <p className="text-text-muted font-mono text-sm">{event.description}</p>

          <div className="flex gap-8 py-4 border-y border-surface-alt font-mono text-sm">
            <div>
              <span className="text-text-muted">VOLUME</span>
              <span className="ml-2 text-primary font-bold">${(event.totalVolume / 1000).toFixed(0)}K</span>
            </div>
            <div>
              <span className="text-text-muted">TIME</span>
              <span className="ml-2 text-accent font-bold">{daysRemaining}d LEFT</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(event.currentOdds).map(outcome => (
                <button
                  onClick={() => setSelectedOutcome(outcome)}
                  className={`py-8 border-2 font-mono text-center transition-all ${
                    selectedOutcome === outcome
                      ? 'border-success bg-success/10 text-success'
                      : 'border-surface-alt hover:border-success hover:text-success'
                  }`}
                >
                  <div className="font-bold text-3xl mb-1">{outcome.toUpperCase()}</div>
                  <div className="text-sm">{(event.currentOdds[outcome] * 100).toFixed(0)}%</div>
                </button>
              ))}
            </div>
            </div>

            {event.resolved && (
              <div className={`p-4 border-l-4 ${
                event.resolvedOutcome === 'yes'
                  ? 'border-success bg-success/5'
                  : 'border-danger bg-danger/5'
              }`}>
                <p className="font-mono text-sm uppercase tracking-widest">
                  RESULT: <span className="font-bold text-xl">{event.resolvedOutcome?.toUpperCase()}</span>
                </p>
              </div>
            )}
          {event.resolved && (
            <div className={`p-4 border-l-4 ${
              event.resolvedOutcome === 'yes'
                ? 'border-success bg-success/5'
                : 'border-danger bg-danger/5'
            }`}>
              <p className="font-mono text-sm uppercase tracking-widest">
                RESULT: <span className="font-bold text-xl">{event.resolvedOutcome?.toUpperCase()}</span>
              </p>
            </div>
          )}
          {event.status === 'open' && (
            <BettingCard
              selectedOutcome={selectedOutcome}
              betAmount={betAmount}
              onAmountChange={setBetAmount}
              onOutcomeSelect={setSelectedOutcome}
              onPlaceBet={handlePlaceBet}
              balance={getBalance()}
              event={event}
            />
          )}
        </div>
      </div>
    </div>
  )
}
