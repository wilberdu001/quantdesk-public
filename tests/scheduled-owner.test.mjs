import test from 'node:test';
import assert from 'node:assert/strict';
import {browserMayWrite,commitScheduled} from '../src/scheduled-owner.js';

test('overlapping scheduling attempts have one revision winner and never replay a minute',()=>{
  const initial={owner:'server',revision:7,lastMinute:100,book:{cash:1000,history:[{id:'old'}]}};
  const proposal={cash:900,history:[{id:'old'},{id:'synthetic-new'}]};
  const first=commitScheduled(initial,7,101,proposal);assert.equal(first.committed,true);
  assert.equal(commitScheduled(first.runtime,7,101,proposal).committed,false);
  assert.equal(commitScheduled(first.runtime,8,101,proposal).committed,false);
  assert.deepEqual(initial.book,{cash:1000,history:[{id:'old'}]});
  proposal.history.push({id:'late-local-mutation'});assert.equal(first.runtime.book.history.length,2);
});

test('ownership fences old browser writes and preserves the paused book through a process restart',()=>{
  const runtime={owner:'server',revision:1,lastMinute:0,book:{cash:1000,history:[{id:'retained'}]}};
  assert.equal(browserMayWrite(runtime),false);assert.equal(browserMayWrite(null),true);
  const restored=JSON.parse(JSON.stringify(runtime));
  const resumed=commitScheduled(restored,1,3,restored.book);
  assert.equal(resumed.runtime.lastMinute,3);assert.equal(resumed.runtime.book.history.length,1);
  const released={...resumed.runtime,owner:'browser'};
  assert.equal(browserMayWrite(released),true);
  assert.equal(commitScheduled(released,released.revision,4,released.book).committed,false);
});
