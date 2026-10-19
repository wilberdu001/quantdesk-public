/* Explicit paper execution assumptions, not a broker's actual tariff. */
const Execution = Object.freeze({
  model:'paper-bid-ask-cost-v1',perShare:0.005,minFee:1,slippageBps:2,
  fee(qty){return Math.round(Math.max(this.minFee,qty*this.perShare)*100)/100;},
  status(q,now=Date.now()){
    if(!q)return {ok:false,reason:'No bid/ask quote is available'};
    if(q.error)return {ok:false,reason:q.error};
    if(q.delayed===true)return {ok:false,reason:'Delayed quotes cannot be used for immediate paper fills'};
    if(!(q.bid>0&&q.ask>=q.bid&&Number.isFinite(q.bid)&&Number.isFinite(q.ask)))return {ok:false,reason:'Invalid or crossed bid/ask quote'};
    if(!Number.isFinite(q.marketTime)||q.marketTime<=0||now-q.marketTime*1000>120000||q.marketTime*1000-now>60000||!Number.isFinite(q.observedAt)||now-q.observedAt>90000)return {ok:false,reason:'Quote timestamp is missing, stale or implausibly in the future'};
    return {ok:true};
  },
  plan(q,side,qty,used={},now=Date.now()){
    const valid=this.status(q,now);if(!valid.ok)return valid;
    if(!['buy','sell'].includes(side)||!Number.isSafeInteger(qty)||qty<=0)return {ok:false,reason:'Invalid side or quantity'};
    const visible=side==='buy'?q.askSize:q.bidSize;
    const consumed=(used.time===q.marketTime?used[side]||0:0);
    if(used.time>q.marketTime)return {ok:false,reason:'Quote time moved backwards'};
    if(!Number.isFinite(visible)||visible<1||qty>Math.floor(visible)-consumed)return {ok:false,reason:'Insufficient remaining visible quote quantity'};
    const touch=side==='buy'?q.ask:q.bid,direction=side==='buy'?1:-1;
    const raw=touch*(1+direction*this.slippageBps/10000);
    const price=(side==='buy'?Math.ceil(raw*100-1e-8):Math.floor(raw*100+1e-8))/100;
    if(!(price>0))return {ok:false,reason:'Invalid price after slippage'};
    return {ok:true,price,commission:this.fee(qty),touch,mid:(q.bid+q.ask)/2,
      spreadCost:Math.abs(touch-(q.bid+q.ask)/2)*qty,slippageCost:Math.abs(price-touch)*qty,
      bid:q.bid,ask:q.ask,quoteTime:q.marketTime,source:q.source,executionModel:this.model,quantityCap:Math.floor(visible)};
  },
});

export {Execution};

