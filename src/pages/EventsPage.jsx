import { useState, useMemo } from 'react'
import { useEvents } from '../context/EventContext'
import EventCard from '../components/EventCard'

const CATEGORIES = ['All', 'AI', 'Crypto', 'Tech', 'Economy', 'Sports']

export default function EventsPage() {
  const { getOpenEvents } = useEvents()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  const allEvents = getOpenEvents()
  
  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [allEvents, searchTerm, selectedCategory])

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="SEARCH MARKETS..."
            className="input-base flex-1 font-mono"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 font-mono text-sm uppercase tracking-widest whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-background'
                  : 'border border-surface-alt hover:border-primary hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 font-mono text-text-muted">
            NO MARKETS FOUND
          </div>
        )}
      </div>
    </div>
  )
}
