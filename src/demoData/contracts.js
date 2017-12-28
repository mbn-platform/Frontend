import { generateId } from './util';

import { CONTRACT_STATE_VERIFIED, CONTRACT_STATE_FINISHED,
  CONTRACT_STATE_HALTED } from '../constants';

export const generateContract = (keyId, state, contractor) => {
  const id = generateId();
  const startBalance = Math.floor(Math.random() * 100 + 20);
  const fee = Math.floor(Math.random() * 20 + 10);
  const roi = Math.floor(Math.random() * 20 + 10);
  const targetBalance = Math.floor(startBalance * (100 + roi) / 100);
  const minBalance = Math.floor(startBalance * (100 - fee) / 100);
  let currentBalance;
  if(state === CONTRACT_STATE_FINISHED) {
    currentBalance = Math.floor(Math.random() * (targetBalance - startBalance) + startBalance);
  } else {
    currentBalance = Math.floor(Math.random() * (targetBalance - minBalance) - (startBalance - minBalance)) + startBalance;
  }
  const maxLoss = Math.round(Math.abs(Math.random() * ((currentBalance / startBalance - 1) * 100)  + ((currentBalance / startBalance - 1) * 100)) + 10);
  const left = Math.floor(targetBalance - currentBalance);
  const expireDate = Date.now() + Math.random() * 100 * 86400000;
  const startDate = Date.now() - Math.random() * 20 * 86400000;

  return {contractor,
    currency: currency(),
    state, expireDate, startDate,
    startBalance, currentBalance, left,
    maxLoss, fee, feedbacks: [],
    _id: id, keyId};
};

function currency() {
  const currencies = ['USDT', 'BTC'];
  return currencies[Math.floor(Math.random() * currencies.length)];
}


