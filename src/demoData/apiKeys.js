import { getRandomExchange } from './exchanges';
import { generateId } from './util';

export const KEY_STATE_FREE = 'FREE';
export const KEY_STATE_USED = 'USED';

const generateKey = (state, owner, name) => {
  const exchange = getRandomExchange();
  const currencies = exchange.currencies.map(curName => {
    const enabled = currencyEnabled(curName);
    return {name: curName, amount: getCurrencyValue(), enabled};
  }).filter(Boolean);
  const keyValue = generateId(20);
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
  const ownKeys = generateOwnKeys(ownerId, 15);
  const receivedKeys = generateReceivedKeys(6);
  return {ownKeys, receivedKeys};
};

function getRandom(n) {
  return Math.floor(Math.random() * n);
}

function getRandomState() {
  return getRandom(2) ? KEY_STATE_FREE : KEY_STATE_USED;
}

function generateOwnKeys(ownerId, n) {
  const keys = [];
  for(let i = 0; i < n; i++) {
    const key = generateKey(getRandomState(), ownerId, 'Some key ' + getRandom(2048).toString(16));
    keys.push(key);
  }
  return keys;
}

function generateReceivedKeys(n) {
  const keys = [];
  for(let i = 0; i < n; i++) {
    const key = generateKey(KEY_STATE_USED, generateId(), 'Received' + getRandom(2048).toString(16));
    keys.push(key);
  }
  return keys;
}
