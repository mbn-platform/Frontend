import { generateId } from './util';
import markets from './validMarkets';

export function generateOrders() {
  const open = [];
  for(let i = 0; i < getRandom(20, 10); i++) {
    open.push(generateOpenOrder());
  }
  const completed = [];
  for(let i = 0; i < getRandom(100, 10); i++) {
    completed.push(generateCompletedOrder());
  }
  open.sort((o1, o2) => o2.dateOpened - o1.dateOpened);
  completed.sort((o1, o2) => o2.dateOpened - o1.dateOpened);
  return { open, completed };
}

function generateOpenOrder() {
  const _id = generateId();
  const type = getRandomOrderType();
  const market = getRandomMarket();
  const dateOpened = new Date((Date.now() - getRandom(5 * 86400000)));
  const price = getRandom(1000, 500) / 1000;
  const unitsTotal = getRandom(5, 10);
  const unitsFilled = getRandom(unitsTotal);
  return {type, market, dateOpened, price, _id, unitsTotal, unitsFilled};
}

function generateCompletedOrder() {
  const _id = generateId();
  const type = getRandomOrderType();
  const market = getRandomMarket();
  const dateOpened = new Date((Date.now() - getRandom(5 * 86400000)));
  const price = getRandom(1000, 500) / 1000;
  const unitsTotal = getRandom(5, 10);
  const unitsFilled = getRandom(unitsTotal);
  return {type, market, dateOpened, price, _id, unitsTotal, unitsFilled};
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

