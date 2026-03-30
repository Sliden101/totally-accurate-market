import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEvents } from '../context/EventContext'
import { useNotification } from '../context/NotificationContext'
import { ArrowLeft, Plus, X, Calendar, Hash } from 'lucide-react'

const CATEGORIES = ['AI', 'Crypto', 'Tech', 'Economy', 'Sports', 'Politics', 'Entertainment', 'Science']

export default function AdminCreateEvent() {
  const navigate = useNavigate()
  const { events, setEvents } = useEvents()
  const { success, error } = useNotification()
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'AI',
    description: '',
    endDate: '',
    outcomes: ['Yes', 'No'],
    odds: { yes: 0.5, no: 0.5 },
    image: ''
  })
  
  const [newOutcome, setNewOutcome] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addOutcome = () => {
    if (newOutcome.trim() && !formData.outcomes.includes(newOutcome.trim())) {
      const updatedOutcomes = [...formData.outcomes, newOutcome.trim()]
      setFormData(prev => ({
        ...prev,
        outcomes: updatedOutcomes,
        odds: updatedOutcomes.reduce((acc, outcome, index) => {
          acc[outcome.toLowerCase()] = 1 / updatedOutcomes.length
          return acc
        }, {})
      }))
      setNewOutcome('')
    }
  }

  const removeOutcome = (outcome) => {
    if (formData.outcomes.length > 2) {
      const updatedOutcomes = formData.outcomes.filter(o => o !== outcome)
      setFormData(prev => ({
        ...prev,
        outcomes: updatedOutcomes,
        odds: updatedOutcomes.reduce((acc, outcome, index) => {
          acc[outcome.toLowerCase()] = 1 / updatedOutcomes.length
          return acc
        }, {})
      }))
    }
  }

  const updateOdds = (outcome, value) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 1) {
      setFormData(prev => ({
        ...prev,
        odds: {
          ...prev.odds,
          [outcome]: numValue
        }
      }))
    }
  }

  const normalizeOdds = () => {
    const total = Object.values(formData.odds).reduce((sum, odd) => sum + odd, 0)
    if (total > 0) {
      const normalized = Object.keys(formData.odds).reduce((acc, key) => {
        acc[key] = formData.odds[key] / total
        return acc
      }, {})
      setFormData(prev => ({ ...prev, odds: normalized }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('🚀 Form submitted!')
    console.log('📝 Form data:', formData)
    
    if (!formData.title || !formData.description || !formData.endDate) {
      console.log('❌ Validation failed:', { title: !!formData.title, description: !!formData.description, endDate: !!formData.endDate })
      error('Please fill in all required fields')
      return
    }
    
    console.log('✅ Creating event:', {
      title: formData.title,
      category: formData.category,
      outcomes: formData.outcomes.length,
      endDate: formData.endDate
    })
    
    const newEvent = {
      id: (events.length + 1).toString(),
      title: formData.title,
      category: formData.category,
      description: formData.description,
      outcomes: formData.outcomes,  // Add this line
      currentOdds: formData.odds,
      totalVolume: 0,
      endDate: formData.endDate,
      status: 'open',
      resolved: false,
      image: formData.image || `https://images.unsplash.com/photo-${Date.now()}?w=400&h=300&fit=crop`
    }
    
    console.log('💾 Saving to localStorage...')
    const updatedEvents = [...events, newEvent]
    localStorage.setItem('events', JSON.stringify(updatedEvents))
    console.log('✅ Events saved:', updatedEvents.length)
    
    console.log('🔄 Navigating to /admin/events...')
    success('Event created successfully!')
    navigate('/admin/events')
  }

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="button-ghost p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="section-title">CREATE EVENT</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="card">
            <h2 className="text-xl font-display font-bold mb-6">BASIC INFORMATION</h2>
            <div className="space-y-6">
              <div>
                <label className="mono-label block mb-2">Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input-base w-full"
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="mono-label block mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input-base w-full"
                >
                  <option value="AI">AI</option>
                  <option value="Crypto">Crypto</option>
                  <option value="Tech">Tech</option>
                  <option value="Economy">Economy</option>
                  <option value="Sports">Sports</option>
                  <option value="Politics">Politics</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Science">Science</option>
                </select>
              </div>

              <div>
                <label className="mono-label block mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input-base w-full h-32"
                  placeholder="Enter event description"
                />
              </div>

              <div>
                <label className="mono-label block mb-2">Event Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="input-base w-full"
                  placeholder="https://example.com/image.jpg (optional)"
                />
                {formData.image && (
                  <div className="mt-2">
                    <img 
                      src={formData.image} 
                      alt="Event preview" 
                      className="w-full h-32 object-cover border-2 border-surface-alt"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="mono-label block mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="input-base w-full"
                />
              </div>
            </div>
          </div>

          {/* Outcomes */}
          <div className="card">
            <h2 className="text-xl font-display font-bold mb-6">OUTCOMES & ODDS</h2>
            
            <div className="space-y-4">
              <div>
                <label className="mono-label block mb-2">Current Outcomes</label>
                <div className="space-y-2">
                  {formData.outcomes.map((outcome, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex-1 flex items-center gap-4">
                        <Hash className="w-4 h-4 text-text-muted" />
                        <span className="font-mono font-medium flex-1">{outcome}</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="1"
                            value={formData.odds[outcome.toLowerCase()]}
                            onChange={(e) => updateOdds(outcome.toLowerCase(), e.target.value)}
                            className="w-20 input-base text-sm"
                          />
                          <span className="font-mono text-sm text-text-muted">
                            ({(formData.odds[outcome.toLowerCase()] * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      {formData.outcomes.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOutcome(outcome)}
                          className="button-ghost p-2 text-danger hover:text-danger"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="mono-label block mb-2">Add New Outcome</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newOutcome}
                    onChange={(e) => setNewOutcome(e.target.value)}
                    className="input-base flex-1"
                    placeholder="Enter outcome name"
                  />
                  <button
                    type="button"
                    onClick={addOutcome}
                    className="button-secondary"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={normalizeOdds}
                className="button-ghost text-sm"
              >
                Normalize Odds (ensure they sum to 100%)
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="button-primary"
            >
              CREATE EVENT
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="button-secondary"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
