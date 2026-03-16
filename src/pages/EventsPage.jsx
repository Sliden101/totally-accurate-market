import { useState, useMemo } from 'react'
import { useEvents } from '../context/EventContext'
import EventCard from '../components/EventCard'
import { Search } from 'lucide-react'

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
      <div className="max-w-7xl mx-auto">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-accent font-bold">Prediction Markets</h1>
            <p className="text-text-muted">Explore and trade on real-world outcomes</p>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search markets..."
                className="input-base pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-primary text-background'
                      : 'bg-surface border border-surface-alt hover:border-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-text-muted">
              <p className="text-lg">No markets found matching your search</p>
              <p className="text-sm mt-2">Try adjusting your filters</p>
            </div>
          )}

          {/* Results Count */}
          <div className="text-center text-text-muted text-sm">
            Showing {filteredEvents.length} of {allEvents.length} markets
          </div>
        </div>
      </div>
    </div>
  )
}
