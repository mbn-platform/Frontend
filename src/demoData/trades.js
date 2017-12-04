import { getRandom } from './util';
function generateTrade(tx) {
  const price = getRandomPrice();
  const date = (new Date()).toISOString();
  const type = getRandomTradeType();
  const amount = getRandom(100, 20);
  const amountCurrency = getRandomCurrency();
  const total = (price * amount).toFixed(5);
  return { price, date, type, amount, amountCurrency, total, tx };
}


function generateTradesBlock(n = 20, tx) {
  tx = tx || 'https://ropsten.etherscan.io/tx/0xf003ee3bdbd7c278864c2d4317669918e03b3dea7a0f5947051ea30c46e7c6f9';
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
  const random = Math.random() * 2 + 0.0001;
  const value = parseFloat(random.toFixed(5));
  return value;
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
