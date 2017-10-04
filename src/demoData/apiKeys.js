import { getRandomExchange } from './exchanges';
import { generateId } from './util';

const generateKey = (state, owner, name) => {
  const exchange = getRandomExchange();
  const currencies = exchange.currencies.map(curName => {
    if(currencyEnabled(curName)) {
      return {name: curName, amount: getCurrencyValue()};
    } else {
      return null;
    }
  }).filter(Boolean);
  const keyValue = generateId();
  const key = {
    currencies, state, owner, name,
    exchange: exchange.name, key: keyValue,
    _id: generateId()
  };
  console.log(key);
  return key;
};

const getCurrencyValue = () => {
  return (Math.random() * 100).toFixed(2);
};

const currencyEnabled = (cur) => {
  if(cur === 'BTC' || cur === 'ETH' || cur === 'USDT') {
    return true;
  } else {
    return Math.random() > 0.33;
  }
};

export const generateKeys = (ownerId) => {
  ownerId = ownerId || generateId();
  const ownKeys = [
    generateKey('FREE', ownerId, 'MyFreeKey'),
    generateKey('NOT_FREE', ownerId, 'MyOfferKey'),
    generateKey('NOT_FREE', ownerId, 'MyContractKey')
  ];
  const receivedKeys = [
    generateKey('NOT_FREE', generateId(), 'ReceivedOffer'),
    generateKey('NOT_FREE', generateId(), 'ReceivedContract'),
  ];
  return {ownKeys, receivedKeys};
};
