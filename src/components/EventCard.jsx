import { Link } from 'react-router-dom'
import { TrendingUp, Clock } from 'lucide-react'

export default function EventCard({ event }) {
  const daysRemaining = Math.ceil(
    (new Date(event.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  )

  return (
    <Link
      to={`/event/${event.id}`}
      className="card-hover group cursor-pointer block h-full"
    >
      {/* Image */}
      {event.image && (
        <div className="relative overflow-hidden rounded-lg mb-4 h-40">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
        </div>
      )}

      {/* Content */}
      <div className="space-y-3 flex-1 flex flex-col">
        {/* Category Badge */}
        <div className="inline-block w-fit">
          <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded">
            {event.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-accent font-bold leading-snug group-hover:text-primary transition">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-text-muted flex-1">
          {event.description}
        </p>

        {/* Odds */}
        <div className="grid grid-cols-2 gap-2 py-3 border-y border-surface-alt">
          <div className="text-center">
            <div className="text-xs text-text-muted mb-1">YES</div>
            <div className="text-xl font-bold text-success">
              {(event.currentOdds.yes * 100).toFixed(0)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-text-muted mb-1">NO</div>
            <div className="text-xl font-bold text-danger">
              {(event.currentOdds.no * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-text-muted pt-3">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              {daysRemaining} days left
            </div>
          <div className="flex items-center gap-1">
            <TrendingUp size={16} />
            ${(event.totalVolume / 1000).toFixed(1)}K
          </div>
        </div>
      </div>
    </Link>
  )
}
