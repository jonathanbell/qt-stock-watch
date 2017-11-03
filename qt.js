var Questrade = require('questrade');
var qt = new Questrade('fj8RP1ldgOoplCEeAC3XTr9q083nPiWH0');

qt.on('ready', function() {
  qt.getSymbols(['SHOP.TO', 'OTEX.TO', 'NKE'], function(err, symbols) {
    if (err) console.log(err);
    console.log('SYMBOLS', symbols);
  });
});

// {
//   positions: [
//     {
//       symbol: 'BBD.A.TO',
//       symbolId: 10525,
//       openQuantity: 50,
//       closedQuantity: 0,
//       currentMarketValue: 139,
//       currentPrice: 2.78,
//       averageEntryPrice: 2.05,
//       closedPnl: 0,
//       openPnl: 36.5,
//       totalCost: 102.5,
//       isRealTime: false,
//       isUnderReorg: false
//     },
//     {
//       symbol: 'SHOP.TO',
//       symbolId: 9975421,
//       openQuantity: 2,
//       closedQuantity: 0,
//       currentMarketValue: 280.44,
//       currentPrice: 140.22,
//       averageEntryPrice: 135,
//       closedPnl: 0,
//       openPnl: 10.44,
//       totalCost: 270,
//       isRealTime: false,
//       isUnderReorg: false
//     },
//     {
//       symbol: 'ATVI',
//       symbolId: 6543,
//       openQuantity: 7,
//       closedQuantity: 0,
//       currentMarketValue: 457.1,
//       currentPrice: 65.3,
//       averageEntryPrice: 62.612857,
//       closedPnl: 0,
//       openPnl: 18.810001,
//       totalCost: 438.289999,
//       isRealTime: false,
//       isUnderReorg: false
//     },
//     {
//       symbol: 'OTEX.TO',
//       symbolId: 30640,
//       openQuantity: 3,
//       closedQuantity: 0,
//       currentMarketValue: 134.4,
//       currentPrice: 44.8,
//       averageEntryPrice: 40.53,
//       closedPnl: 0,
//       openPnl: 12.81,
//       totalCost: 121.59,
//       isRealTime: false,
//       isUnderReorg: false
//     }
//   ];
// }

// { symbol: 'AAPL',
// symbolId: 8049,
// tier: '',
// bidPrice: 166.65,
// bidSize: 2,
// askPrice: 166.98,
// askSize: 40,
// lastTradePriceTrHrs: 166.89,
// lastTradePrice: 166.89,
// lastTradeSize: 217,
// lastTradeTick: 'Down',
// lastTradeTime: '2017-11-01T19:59:49.154000-04:00',
// volume: 33637762,
// openPrice: 169.87,
// highPrice: 169.94,
// lowPrice: 165.61,
// delay: 0,
// isHalted: false,
// high52w: 169.94,
// low52w: 104.08,
// VWAP: 167.151982 }
