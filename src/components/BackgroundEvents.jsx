import { useEvents } from '../context/EventContext'

function BackgroundCard({ event }) {
  const daysRemaining = Math.ceil(
    (new Date(event.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="w-64 shrink-0 border-2 border-surface-alt bg-surface/50 p-3 grayscale opacity-20">
      <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
        {event.category}
      </span>
      <h3 className="font-display font-bold text-sm leading-tight mt-1 mb-2 line-clamp-1">
        {event.title}
      </h3>
      <div className="flex items-center justify-between font-mono text-[10px] text-text-muted">
        <span>YES {(event.currentOdds.yes * 100).toFixed(0)}%</span>
        <span>{daysRemaining}d</span>
      </div>
    </div>
  )
}

export default function BackgroundEvents() {
  const { getOpenEvents } = useEvents()
  const events = getOpenEvents()

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 flex flex-col justify-center gap-6">
        <div className="w-[200%] flex animate-scroll-left">
          {events.map(event => (
            <BackgroundCard key={event.id} event={event} />
          ))}
          {events.map(event => (
            <BackgroundCard key={`${event.id}-dup`} event={event} />
          ))}
        </div>
        <div className="w-[200%] flex animate-scroll-left" style={{ animationDelay: '-7.5s' }}>
          {[...events].reverse().map(event => (
            <BackgroundCard key={event.id} event={event} />
          ))}
          {[...events].reverse().map(event => (
            <BackgroundCard key={`${event.id}-dup`} event={event} />
          ))}
        </div>
      </div>
    </div>
  )
}
