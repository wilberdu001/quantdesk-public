import fs from 'node:fs';
import {Execution} from '../src/execution.js';
const now=Date.UTC(2026,9,1,15),results=[];
for(const shares of [10,100,1000])for(const spread of [.02,.2,1]){
 const q={source:'synthetic fixed-midpoint control',bid:100-spread/2,ask:100+spread/2,bidSize:100000,askSize:100000,marketTime:now/1000,observedAt:now,delayed:false};
 const buy=Execution.plan(q,'buy',shares,{},now),sell=Execution.plan(q,'sell',shares,{},now);
 if(!buy.ok||!sell.ok)throw new Error('Invalid experiment input');
 const round=v=>Math.round(v*1e8)/1e8;
 const spreadCost=round(buy.spreadCost+sell.spreadCost),slippageCost=round(buy.slippageCost+sell.slippageCost),commission=buy.commission+sell.commission,netPnl=round((sell.price-buy.price)*shares-commission);
 if(Math.abs(netPnl+spreadCost+slippageCost+commission)>1e-6)throw new Error('Cost conservation failed');
 results.push({shares,spread,midpointPnl:0,buyPrice:buy.price,sellPrice:sell.price,spreadCost,slippageCost,commission,netPnl});
}
const out=new URL('../results/execution-costs.json',import.meta.url);fs.mkdirSync(new URL('../results/',import.meta.url),{recursive:true});
fs.writeFileSync(out,JSON.stringify({data:'synthetic controlled scenarios; not live performance',assumptions:{perShare:Execution.perShare,minFee:Execution.minFee,slippageBps:Execution.slippageBps},results},null,2)+'\n');
console.table(results);
