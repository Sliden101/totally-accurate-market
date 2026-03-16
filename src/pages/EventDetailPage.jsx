import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEvents } from '../context/EventContext'
import { useAuth } from '../context/AuthContext'
import { useBets } from '../context/BetContext'
import { useWallet } from '../context/WalletContext'
import { useNotification } from '../context/NotificationContext'
import BettingCard from '../components/BettingCard'
import { ArrowLeft, TrendingUp, TrendingDown, Clock } from 'lucide-react'

export default function EventDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEventById } = useEvents()
  const { user } = useAuth()
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
          <h1 className="text-2xl font-bold">Market not found</h1>
          <button onClick={() => navigate('/events')} className="button-primary">
            Back to Markets
          </button>
        </div>
      </div>
    )
  }

  const handlePlaceBet = () => {
    if (!selectedOutcome) {
      error('Please select an outcome')
      return
    }

    if (!betAmount || parseFloat(betAmount) <= 0) {
      error('Please enter a valid amount')
      return
    }

    const amount = parseFloat(betAmount)
    if (amount > getBalance()) {
      error('Insufficient balance')
      return
    }

    try {
      placeBet(event.id, selectedOutcome, amount)
      success(`Bet placed! $${amount} on ${selectedOutcome}`)
      setBetAmount('')
      setSelectedOutcome(null)
    } catch (err) {
      error('Failed to place bet')
    }
  }

  const daysRemaining = Math.ceil(
    (new Date(event.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/events')}
          className="flex items-center gap-2 text-text-muted hover:text-primary transition"
        >
          <ArrowLeft size={20} />
          Back to Markets
        </button>

        {/* Event Header */}
        <div className="card space-y-6">
          {event.image && (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="inline-block px-3 py-1 bg-surface rounded text-sm text-primary mb-2">
                  {event.category}
                </div>
                <h1 className="text-4xl font-accent font-bold text-balance">{event.title}</h1>
              </div>
              <div className={`px-4 py-2 rounded-lg font-medium ${
                event.status === 'open'
                  ? 'bg-green-900/20 text-success'
                  : 'bg-surface-alt text-text-muted'
              }`}>
                {event.status === 'open' ? 'Open' : 'Closed'}
              </div>
            </div>

            <p className="text-text-muted text-lg">{event.description}</p>

            {/* Event Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="bg-surface rounded p-4 text-center">
                <div className="text-sm text-text-muted mb-1">Volume</div>
                <div className="text-2xl font-bold text-primary">
                  ${(event.totalVolume / 1000).toFixed(0)}K
                </div>
              </div>
              <div className="bg-surface rounded p-4 text-center">
                <div className="text-sm text-text-muted mb-1">Time Left</div>
                <div className="text-2xl font-bold text-secondary flex items-center justify-center gap-2">
                  <Clock size={20} />
                  {daysRemaining}d
                </div>
              </div>
              <div className="bg-surface rounded p-4 text-center">
                <div className="text-sm text-text-muted mb-1">Status</div>
                <div className="text-2xl font-bold">
                  {event.status === 'open' ? 'Active' : 'Resolved'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Odds Section */}
          <div className="lg:col-span-2 card">
            <h2 className="text-2xl font-accent font-bold mb-6">Current Odds</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-surface rounded-lg p-6 text-center cursor-pointer hover:border-primary border-2 border-transparent transition"
                   onClick={() => setSelectedOutcome('yes')}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span className="font-bold">YES</span>
                </div>
                <div className="text-4xl font-bold text-success">
                  {(event.currentOdds.yes * 100).toFixed(0)}%
                </div>
              </div>
              <div className="bg-surface rounded-lg p-6 text-center cursor-pointer hover:border-primary border-2 border-transparent transition"
                   onClick={() => setSelectedOutcome('no')}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-danger" />
                  <span className="font-bold">NO</span>
                </div>
                <div className="text-4xl font-bold text-danger">
                  {(event.currentOdds.no * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Resolved Section */}
            {event.resolved && (
              <div className={`p-4 rounded-lg border-l-4 ${
                event.resolvedOutcome === 'yes'
                  ? 'bg-green-900/20 border-success'
                  : 'bg-red-900/20 border-danger'
              }`}>
                <p className="font-bold">
                  Outcome: <span className="text-lg">{event.resolvedOutcome?.toUpperCase()}</span>
                </p>
              </div>
            )}
          </div>

          {/* Betting Card */}
          {event.status === 'open' && !event.resolved && (
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
