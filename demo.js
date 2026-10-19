import {Execution} from './src/execution.js';
const el=id=>document.getElementById(id),money=v=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(v);
function render(){
 const qty=Number(el('shares').value),spread=Number(el('spread').value)/100,now=Date.now();
 const q={source:'Synthetic reference scenario',bid:100-spread/2,ask:100+spread/2,bidSize:100000,askSize:100000,marketTime:Math.floor(now/1000),observedAt:now,delayed:false};
 const buy=Execution.plan(q,'buy',qty,{},now),sell=Execution.plan(q,'sell',qty,{},now);
 if(!buy.ok||!sell.ok){el('net').textContent='Scenario unavailable';return;}
 el('shares-label').textContent=qty+' shares';el('spread-label').textContent=money(spread);el('bid').textContent=money(q.bid);el('ask').textContent=money(q.ask);
 const net=(sell.price-buy.price)*qty-buy.commission-sell.commission;
 el('net').textContent='−'+money(Math.abs(net));el('spread-cost').textContent=money(buy.spreadCost+sell.spreadCost);el('slippage-cost').textContent=money(buy.slippageCost+sell.slippageCost);el('commission').textContent=money(buy.commission+sell.commission);
 el('fills').textContent=`Illustrative fills: buy ${qty} at ${money(buy.price)}, sell ${qty} at ${money(sell.price)}. No market movement or strategy alpha assumed.`;
}
el('shares').addEventListener('input',render);el('spread').addEventListener('input',render);render();
el('check-answer').addEventListener('click',()=>{
 el('answer-feedback').textContent=el('cost-answer').value==='-27'
  ?'Correct: buy at $100.13, sell at $99.88, then subtract $2 commission. Net P&L is -$27. The reference scenario is synthetic.'
  :'Cross the spread on both legs, apply adverse slippage and cent rounding, then subtract both commissions. Try again.';
});
