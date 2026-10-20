// Synthetic decision model; no account persistence or trading side effects.
export function acknowledgeRetry(sent, server, changedInFlight) {
  if (sent !== server.value) return {action:'recover', version:server.version};
  return {action:changedInFlight ? 'send-newer' : 'saved', version:server.version};
}

export function inventoryView(recorded, ledger, ambiguous = false) {
  const actual = ledger?.qty || 0;
  const matched = recorded.qty === actual && (!actual ||
    (!ambiguous && Math.abs(recorded.avgCost - ledger.avgCost) < 1e-6));
  return {state:matched ? 'confirmed' : actual ? 'reconcile' : 'flat',
    qty:matched ? recorded.qty : 0, historicalQty:recorded.qty, canClose:matched && !!actual};
}
