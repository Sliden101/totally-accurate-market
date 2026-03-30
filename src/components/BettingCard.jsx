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
  const outcomes = event.outcomes || ['yes', 'no'] // Fallback to yes/no for old events
  const odds = selectedOutcome ? (event.currentOdds?.[selectedOutcome] || 0.5) : 0.5
  const potentialPayout = amount ? (amount / odds).toFixed(2) : '0.00'

  const quickAmounts = [10, 25, 50, 100]

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-mono text-xs uppercase tracking-widest text-text-muted">
            AMOUNT
          </label>
          <span className="font-mono text-xs text-text-muted">
            BAL: ${balance.toFixed(2)}
          </span>
        </div>
        <input
          type="number"
          placeholder="0.00"
          className="input-base text-xl font-mono"
          value={betAmount}
          onChange={(e) => onAmountChange(e.target.value)}
          min="0"
          step="0.01"
        />
      </div>

      <div className="flex gap-2">
        {quickAmounts.map(amt => (
          <button
            key={amt}
            onClick={() => onAmountChange(amt.toString())}
            className="flex-1 py-2 font-mono text-sm border border-surface-alt hover:border-primary hover:text-primary transition-colors"
          >
            ${amt}
          </button>
        ))}
      </div>

      {selectedOutcome && betAmount && amount > 0 && (
        <div className="border-2 border-surface-alt p-4 space-y-2">
          <div className="flex justify-between font-mono text-sm">
            <span className="text-text-muted">ODDS</span>
            <span className="font-bold">{(odds * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between font-mono text-sm">
            <span className="text-text-muted">PAYOUT</span>
            <span className="font-bold text-success">${potentialPayout}</span>
          </div>
          <div className="flex justify-between font-mono text-sm pt-2 border-t border-surface-alt">
            <span className="text-text-muted">PROFIT</span>
            <span className="font-bold text-primary">+${(potentialPayout - amount).toFixed(2)}</span>
          </div>
        </div>
      )}

      <button
        onClick={onPlaceBet}
        disabled={!selectedOutcome || !betAmount || amount > balance}
        className={`w-full py-4 font-mono font-bold uppercase tracking-widest transition-all ${
          !selectedOutcome || !betAmount || amount > balance
            ? 'bg-surface-alt text-text-muted cursor-not-allowed'
            : 'button-primary'
        }`}
      >
        {amount > balance ? 'INSUFFICIENT' : 'PLACE BET'}
      </button>
    </div>
  )
}
