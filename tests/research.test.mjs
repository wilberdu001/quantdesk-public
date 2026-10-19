import test from 'node:test';
import assert from 'node:assert/strict';
import '../src/research-core.js';
const bars=Array.from({length:900},(_,i)=>({date:new Date(Date.UTC(2020,0,1+i)).toISOString().slice(0,10),o:100+i/10,h:101+i/10,l:99+i/10,c:100+i/10}));
// A deliberately simple deterministic next-open toy simulator; not the private engine.
const simulate=(b,s,c)=>({equity:[c,c*(1+s.slice(0,-1).reduce((v,x,i)=>v+x*(b[i+1].c/b[i+1].o-1),0))],trades:[]});
test('held-out partitions are ordered; rolling test windows do not overlap',()=>{const r=QuantResearch.validate(bars,simulate);assert.ok(r.segments[0].end<r.segments[1].start);for(let i=1;i<r.folds.length;i++)assert.ok(r.folds[i-1].testEnd<r.folds[i].testStart);assert.ok(r.folds.every(x=>x.trainEnd<x.testStart));});
test('future prices do not alter earlier causal signals or selected training parameters',()=>{const a=QuantResearch.validate(bars,simulate),b=QuantResearch.validate(bars.map((v,i)=>i<720?v:{...v,c:v.c*2,h:v.h*2}),simulate);assert.deepEqual(a.segments[0].params,b.segments[0].params);assert.deepEqual(a.folds.slice(0,7),b.folds.slice(0,7));});
