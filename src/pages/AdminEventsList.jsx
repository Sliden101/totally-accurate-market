import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEvents } from '../context/EventContext'
import { useBets } from '../context/BetContext'
import { useWallet } from '../context/WalletContext'
import { useNotification } from '../context/NotificationContext'
import { 
  ArrowLeft, 
  Plus, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Eye,
  Users,
  Calendar
} from 'lucide-react'

export default function AdminEventsList() {
  const navigate = useNavigate()
  const { events, resolveEvent } = useEvents()
  const { getAllUsersBets, settleBet } = useBets()
  const { addToBalance } = useWallet()
  const { success, error } = useNotification()
  
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedOutcome, setSelectedOutcome] = useState('')
  const [showResolveModal, setShowResolveModal] = useState(false)

  const openEvents = events.filter(e => e.status === 'open')
  const closedEvents = events.filter(e => e.status === 'closed')

  const handleResolveEvent = () => {
    if (!selectedEvent || !selectedOutcome) {
      error('Please select an event and outcome')
      return
    }

    // Get all bets for this event
    const allBets = getAllUsersBets()
    const eventBets = allBets.filter(bet => bet.eventId === selectedEvent.id)

    // Settle all bets for each user individually
    eventBets.forEach(bet => {
      settleBet(bet.id, selectedOutcome, bet.userId)
    })

    // Mark event as resolved
    resolveEvent(selectedEvent.id, selectedOutcome)
    
    const winnersCount = eventBets.filter(b => b.outcome === selectedOutcome).length
    const totalWinnings = eventBets
      .filter(b => b.outcome === selectedOutcome)
      .reduce((sum, b) => sum + b.potentialPayout, 0)
    
    success(`Event resolved! Winnings distributed to ${winnersCount} winners. Total: $${totalWinnings.toFixed(2)}`)
    setShowResolveModal(false)
    setSelectedEvent(null)
    setSelectedOutcome('')
  }

  const getEventBetsCount = (eventId) => {
    const allBets = getAllUsersBets()
    return allBets.filter(bet => bet.eventId === eventId).length
  }

  const getEventVolume = (eventId) => {
    const allBets = getAllUsersBets()
    return allBets
      .filter(bet => bet.eventId === eventId)
      .reduce((sum, bet) => sum + bet.amountPlaced, 0)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'text-primary'
      case 'closed': return 'text-text-muted'
      default: return 'text-text-muted'
    }
  }

  const EventRow = ({ event }) => (
    <tr className="border-b border-surface-alt hover:bg-surface transition-colors">
      <td className="py-4 px-4">
        <div>
          <div className="font-mono font-bold">{event.title}</div>
          <div className="font-mono text-xs text-text-muted">{event.category}</div>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className={`font-mono text-sm uppercase tracking-widest ${getStatusColor(event.status)}`}>
          {event.status}
        </span>
        {event.resolved && (
          <div className="font-mono text-xs text-accent mt-1">
            Resolved: {event.resolvedOutcome}
          </div>
        )}
      </td>
      <td className="py-4 px-4 text-right font-mono">{getEventBetsCount(event.id)}</td>
      <td className="py-4 px-4 text-right font-mono">${getEventVolume(event.id).toFixed(2)}</td>
      <td className="py-4 px-4">
        <div className="font-mono text-xs text-text-muted">
          <Calendar className="w-3 h-3 inline mr-1" />
          {new Date(event.endDate).toLocaleDateString()}
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/event/${event.id}`)}
            className="button-ghost p-2"
          >
            <Eye className="w-4 h-4" />
          </button>
          {event.status === 'open' && (
            <button
              onClick={() => {
                setSelectedEvent(event)
                setShowResolveModal(true)
              }}
              className="button-ghost p-2 text-accent"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  )

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="button-ghost p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="section-title">MANAGE EVENTS</h1>
          </div>
          <button
            onClick={() => navigate('/admin/create-event')}
            className="button-primary"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            CREATE EVENT
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="mono-label text-primary">Total Events</div>
            <div className="mono-value text-primary">{events.length}</div>
          </div>
          <div className="card">
            <div className="mono-label text-secondary">Open Events</div>
            <div className="mono-value text-secondary">{openEvents.length}</div>
          </div>
          <div className="card">
            <div className="mono-label text-accent">Closed Events</div>
            <div className="mono-value text-accent">{closedEvents.length}</div>
          </div>
          <div className="card">
            <div className="mono-label text-primary">Total Volume</div>
            <div className="mono-value text-primary">
              ${events.reduce((sum, e) => sum + getEventVolume(e.id), 0).toFixed(0)}
            </div>
          </div>
        </div>

        {/* Open Events */}
        <div className="mb-12">
          <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-primary" />
            OPEN EVENTS
          </h2>
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-surface-alt">
                    <th className="text-left py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">Event</th>
                    <th className="text-left py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">Status</th>
                    <th className="text-right py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">
                      <Users className="w-4 h-4 inline mr-1" />
                      Bets
                    </th>
                    <th className="text-right py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Volume
                    </th>
                    <th className="text-left py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">End Date</th>
                    <th className="text-left py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {openEvents.map(event => (
                    <EventRow key={event.id} event={event} />
                  ))}
                </tbody>
              </table>
              {openEvents.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-text-muted font-mono">No open events</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Closed Events */}
        <div>
          <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-accent" />
            CLOSED EVENTS
          </h2>
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-surface-alt">
                    <th className="text-left py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">Event</th>
                    <th className="text-left py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">Status</th>
                    <th className="text-right py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">
                      <Users className="w-4 h-4 inline mr-1" />
                      Bets
                    </th>
                    <th className="text-right py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Volume
                    </th>
                    <th className="text-left py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">End Date</th>
                    <th className="text-left py-4 px-4 font-mono text-xs uppercase tracking-widest text-text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {closedEvents.map(event => (
                    <EventRow key={event.id} event={event} />
                  ))}
                </tbody>
              </table>
              {closedEvents.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-text-muted font-mono">No closed events</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resolve Modal */}
        {showResolveModal && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-surface border-2 border-surface-alt p-8 max-w-md w-full">
              <h3 className="text-xl font-display font-bold mb-4">RESOLVE EVENT</h3>
              
              <div className="mb-6">
                <div className="font-mono font-bold mb-2">{selectedEvent.title}</div>
                <div className="font-mono text-sm text-text-muted mb-4">Select the winning outcome:</div>
                
                <div className="space-y-2">
                  {Object.keys(selectedEvent.currentOdds).map(outcome => (
                    <label key={outcome} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="outcome"
                        value={outcome}
                        checked={selectedOutcome === outcome}
                        onChange={(e) => setSelectedOutcome(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="font-mono capitalize">{outcome}</span>
                      <span className="font-mono text-xs text-text-muted">
                        ({(selectedEvent.currentOdds[outcome] * 100).toFixed(1)}%)
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleResolveEvent}
                  className="button-primary flex-1"
                >
                  RESOLVE & DISTRIBUTE
                </button>
                <button
                  onClick={() => {
                    setShowResolveModal(false)
                    setSelectedEvent(null)
                    setSelectedOutcome('')
                  }}
                  className="button-secondary flex-1"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
