import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { EventProvider } from './context/EventContext'
import { WalletProvider } from './context/WalletContext'
import { BetProvider } from './context/BetContext'
import { NotificationProvider } from './context/NotificationContext'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import EventsPage from './pages/EventsPage'
import EventDetailPage from './pages/EventDetailPage'
import WalletPage from './pages/WalletPage'
import BetsPage from './pages/BetsPage'
import LeaderboardPage from './pages/LeaderboardPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminCreateEvent from './pages/AdminCreateEvent'
import AdminEventsList from './pages/AdminEventsList'
import AdminUserManagement from './pages/AdminUserManagement'
import AdminStatistics from './pages/AdminStatistics'
import AdminDataManager from './pages/AdminDataManager'
import ProtectedRoute from './components/ProtectedRoute'
import NavBar from './components/NavBar'
import NotificationContainer from './components/NotificationContainer'

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <WalletProvider>
          <BetProvider>
            <NotificationProvider>
              <Router>
                <div className="min-h-screen bg-background text-text">
                  <NavBar />
                  <main className="pt-16">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
                      <Route path="/event/:id" element={<ProtectedRoute><EventDetailPage /></ProtectedRoute>} />
                      <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
                      <Route path="/bets" element={<ProtectedRoute><BetsPage /></ProtectedRoute>} />
                      <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
                      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                      <Route path="/admin/create-event" element={<ProtectedRoute><AdminCreateEvent /></ProtectedRoute>} />
                      <Route path="/admin/events" element={<ProtectedRoute><AdminEventsList /></ProtectedRoute>} />
                      <Route path="/admin/users" element={<ProtectedRoute><AdminUserManagement /></ProtectedRoute>} />
                      <Route path="/admin/statistics" element={<ProtectedRoute><AdminStatistics /></ProtectedRoute>} />
                      <Route path="/admin/data-manager" element={<ProtectedRoute><AdminDataManager /></ProtectedRoute>} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                  <NotificationContainer />
                </div>
              </Router>
            </NotificationProvider>
          </BetProvider>
        </WalletProvider>
      </EventProvider>
    </AuthProvider>
  )
}

export default App
