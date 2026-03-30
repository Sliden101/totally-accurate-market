import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'

export default function EventCard({ event }) {
  const daysRemaining = Math.ceil(
    (new Date(event.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  )

  return (
    <Link
      to={`/event/${event.id}`}
      className="card-hover group cursor-pointer block h-full"
    >
      {event.image && (
        <div className="relative overflow-hidden mb-4 h-40 border-2 border-surface-alt group-hover:border-primary">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-150"
          />
        </div>
      )}

      <div className="space-y-4 flex-1 flex flex-col">
        <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
          {event.category}
        </span>

        <h3 className="text-lg font-display font-bold leading-tight group-hover:text-primary transition-colors">
          {event.title}
        </h3>

        <div className={`grid gap-2 py-4 border-y-2 border-surface-alt ${
          (event.outcomes || ['yes', 'no']).length === 2 ? 'grid-cols-2' : 
          (event.outcomes || ['yes', 'no']).length === 3 ? 'grid-cols-3' : 
          'grid-cols-4'
        }`}>
          {(event.outcomes || ['yes', 'no']).map((outcome, index) => (
            <div key={outcome} className="text-center">
              <div className="font-mono text-xs text-text-muted mb-1 truncate">
                {outcome.toUpperCase()}
              </div>
              <div className={`font-mono text-lg font-bold ${
                index % 2 === 0 ? 'text-success' : 'text-danger'
              }`}>
                {((event.currentOdds?.[outcome.toLowerCase()] || 0.5) * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between font-mono text-xs text-text-muted pt-2">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            {daysRemaining}d LEFT
          </div>
          <div>
            ${(event.totalVolume / 1000).toFixed(1)}K VOL
          </div>
        </div>
      </div>
    </Link>
  )
}
