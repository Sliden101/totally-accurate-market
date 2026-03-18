import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEvents } from '../context/EventContext'
import { ChevronRight } from 'lucide-react'
import EventCard from '../components/EventCard'
import BackgroundEvents from '../components/BackgroundEvents'

export default function HomePage() {
  const { user } = useAuth()
  const { getOpenEvents } = useEvents()
  const openEvents = getOpenEvents().slice(0, 3)

  return (
    <div className="w-full">
      <section className="min-h-screen flex items-center px-4 py-20 bg-background relative overflow-hidden">
        <BackgroundEvents />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-none tracking-tight">
              BET ON
              <br />
              <span className="text-primary">ANYTHING.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-text-muted max-w-xl font-mono">
              No jargon. No BS. Just put your money where your mouth is and find out if you're right.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <>
                  <Link to="/events" className="button-primary text-lg px-8 py-4 inline-flex items-center gap-2 justify-center">
                    MARKETS
                    <ChevronRight size={20} />
                  </Link>
                  <Link to="/wallet" className="button-secondary text-lg px-8 py-4">
                    WALLET
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="button-primary text-lg px-8 py-4 inline-flex items-center gap-2 justify-center">
                    START
                    <ChevronRight size={20} />
                  </Link>
                  <Link to="/login" className="button-secondary text-lg px-8 py-4">
                    LOGIN
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center gap-8 pt-8">
              <div>
                <div className="font-mono text-3xl font-bold text-primary">$2.5M</div>
                <div className="font-mono text-xs text-text-muted uppercase tracking-widest">VOLUME</div>
              </div>
              <div className="w-px h-12 bg-surface-alt"></div>
              <div>
                <div className="font-mono text-3xl font-bold text-secondary">50K</div>
                <div className="font-mono text-xs text-text-muted uppercase tracking-widest">TRADERS</div>
              </div>
              <div className="w-px h-12 bg-surface-alt"></div>
              <div>
                <div className="font-mono text-3xl font-bold text-accent">240+</div>
                <div className="font-mono text-xs text-text-muted uppercase tracking-widest">MARKETS</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {openEvents.length > 0 && (
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {openEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {user && (
            <div className="mt-8 text-left">
              <Link to="/events" className="button-secondary inline-flex items-center gap-2">
                ALL MARKETS
                <ChevronRight size={20} />
              </Link>
            </div>
          )}
        </section>
      )}

      {!user && (
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto border-2 border-primary p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              STOP PREDICTING.
              <br />
              <span className="text-primary">START BETTING.</span>
            </h2>
            <p className="text-text-muted font-mono mb-8">
              Get $1,000 free to start. Lose it or double it. We don't care.
            </p>
            <Link to="/register" className="button-primary inline-block px-8 py-4">
              JOIN NOW
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
