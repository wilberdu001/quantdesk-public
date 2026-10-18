/* Explicit paper execution assumptions, not a broker's actual tariff. */
const Execution = Object.freeze({
  model:'paper-bid-ask-cost-v1',perShare:0.005,minFee:1,slippageBps:2,
  fee(qty){return Math.round(Math.max(this.minFee,qty*this.perShare)*100)/100;},
  status(q,now=Date.now()){
    if(!q)return {ok:false,reason:'尚未加载真实买卖报价'};
    if(q.error)return {ok:false,reason:q.error};
    if(q.delayed===true)return {ok:false,reason:'数据源明确标注延迟，不能用于即时模拟撮合'};
    if(!(q.bid>0&&q.ask>=q.bid&&Number.isFinite(q.bid)&&Number.isFinite(q.ask)))return {ok:false,reason:'买卖价无效或交叉，停止撮合'};
    if(!Number.isFinite(q.marketTime)||q.marketTime<=0||now-q.marketTime*1000>120000||q.marketTime*1000-now>60000||!Number.isFinite(q.observedAt)||now-q.observedAt>90000)return {ok:false,reason:'真实买卖报价时间缺失或过期，停止撮合'};
    return {ok:true};
  },
  plan(q,side,qty,used={},now=Date.now()){
    const valid=this.status(q,now);if(!valid.ok)return valid;
    if(!['buy','sell'].includes(side)||!Number.isSafeInteger(qty)||qty<=0)return {ok:false,reason:'方向或数量无效'};
    const visible=side==='buy'?q.askSize:q.bidSize;
    const consumed=(used.time===q.marketTime?used[side]||0:0);
    if(used.time>q.marketTime)return {ok:false,reason:'报价时间倒退，停止撮合'};
    if(!Number.isFinite(visible)||visible<1||qty>Math.floor(visible)-consumed)return {ok:false,reason:'该报价剩余可见数量不足，不假设全部成交'};
    const touch=side==='buy'?q.ask:q.bid,direction=side==='buy'?1:-1;
    const raw=touch*(1+direction*this.slippageBps/10000);
    const price=(side==='buy'?Math.ceil(raw*100-1e-8):Math.floor(raw*100+1e-8))/100;
    if(!(price>0))return {ok:false,reason:'滑点后价格无效'};
    return {ok:true,price,commission:this.fee(qty),touch,mid:(q.bid+q.ask)/2,
      spreadCost:Math.abs(touch-(q.bid+q.ask)/2)*qty,slippageCost:Math.abs(price-touch)*qty,
      bid:q.bid,ask:q.ask,quoteTime:q.marketTime,source:q.source,executionModel:this.model,quantityCap:Math.floor(visible)};
  },
});

export {Execution};
