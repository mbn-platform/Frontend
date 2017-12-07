import { getRandom } from './util';
function generateTrade(tx, count, dt) {
  const price = getRandomPrice();                            

  const date = (new Date(dt.getTime() - count * 24 * 60 * 60 * 1000)).toISOString();
  const type = getRandomTradeType();
  const amount = getRandom(100, 20);
  const amountCurrency = getRandomCurrency();
  const total = getRandom(20, 4);
  return { price, date, type, amount, amountCurrency };
}

function generateDate(lastYear) {
    const date = (new Date(Date.now() - getRandom(Date.now() - 1300000000000)))
    date.setDate((new Date()).getDay() + 3);
    if(lastYear) {
      date.setFullYear((new Date()).getFullYear())
      date.setMonth((new Date()).getMonth())
    }
    return date;
}



function generateTradesBlock(n = 20, tx,count, lastYear) {
  tx = tx || 'http://etherscan.io';
  const trades = [];
  const date = generateDate(lastYear)
  for(let i = 0; i < n; i++) {
    trades.push(generateTrade(tx,i, date));
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

    trades.push(generateTradesBlock(getRandom(10, 4),'http://etherscan.io', i, numberOfBlock - 1 == i ? true : false));
  }
  return trades;
}
