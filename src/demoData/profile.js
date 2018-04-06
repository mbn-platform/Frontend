import { generateId, generateTraderName, generateAddress, getRandom } from './util';
import { generateTrades } from './trades';
import validCurrencies from './validCurrencies';

export const generateProfile = (profileName) => {
  const _id = generateId();
  const addr = generateAddress();
  const feedbacks= generateFeedbacks();
  const availableForOffers = Math.random() * 2 < 1;
  const investmentAmount = Math.floor(Math.random() * 40);
  const fee = Math.floor(Math.random() * 10 + 10);
  const minAmount = Math.floor(Math.random() * 200 + 50);
  const crrency = 'USDT';
  const roi = Math.floor(Math.random() * 10 + 5);
  const duration = Math.floor(Math.random() * 15 + 15);;
  const maxLoss = Math.floor(Math.random() * 10 + 10);
  const name = profileName  || 'me';
  const currencies = validCurrencies.map(currency);
  const topTraders = getRandom(19,1);
  const topInvesters = getRandom(19,1);
  const roiInBTC = getRandom(98, 2);
  const roiInUSD = getRandom(96, 4);
  const trades = generateTrades();
  const tradesAsInvestor = generateTrades();
  return {
    _id, addr, feedbacks, availableForOffers,
    investmentAmount, fee, minAmount, currency,
    duration, maxLoss, name, currencies, roi, roiInBTC, roiInUSD,
    topTraders, topInvesters, trades, tradesAsInvestor,
  };
};

const currency = name => {
  return {
    name,
    preferred: Math.random() * 2 < 1,
    roi: Math.floor(Math.random() * 20 - 10),
    tradeVolume: Math.floor(Math.random() * 500 + 50)
  };
};

function generateFeedbacks() {
  const feedbacks = [];
  const now = Date.now();
  for(let i = 0; i < 20; i++) {
    const feedback = {
      name: generateTraderName(),
      date: new Date(now - getRandom(now - 50000000)).toISOString(),
      raiting: getRandom(5) + 1,
      text: generateText(),
    };
    feedbacks.push(feedback);
  }
  return feedbacks;
}

function generateText() {
  const words = [];
  for(let i = 0; i < 20; i++) {
    words.push(dicitonary[getRandom(dicitonary.length)]);
  }
  return words.join(' ');
}

const dicitonary = [
  'currency', 'exchange', 'market', 'superiour', 'extra',
  'scum', 'excellent', 'important', 'money', 'money', 'trade', 'bitcoin',
  'promise', 'future'
];

