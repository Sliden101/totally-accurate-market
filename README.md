# TAM Prediction Market

A modern prediction market platform built with Bun, React, and Vite. Trade on real-world outcomes and earn returns based on accurate predictions.

## Stack

- **Runtime**: Bun
- **Framework**: React 18.3
- **Build Tool**: Vite 5
- **Routing**: React Router DOM 6
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React

## Features

- **User Authentication**: Register and login with persistent session storage
- **Prediction Markets**: Browse and trade on various market categories (AI, Crypto, Tech, Economy, Sports)
- **Real-Time Odds**: Dynamic odds calculation based on market activity
- **Betting System**: Place bets with potential payouts calculated instantly
- **Wallet Management**: Deposit, withdraw, and track transaction history
- **Win Statistics**: View win rate, total wagered, and total winnings
- **Responsive Design**: Mobile-first design that works on all devices

## Getting Started

### Prerequisites

- Bun (v1.0+)
- Node.js 18+ (for compatibility)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd tam-prediction-market

# Install dependencies
bun install

# Run development server
bun dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
bun run build
bun run preview
```

## Project Structure

```
src/
├── pages/           # Page components
├── components/      # Reusable components
├── context/         # React Context providers
├── App.jsx          # Main app component
├── main.jsx         # Entry point
└── globals.css      # Global styles

public/             # Static assets
index.html          # HTML template
vite.config.js      # Vite configuration
tailwind.config.js  # Tailwind configuration
```

## Context Providers

The app uses React Context for state management:

- **AuthContext**: User authentication and profile
- **EventContext**: Market events and odds
- **WalletContext**: Balance and transaction history
- **BetContext**: User bets and statistics
- **NotificationContext**: Toast notifications

## Data Persistence

All data is persisted to localStorage:
- User accounts and balance
- Events and market data
- User bets and transactions
- Wallet history

## Demo Credentials

For testing, you can use:
- **Email**: demo@example.com
- **Password**: demo123

New users receive a $1,000 welcome bonus.

## Features Breakdown

### Authentication
- User registration with validation
- Login/logout functionality
- Welcome bonus ($1,000) on signup

### Markets
- Browse prediction markets by category
- Search and filter functionality
- Real-time odds display
- Market status (open/closed/resolved)

### Betting
- Place bets with custom amounts
- Quick amount buttons ($10, $25, $50, $100)
- Potential payout calculation
- Bet settlement and winnings

### Wallet
- View current balance
- Deposit and withdraw funds
- Transaction history
- Win rate and statistics

## Styling

The project uses custom Tailwind CSS with a dark theme:
- **Primary**: Orange (#F97316)
- **Secondary**: Cyan (#0891B2)
- **Accent**: Amber (#F59E0B)
- **Background**: Slate (#0F172A)
- **Surface**: Slate (#1E293B)

Custom utilities are available in `src/globals.css`:
- `.glass` - Glassmorphism effect
- `.button-*` - Button variants
- `.input-base` - Input styling
- `.card` - Card component styles

## Browser Support

Works on all modern browsers (Chrome, Firefox, Safari, Edge)

## Future Enhancements

- WebSocket integration for real-time market updates
- Backend API integration
- User profile customization
- Social features (follow users, share bets)
- Advanced analytics and charting
- Mobile app (React Native)

## License

MIT
