import { generateKeys, KEY_STATE_USED } from './demoData/apiKeys';
import { generateId, generateTraderName } from './demoData/util';
import { generateOffer, getRandomState } from './demoData/offers';
import { generateContract } from './demoData/contracts';
import { generateProfile } from './demoData/profile';
import { generateOrders } from './demoData/orders';
import { generateHistory } from './demoData/history';

import { CONTRACT_STATE_VERIFIED, CONTRACT_STATE_HALTED, CONTRACT_STATE_FINISHED } from './constants';




export default function generateData() {
  const profile = generateProfile();
  const apiKeys = generateKeys(profile._id);
  const usedKeys = apiKeys.ownKeys.filter(k => k.state === KEY_STATE_USED);

  const outgoingOffers = [];
  for(let i = 0; i < usedKeys.length / 2; i++) {
    const offer = generateOffer(usedKeys[i]._id, getRandomState(), 'me', generateTraderName());
    outgoingOffers.push(offer);
  }

  const myActiveContracts = [];
  for(let i = Math.floor(usedKeys.length / 2); i < usedKeys.length; i++) {
    const contract = generateContract(usedKeys[i]._id, CONTRACT_STATE_VERIFIED, generateTraderName());
    myActiveContracts.push(contract);
  }

  const incomingOffers = [];
  for(let i = 0; i < apiKeys.receivedKeys.length / 2; i++) {
    const offer = generateOffer(apiKeys.receivedKeys[i]._id, getRandomState(), generateTraderName(), 'me');
    incomingOffers.push(offer);
  }
  const myContracts = [];
  for(let i = apiKeys.receivedKeys.length / 2; i < apiKeys.receivedKeys.length; i++) {
    const contract = generateContract(apiKeys.receivedKeys[i]._id, CONTRACT_STATE_VERIFIED, 'me');;
    myContracts.push(contract);
  }

  const finishedContracts = [];

  for(let i = 0; i < 20; i++) {
    if(getRandom(2)) {
      const contract = generateContract(apiKeys.ownKeys[getRandom(apiKeys.ownKeys.length)]._id, getRandomFinishedContractState(), generateTraderName());
      finishedContracts.push(contract);
    } else {
      const contract = generateContract(generateId(), getRandomFinishedContractState(), 'me');;
      finishedContracts.push(contract);
    }
  }
  const orders = generateOrders();
  const history = generateHistory();
  const terminal = {selectedMarket: 'USDT-BTC', orders, history, selectedApiKey: apiKeys.ownKeys[0]};



  //const outgoingOffer = generateOffer(apiKeys.ownKeys[1]._id, 'INIT', 'me', 'other');*/
  //const incomingOffer = generateOffer(apiKeys.receivedKeys[0]._id, 'INIT', 'me', 'other');
  //const myContract = generateContract(apiKeys.ownKeys[2]._id, 'in_progress', 'SOME_TRADER');
  //const completedContract = generateContract(apiKeys.ownKeys[2]._id, 'FINISHED', 'OTHER_TRADER');
  //const completed2 = generateContract(apiKeys.ownKeys[2]._id, 'FINISHED', 'OTHER_TRADER2');
  //const completed3 = generateContract(apiKeys.ownKeys[2]._id, 'FINISHED', 'OTHER_TRADER3');
  //const completed4 = generateContract(apiKeys.ownKeys[2]._id, 'FINISHED', 'OTHER_TRADER3');
  //const failedContract = generateContract(apiKeys.ownKeys[2]._id, 'failed', 'BEST_TRADER');
  //const receivedContract = generateContract(apiKeys.ownKeys[1]._id, 'in_progress', 'me');*/
  return {
    auth: {loggedIn: true, profile},
    apiKeys,
    offers: {incoming: incomingOffers, outgoing: outgoingOffers},
    contracts: {current: myActiveContracts.concat(myContracts), finished: finishedContracts},
    terminal,
  };
}


function getRandomFinishedContractState() {
  return getPercent(80) ? CONTRACT_STATE_FINISHED : CONTRACT_STATE_HALTED;
}

function getRandom(n) {
  return Math.floor(Math.random() * n);
}

function getPercent(n) {
  return getRandom(101) < n;
}
