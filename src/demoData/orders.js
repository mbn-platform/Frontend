import { generateId } from './util';
import markets from './validMarkets';

export function generateOrders() {
  const open = [];
  for(let i = 0; i < getRandom(20, 10); i++) {
    open.push({_id: generateId()});
  }
  const completed = [];
  for(let i = 0; i < getRandom(20, 10); i++) {
    completed.push({_id: generateId()});
  }
  return { open, completed };
}

function generateOpenOrder() {
  const type = getRandomOrderType();
  const market = getRandomMarket();
  const dateOpened = new Date((Date.now() - getRandom(86400000))).toString();
  const price = getRandom(1000, 500) / 1000;
}
function generateCompletedOrder() {
}

function getRandomOrderType() {
  return Math.random() > 0.5 ? 'sell' : 'buy';
}

function getRandomMarket() {
  return markets[Math.floor(Math.random() * markets.length)];
}

function getRandom(n, offset = 0) {
  return Math.floor(Math.random() * n) + offset;
}

