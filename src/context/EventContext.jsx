import { createContext, useContext, useState, useEffect } from 'react'

const EventContext = createContext()

const SAMPLE_EVENTS = [
  {
    id: '1',
    title: 'Will AI reach AGI by 2030?',
    category: 'AI',
    description: 'Will artificial general intelligence be achieved by end of 2030?',
    currentOdds: { yes: 0.65, no: 0.35 },
    totalVolume: 125000,
    endDate: '2030-12-31',
    status: 'open',
    resolved: false,
    image: 'https://images.unsplash.com/photo-1677442d019cecf8248246fb3a3b8e0bba6eb33d?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    title: 'Bitcoin above $100k by EOY 2025?',
    category: 'Crypto',
    description: 'Will Bitcoin price exceed $100,000 by end of 2025?',
    currentOdds: { yes: 0.58, no: 0.42 },
    totalVolume: 89000,
    endDate: '2025-12-31',
    status: 'open',
    resolved: false,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f70d504c0?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    title: 'GPT-6 released in 2025?',
    category: 'AI',
    description: 'Will OpenAI release GPT-6 during 2025?',
    currentOdds: { yes: 0.42, no: 0.58 },
    totalVolume: 45000,
    endDate: '2025-12-31',
    status: 'open',
    resolved: false,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop'
  },
  {
    id: '4',
    title: 'Tesla Model 2 announced by Q2 2025?',
    category: 'Tech',
    description: 'Will Tesla announce a new affordable Model 2 by Q2 2025?',
    currentOdds: { yes: 0.72, no: 0.28 },
    totalVolume: 67000,
    endDate: '2025-06-30',
    status: 'open',
    resolved: false,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=300&fit=crop'
  },
  {
    id: '5',
    title: 'US unemployment below 3.5% in Q2 2025?',
    category: 'Economy',
    description: 'Will US unemployment rate be below 3.5% in Q2 2025?',
    currentOdds: { yes: 0.51, no: 0.49 },
    totalVolume: 92000,
    endDate: '2025-06-30',
    status: 'open',
    resolved: false,
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=300&fit=crop'
  },
  {
    id: '6',
    title: 'Olympic Games in 2024 set new records?',
    category: 'Sports',
    description: 'Will 2024 Olympic Games set new viewership or participation records?',
    currentOdds: { yes: 0.68, no: 0.32 },
    totalVolume: 54000,
    endDate: '2024-08-31',
    status: 'closed',
    resolved: true,
    resolvedOutcome: 'yes',
    image: 'https://images.unsplash.com/photo-1499747928028-0c5ae75d5a58?w=400&h=300&fit=crop'
  }
]

export function EventProvider({ children }) {
  const [events, setEvents] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem('events')
    if (stored) {
      setEvents(JSON.parse(stored))
    } else {
      setEvents(SAMPLE_EVENTS)
      localStorage.setItem('events', JSON.stringify(SAMPLE_EVENTS))
    }
  }, [])

  const getEventById = (id) => {
    return events.find(e => e.id === id)
  }

  const getOpenEvents = () => {
    return events.filter(e => e.status === 'open')
  }

  const getResolvedEvents = () => {
    return events.filter(e => e.status === 'closed')
  }

  const getEventsByCategory = (category) => {
    return events.filter(e => e.category === category)
  }

  const updateEventOdds = (eventId, newOdds) => {
    const updated = events.map(e =>
      e.id === eventId ? { ...e, currentOdds: newOdds } : e
    )
    setEvents(updated)
    localStorage.setItem('events', JSON.stringify(updated))
  }

  const resolveEvent = (eventId, outcome) => {
    const updated = events.map(e =>
      e.id === eventId
        ? { ...e, status: 'closed', resolved: true, resolvedOutcome: outcome }
        : e
    )
    setEvents(updated)
    localStorage.setItem('events', JSON.stringify(updated))
  }

  return (
    <EventContext.Provider
      value={{
        events,
        getEventById,
        getOpenEvents,
        getResolvedEvents,
        getEventsByCategory,
        updateEventOdds,
        resolveEvent
      }}
    >
      {children}
    </EventContext.Provider>
  )
}

export function useEvents() {
  const context = useContext(EventContext)
  if (!context) {
    throw new Error('useEvents must be used within EventProvider')
  }
  return context
}
