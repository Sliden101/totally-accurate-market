import { useNotification } from '../context/NotificationContext'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotification()

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-danger" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-warning" />
      default:
        return <Info className="w-5 h-5 text-secondary" />
    }
  }

  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-900/20 border-success/30'
      case 'error':
        return 'bg-red-900/20 border-danger/30'
      case 'warning':
        return 'bg-yellow-900/20 border-warning/30'
      default:
        return 'bg-blue-900/20 border-secondary/30'
    }
  }

  return (
    <div className="fixed top-20 right-4 z-40 space-y-2 max-w-sm">
      {notifications.map(notif => (
        <div
          key={notif.id}
          className={`${getBgColor(notif.type)} border rounded-lg p-4 flex items-center gap-3 animate-slide-up`}
        >
          {getIcon(notif.type)}
          <span className="flex-1 text-sm">{notif.message}</span>
          <button
            onClick={() => removeNotification(notif.id)}
            className="p-1 hover:bg-surface rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
