// Pure synthetic teaching example. No network, broker, storage or strategy code.
export function browserMayWrite(runtime) {
  return !runtime || runtime.owner === 'browser';
}

export function commitScheduled(runtime, expectedRevision, minute, proposedBook) {
  if (!Number.isSafeInteger(minute) || !Number.isSafeInteger(expectedRevision)) throw new Error('Invalid scheduler input');
  if (runtime.owner !== 'server' || runtime.revision !== expectedRevision || minute <= runtime.lastMinute) return {committed:false,runtime};
  if (!Number.isFinite(proposedBook.cash) || !Array.isArray(proposedBook.history)) throw new Error('Invalid synthetic book');
  // A real datastore must apply this revision check and all associated records in one transaction.
  return {committed:true,runtime:{...runtime,revision:runtime.revision+1,lastMinute:minute,book:structuredClone(proposedBook)}};
}
