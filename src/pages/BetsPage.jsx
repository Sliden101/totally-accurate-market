import { Link } from 'react-router-dom'
import { useBets } from '../context/BetContext'
import { useEvents } from '../context/EventContext'

function getRelativeTime(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)

  if (days < 1) return 'today'
  if (days === 1) return '1d ago'
  if (days < 7) return `${days}d ago`
  if (weeks === 1) return '1w ago'
  if (weeks < 4) return `${weeks}w ago`
  if (months === 1) return '1mo ago'
  return `${months}mo ago`
}

function BetItem({ bet, event }) {
  const status = bet.status
  const won = bet.won

  const statusConfig = {
    active: { label: 'PENDING', className: 'text-warning border-warning' },
    settled: won
      ? { label: 'WON', className: 'text-success border-success' }
      : { label: 'LOST', className: 'text-danger border-danger' }
  }

  const config = statusConfig[status]

  return (
    <Link
      to={event ? `/event/${bet.eventId}` : '#'}
      className="block border-2 border-surface-alt p-4 hover:border-primary transition-colors"
    >
      <div className="flex items-start justify-between gap-4 mb-2">
        <h3 className="font-display font-bold text-lg leading-tight">
          {event?.title || 'Unknown Event'}
        </h3>
        <span className={`shrink-0 px-2 py-1 border font-mono text-xs uppercase tracking-widest ${config.className}`}>
          {config.label}
        </span>
      </div>
      <div className="flex items-center gap-4 font-mono text-sm text-text-muted">
        <span className={bet.outcome === 'yes' ? 'text-success font-bold' : 'text-danger font-bold'}>
          {bet.outcome.toUpperCase()}
        </span>
        <span>•</span>
        <span>${bet.amountPlaced}</span>
        <span>•</span>
        <span className={won ? 'text-success' : bet.status === 'active' ? 'text-primary' : 'text-danger'}>
          {bet.status === 'active'
            ? `$${bet.potentialPayout}`
            : won
              ? `+$${bet.potentialPayout}`
              : `$${bet.amountPlaced}`}
        </span>
        <span className="ml-auto">{getRelativeTime(bet.createdAt)}</span>
      </div>
    </Link>
  )
}

export default function BetsPage() {
  const { getUserBets } = useBets()
  const { getEventById } = useEvents()
  const bets = getUserBets()

  const sortedBets = [...bets].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  )

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight">
            BETS
          </h1>
          <p className="font-mono text-sm text-text-muted mt-2">
            {bets.length} {bets.length === 1 ? 'BET' : 'BETS'}
          </p>
        </div>

        {sortedBets.length > 0 ? (
          <div className="space-y-3">
            {sortedBets.map(bet => (
              <BetItem
                key={bet.id}
                bet={bet}
                event={getEventById(bet.eventId)}
              />
            ))}
          </div>
        ) : (
          <div className="border-2 border-surface-alt p-8 text-center">
            <p className="font-mono text-text-muted mb-4">NO BETS YET</p>
            <Link to="/events" className="button-primary">
              BROWSE MARKETS
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
