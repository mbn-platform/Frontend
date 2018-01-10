import { getRandom } from './util';
import  rates from './rates';
function generateTrade(tx, count, dt) {
  let date = '';
  if(count < 32) {
    date = (new Date(dt.getTime() + count * 24 * 60 * 60 * 1000)).toISOString();    
  } else {
    date = (new Date(dt.getTime() +  (count - 31) * 60 * 60 * 1000 +  31 * 24 * 60 * 60 * 1000)).toISOString();    
  }

  const type = getRandomTradeType();
  const amountCurrency = getRandomCurrency();
  const fixedPrice = rates.BTC[amountCurrency];
  const percent = ((Math.random() * 2 - 1) / 10 + 1);
  const price = parseFloat((fixedPrice * percent).toFixed(8));
  const amount = parseFloat(((Math.random() * 2 + 0.01) / price).toFixed(2));
  const total = parseFloat((amount * price).toFixed(8));
  const usdtToBtcRate = rates.USDT['BTC'] * ((Math.random() * 2 - 1) / 10 + 1);
  return { price, date, type, amount, amountCurrency, total, tx, usdtToBtcRate: parseFloat(usdtToBtcRate.toFixed(2)) };
}

function _generateTrade(tx, dt) {
  const date = dt;
  const type = getRandomTradeType();
  const amountCurrency = getRandomCurrency();
  const fixedPrice = rates.BTC[amountCurrency];
  const percent = ((Math.random() * 2 - 1) / 10 + 1);
  const price = parseFloat((fixedPrice * percent).toFixed(8));
  const amount = parseFloat(((Math.random() * 2 + 0.01) / price).toFixed(2));
  const total = parseFloat((amount * price).toFixed(8));
  const usdtToBtcRate = rates.USDT['BTC'] * ((Math.random() * 2 - 1) / 10 + 1);
  return { price, date, type, amount, amountCurrency, total, tx, usdtToBtcRate: parseFloat(usdtToBtcRate.toFixed(2)) };
}

function _generateTradesBlock(tx) {
  tx = tx || 'https://ropsten.etherscan.io/tx/0xf003ee3bdbd7c278864c2d4317669918e03b3dea7a0f5947051ea30c46e7c6f9';
  const yesterday = Date.now() - 86400000;
  const trades = [];
  for(let i = 0; i < 20; i++) {
    const date = yesterday + i * 86400000 / 24;
    trades.push(_generateTrade(tx, new Date(date)));
  }
  return trades;
}

function generateTradesBlock(n = 20, tx,count, lastYear) {
  tx = tx || 'https://ropsten.etherscan.io/tx/0xf003ee3bdbd7c278864c2d4317669918e03b3dea7a0f5947051ea30c46e7c6f9';
  const trades = [];
  const dayPoint = lastYear ? 2 : 0;
  const dateStart = new Date(Date.now() - ((n - count) * 31 * 24* 60 * 60 * 1000));
  for(let i = 1; i < 31 + dayPoint; i++) {
    trades.push(generateTrade(tx,i + 1, dateStart));
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

const buyCurrencies = ['ETH', 'XRP', 'BCC', 'LTC'];
function getRandomCurrency() {
  return buyCurrencies[getRandom(buyCurrencies.length)];
}

export function generateTrades(numberOfBlock) {
  numberOfBlock = numberOfBlock || getRandom(4, 2);
  const trades = [];
  trades.push(_generateTradesBlock());
  for(let i = 0; i < 10; i++) {

    trades.push(generateTradesBlock(10, null, i, 9 == i ? true : false));
  }
  return trades;
}
