import { generateId } from './util';
import markets from './validMarkets';

export function generateHistory() {
  const open = [];
  for(let i = 0; i < getRandom(20, 10); i++) {
    open.push(generateOpenHistory());
  }
  open.sort((o1, o2) => o2.dateOpened - o1.dateOpened);
  return open;
}

function generateOpenHistory() {
  const _id = generateId();
  const type = getRandomHistoryType();
  const market = getRandomMarket();
  const dateOpened = new Date((Date.now() - getRandom(5 * 86400000)));
  const price = getRandomPriceShare();
  const amount = getRandom(200000000, 1000) / 10000;
  const total = getRandom(1000000, 10) / 10000 + " BTC";
  return {type, market, dateOpened, price, _id, amount, total};
}

function generateCompletedHistory() {
  const _id = generateId();
  const type = getRandomHistoryType();
  const market = getRandomMarket();
  const dateOpened = new Date((Date.now() - getRandom(5 * 86400000)));
  const price = getRandomPriceShare();
  const amount = getRandom(200000000, 1000) / 10000;
  const total = getRandom(1000000, 10) / 10000 + " BTC";
  return {type, market, dateOpened, price, _id, amount, total};
}

function getRandomHistoryType() {
  return Math.random() > 0.5 ? 'sell' : 'buy';
}

function getRandomMarket() {
  return markets[Math.floor(Math.random() * markets.length)];
}

function getRandomPriceShare() {
 return Math.random() > 0.7 ? '-' : getRandom(1000, 500) / 1000000; 
}

function getRandom(n, offset = 0) {
  return Math.floor(Math.random() * n) + offset;
}

