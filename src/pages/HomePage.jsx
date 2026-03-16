import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEvents } from '../context/EventContext'
import { TrendingUp, Users, Zap, ChevronRight, TrendingDown } from 'lucide-react'
import EventCard from '../components/EventCard'

export default function HomePage() {
  const { user } = useAuth()
  const { getOpenEvents } = useEvents()
  const openEvents = getOpenEvents().slice(0, 3)

  return (
    <div className="w-full">
       {/* Hero Section */}
       <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-background/50">
         <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-accent font-semibold text-balance leading-snug">
                Make Predictions That Matter
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-text-muted max-w-2xl mx-auto text-balance leading-relaxed">
                Trade on real-world events and earn returns when you're right. No jargon, just straightforward prediction trading.
              </p>
            </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link to="/events" className="button-primary text-lg px-8 py-4 inline-flex items-center gap-2 justify-center">
                  View Markets
                  <ChevronRight size={20} />
                </Link>
                <Link to="/wallet" className="button-secondary text-lg px-8 py-4">
                  My Wallet
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="button-primary text-lg px-8 py-4 inline-flex items-center gap-2 justify-center">
                  Get Started
                  <ChevronRight size={20} />
                </Link>
                <Link to="/login" className="button-secondary text-lg px-8 py-4">
                  Sign In
                </Link>
              </>
            )}
          </div>

           {/* Stats */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
             <div className="card glass/75 p-4">
               <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
               <div className="text-2xl font-semibold text-primary">$2.5M+</div>
               <p className="text-xs text-text-muted">Total Volume Traded</p>
             </div>
             <div className="card glass/75 p-4">
               <Users className="w-6 h-6 text-secondary mx-auto mb-2" />
               <div className="text-2xl font-semibold text-secondary">50K+</div>
               <p className="text-xs text-text-muted">Active Traders</p>
             </div>
             <div className="card glass/75 p-4">
               <Zap className="w-6 h-6 text-accent mx-auto mb-2" />
               <div className="text-2xl font-semibold text-accent">240+</div>
               <p className="text-xs text-text-muted">Markets</p>
             </div>
           </div>
        </div>
      </section>

      {/* Featured Markets Section */}
      {openEvents.length > 0 && (
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="space-y-4 mb-12">
            <h2 className="text-4xl font-accent font-bold">Trending Markets</h2>
            <p className="text-text-muted">Top prediction markets happening right now</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {openEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {user && (
            <div className="text-center mt-12">
              <Link to="/events" className="button-secondary inline-flex items-center gap-2">
                View All Markets
                <ChevronRight size={20} />
              </Link>
            </div>
          )}
        </section>
      )}

      {/* How It Works */}
      <section className="py-20 px-4 bg-surface/50 border-y border-surface-alt">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-accent font-bold text-center mb-16">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Create Account', desc: 'Get $1,000 welcome bonus' },
              { step: '2', title: 'Choose Markets', desc: 'Pick events to predict' },
              { step: '3', title: 'Place Bets', desc: 'Stake your capital' },
              { step: '4', title: 'Win Returns', desc: 'Earn from correct predictions' }
            ].map((item, i) => (
              <div key={i} className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary text-background font-bold flex items-center justify-center mx-auto text-lg">
                  {item.step}
                </div>
                <h3 className="font-accent font-bold">{item.title}</h3>
                <p className="text-text-muted text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-12 text-center space-y-6">
            <h2 className="text-3xl font-accent font-bold">Ready to predict?</h2>
            <p className="text-text-muted">Join thousands of traders making smart predictions and earning real returns.</p>
            <Link to="/register" className="button-primary inline-block px-8 py-3">
              Sign Up Now
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
