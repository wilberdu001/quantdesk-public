import test from 'node:test';
import assert from 'node:assert/strict';
import {acknowledgeRetry,inventoryView} from '../src/state-consistency.js';

test('a lost acknowledgement advances the version without dropping a newer edit',()=>{
  assert.deepEqual(acknowledgeRetry('old',{value:'old',version:8},false),{action:'saved',version:8});
  assert.equal(acknowledgeRetry('old',{value:'old',version:8},true).action,'send-newer');
  assert.equal(acknowledgeRetry('old',{value:'other',version:9},true).action,'recover');
});

test('external exits and ambiguous holdings cannot become phantom positions or stale close orders',()=>{
  const history={qty:12,avgCost:100,realized:17},before=JSON.stringify(history);
  assert.deepEqual(inventoryView(history,null),{state:'flat',qty:0,historicalQty:12,canClose:false});
  for(const ledger of [{qty:5,avgCost:100},{qty:-12,avgCost:100},{qty:12,avgCost:90}])assert.equal(inventoryView(history,ledger).state,'reconcile');
  assert.equal(inventoryView(history,{qty:12,avgCost:100}).canClose,true);
  assert.equal(inventoryView(history,{qty:12,avgCost:100},true).canClose,false);
  assert.equal(JSON.stringify(history),before);
});
