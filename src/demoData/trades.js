import { getRandom } from './util';
function generateTrade(tx) {
  const price = getRandomPrice();                            
  const date = (new Date(Date.now() - getRandom(Date.now() - 1300000000000))).toISOString();
  const type = getRandomTradeType();
  const amount = getRandom(100, 20);
  const amountCurrency = getRandomCurrency();
  const total = getRandom(20, 4);
  return { price, date, type, amount, amountCurrency };
}


function generateTradesBlock(n = 20, tx) {
  tx = tx || 'http://etherscan.io';
  const trades = [];
  for(let i = 0; i < n; i++) {
    trades.push(generateTrade(tx));
  }
  return trades;
}

function getRandomTradeType() {
  return Math.random() > 0.5 ? 'Sell' : 'Buy';
}

function getRandomPrice() {
  return getRandom(10, 2);
}

const buyCurrencies = ['USDT', 'ETH', 'XRP', 'BCH', 'LTC'];
function getRandomCurrency() {
  return buyCurrencies[getRandom(buyCurrencies.length)];
}

export function generateTrades(numberOfBlock) {
  numberOfBlock = numberOfBlock || getRandom(4, 2);
  const trades = [];
  for(let i = 0; i < numberOfBlock; i++) {
    trades.push(generateTradesBlock(getRandom(10, 4)));
  }
  return trades;
}
