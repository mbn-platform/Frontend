import { generateId } from './util';

export const generateProfile = (profileName) => {
  const _id = generateId();
  const feedbacks= [];
  const availableForOffers = Math.random() * 2 < 1;
  const investmentAmount = Math.floor(Math.random() * 40);
  const fee = Math.floor(Math.random() * 10 + 10);
  const minAmount = Math.floor(Math.random() * 200 + 50);
  const minAmountCurrency = 'USDT';
  const duration = Math.floor(Math.random() * 15 + 15);;
  const maxLoss = Math.floor(Math.random() * 10 + 10);
  const name = profileName  || 'my_profile';
  const currencies = ['ETH', 'USDT', 'BTC'].map(currency);
  return {
    _id, feedbacks, availableForOffers,
    investmentAmount, fee, minAmount, minAmountCurrency,
    duration, maxLoss, name, currencies
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

