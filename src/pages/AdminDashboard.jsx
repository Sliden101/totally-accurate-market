import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEvents } from '../context/EventContext'
import { useBets } from '../context/BetContext'
import { 
  Settings, 
  PlusCircle, 
  CheckCircle, 
  Users, 
  BarChart3, 
  TrendingUp,
  Eye,
  DollarSign,
  Activity
} from 'lucide-react'

export default function AdminDashboard() {
  const { user } = useAuth()
  const { events } = useEvents()
  const { getLeaderboardData } = useBets()
  
  const openEvents = events.filter(e => e.status === 'open')
  const resolvedEvents = events.filter(e => e.status === 'closed' && e.resolved)
  const totalUsers = JSON.parse(localStorage.getItem('allUsers') || '[]').length
  const leaderboardData = getLeaderboardData()
  const totalVolume = leaderboardData.reduce((sum, u) => sum + u.totalWagered, 0)

  const adminStats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: <Users className="w-6 h-6" />,
      color: 'text-primary'
    },
    {
      title: 'Active Events',
      value: openEvents.length,
      icon: <Activity className="w-6 h-6" />,
      color: 'text-secondary'
    },
    {
      title: 'Resolved Events',
      value: resolvedEvents.length,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'text-accent'
    },
    {
      title: 'Total Volume',
      value: `$${totalVolume.toFixed(0)}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-primary'
    }
  ]

  const adminActions = [
    {
      title: 'Create Event',
      description: 'Add new prediction events with custom odds and outcomes',
      icon: <PlusCircle className="w-8 h-8" />,
      link: '/admin/create-event',
      color: 'bg-primary text-background'
    },
    {
      title: 'Manage Events',
      description: 'View, resolve events and distribute winnings',
      icon: <CheckCircle className="w-8 h-8" />,
      link: '/admin/events',
      color: 'bg-secondary text-background'
    },
    {
      title: 'User Management',
      description: 'View users and manage account balances',
      icon: <Users className="w-8 h-8" />,
      link: '/admin/users',
      color: 'bg-accent text-background'
    },
    {
      title: 'Statistics',
      description: 'View platform analytics and performance metrics',
      icon: <BarChart3 className="w-8 h-8" />,
      link: '/admin/statistics',
      color: 'bg-primary text-background'
    },
    {
      title: 'Data Manager',
      description: 'Manage users, events, and bets with full CRUD operations',
      icon: <Settings className="w-8 h-8" />,
      link: '/admin/data-manager',
      color: 'bg-secondary text-background'
    }
  ]

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Settings className="w-8 h-8 text-primary" />
            <h1 className="section-title">ADMIN DASHBOARD</h1>
          </div>
          <p className="text-text-muted font-mono max-w-2xl mx-auto">
            Welcome back, {user?.username}. Manage the platform from here.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {adminStats.map((stat, index) => (
            <div key={index} className="card card-hover">
              <div className="flex items-center justify-between mb-2">
                <div className={stat.color}>{stat.icon}</div>
                <TrendingUp className="w-4 h-4 text-text-muted" />
              </div>
              <div className="mono-value">{stat.value}</div>
              <div className="mono-label">{stat.title}</div>
            </div>
          ))}
        </div>

        {/* Admin Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-display font-bold mb-6">ADMIN ACTIONS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adminActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="card card-hover group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 ${action.color} group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-100`}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="font-mono text-sm text-text-muted">
                      {action.description}
                    </p>
                  </div>
                  <Eye className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-display font-bold mb-6">RECENT ACTIVITY</h2>
          <div className="card">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-surface-alt">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="font-mono text-sm">System initialized</span>
                </div>
                <span className="font-mono text-xs text-text-muted">Just now</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-surface-alt">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="font-mono text-sm">Events loaded: {events.length}</span>
                </div>
                <span className="font-mono text-xs text-text-muted">Startup</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="font-mono text-sm">Admin session started</span>
                </div>
                <span className="font-mono text-xs text-text-muted">Current</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
