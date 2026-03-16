import { TrendingUp, TrendingDown } from 'lucide-react'

export default function BettingCard({
  selectedOutcome,
  betAmount,
  onAmountChange,
  onOutcomeSelect,
  onPlaceBet,
  balance,
  event
}) {
  const amount = parseFloat(betAmount) || 0
  const odds = selectedOutcome === 'yes' ? event.currentOdds.yes : event.currentOdds.no
  const potentialPayout = amount ? (amount / odds).toFixed(2) : '0.00'

  const quickAmounts = [10, 25, 50, 100]

  // Simplified button class helpers
  const getOutcomeButtonClass = (outcome) => {
    const isSelected = selectedOutcome === outcome
    const base = 'p-3 rounded-lg border-2 transition font-medium flex items-center justify-center gap-2'
    if (isSelected) {
      return outcome === 'yes' 
        ? `${base} border-success bg-success/20 text-success`
        : `${base} border-danger bg-danger/20 text-danger`
    }
    return outcome === 'yes'
      ? `${base} border-surface-alt hover:border-success text-text`
      : `${base} border-surface-alt hover:border-danger text-text`
  }

  return (
    <div className="card space-y-6">
      <h3 className="text-xl font-accent font-bold">Place Your Bet</h3>

        {/* Outcome Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Choose what you think will happen</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onOutcomeSelect('yes')}
                className={getOutcomeButtonClass('yes')}
              >
                <TrendingUp size={18} />
                YES
              </button>
              <button
                onClick={() => onOutcomeSelect('no')}
                className={getOutcomeButtonClass('no')}
              >
                <TrendingDown size={18} />
                NO
              </button>
            </div>
        </div>

       {/* Amount Input */}
       <div className="space-y-3">
         <div className="flex items-center justify-between">
           <label className="text-sm font-medium">How much do you want to bet?</label>
           <span className="text-xs text-text-muted">Balance: ${balance.toFixed(2)}</span>
         </div>
         <input
           type="number"
           placeholder="0.00"
           className="input-base"
           value={betAmount}
           onChange={(e) => onAmountChange(e.target.value)}
           min="0"
           step="0.01"
         />
       </div>

       {/* Quick Amount Buttons */}
       <div className="space-y-2">
         <label className="text-xs font-medium text-text-muted">Quick bet amounts</label>
         <div className="grid grid-cols-4 gap-2">
           {quickAmounts.map(amt => (
             <button
               key={amt}
               onClick={() => onAmountChange(amt.toString())}
               className="py-1 px-2 text-sm rounded bg-surface hover:bg-surface-alt border border-surface-alt transition"
             >
               ${amt}
             </button>
           ))}
         </div>
       </div>

      {/* Odds Display */}
      {selectedOutcome && betAmount && (
        <div className="bg-surface rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-text-muted text-sm">Your Odds</span>
            <span className="font-bold">{(odds * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-muted text-sm">Potential Payout</span>
            <span className="font-bold text-success">${potentialPayout}</span>
          </div>
          <div className="border-t border-surface-alt pt-2 flex justify-between items-center">
            <span className="text-text-muted text-sm">Potential Profit</span>
            <span className="font-bold text-accent">${(potentialPayout - amount).toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Place Bet Button */}
      <button
        onClick={onPlaceBet}
        disabled={!selectedOutcome || !betAmount || amount > balance}
        className={`w-full py-3 rounded-lg font-bold transition ${
          !selectedOutcome || !betAmount || amount > balance
            ? 'bg-surface-alt text-text-muted cursor-not-allowed'
            : 'button-primary'
        }`}
      >
        {amount > balance ? 'Insufficient Balance' : 'Place Bet'}
      </button>

      {/* Info */}
      <p className="text-xs text-text-muted text-center">
        Your balance will be updated immediately after placing the bet
      </p>
    </div>
  )
}
