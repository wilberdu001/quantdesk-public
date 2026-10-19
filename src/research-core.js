/* Portable causal moving-average research. No broker access. */
(function(root){
  const grid=[{fast:5,slow:20},{fast:10,slow:50},{fast:20,slow:50},{fast:20,slow:100}];
  function signals(bars,p){
    if(!Number.isInteger(p.fast)||!Number.isInteger(p.slow)||p.fast<2||p.fast>=p.slow||p.slow>252)throw Error('均线参数无效');
    let a=0,b=0;return bars.map((v,i)=>{a+=v.c;b+=v.c;if(i>=p.fast)a-=bars[i-p.fast].c;if(i>=p.slow)b-=bars[i-p.slow].c;return i>=p.slow-1&&a/p.fast>b/p.slow?1:0;});
  }
  function validate(bars,simulate,config={}){
    if(bars.length<400)throw Error('至少需要400根完整日线，不能用合成数据补齐');
    for(let i=0;i<bars.length;i++)if(!/^\d{4}-\d{2}-\d{2}$/.test(bars[i].date)||![bars[i].o,bars[i].h,bars[i].l,bars[i].c].every(x=>Number.isFinite(x)&&x>0)||(i&&bars[i].date<=bars[i-1].date))throw Error('历史数据无效或日期不递增');
    const cfg={commission:1,slippage:.05,posSize:95,allowShort:false,...config};
    function run(start,end,p,capital=100000){const left=Math.max(0,start-1),prefix=bars.slice(0,end),s=signals(prefix,p);return simulate(bars.slice(left,end),s.slice(left,end),capital,cfg);}
    function select(start,end){let best;for(const p of grid){const result=run(start,end,p),value=result.equity.at(-1);if(!best||value>best.value)best={params:{...p},value};}return best;}
    const trainEnd=Math.floor(bars.length*.6),validationEnd=Math.floor(bars.length*.8),chosen=select(0,trainEnd);
    const segments=[['训练（参数选择）',0,trainEnd],['验证（固定参数）',trainEnd,validationEnd],['最终样本外（固定参数）',validationEnd,bars.length]].map(([name,start,end])=>({name,start:bars[start].date,end:bars[end-1].date,params:chosen.params,result:run(start,end,chosen.params)}));
    const folds=[];let capital=100000;
    for(let end=252;end+63<=bars.length;end+=63){const selected=select(end-252,end),result=run(end,end+63,selected.params,capital),before=capital;capital=result.equity.at(-1);folds.push({trainStart:bars[end-252].date,trainEnd:bars[end-1].date,testStart:bars[end].date,testEnd:bars[end+62].date,params:selected.params,startCapital:before,endCapital:capital,result});}
    return {grid:JSON.parse(JSON.stringify(grid)),config:cfg,segments,folds,walkForwardReturn:(capital/100000-1)*100,method:'60/20/20固定参数；252日训练/63日测试，非重叠。前一根已完成K线信号，下一根开盘成交；每段平仓计费。'};
  }
  root.QuantResearch=Object.freeze({signals,validate,grid:Object.freeze(grid.map(Object.freeze))});
})(globalThis);

