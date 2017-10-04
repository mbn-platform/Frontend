import { generateKeys } from './demoData/apiKeys';
import { generateId } from './demoData/util';
import { generateOffer } from './demoData/offers';
import { generateContract } from './demoData/contracts';

export default function generateData() {
  const profileId = generateId();
  const apiKeys = generateKeys(profileId);
  const outgoingOffer = generateOffer(apiKeys.ownKeys[1]._id, 'INIT', 'me', 'other');
  const incomingOffer = generateOffer(apiKeys.receivedKeys[0]._id, 'INIT', 'me', 'other');
  const myContract = generateContract(apiKeys.ownKeys[2]._id, 'in_progress', 'SOME_TRADER');
  const completedContract = generateContract(apiKeys.ownKeys[2]._id, 'completed', 'OTHER_TRADER');
  const completed2 = generateContract(apiKeys.ownKeys[2]._id, 'completed', 'OTHER_TRADER2');
  const completed3 = generateContract(apiKeys.ownKeys[2]._id, 'completed', 'OTHER_TRADER3');
  const completed4 = generateContract(apiKeys.ownKeys[2]._id, 'completed', 'OTHER_TRADER3');
  const failedContract = generateContract(apiKeys.ownKeys[2]._id, 'failed', 'BEST_TRADER');
  const receivedContract = generateContract(apiKeys.ownKeys[1]._id, 'in_progress', 'me');
  return {
    auth: {loggedIn: true, profile: {_id: profileId}},
    apiKeys,
    offers: {incoming: [incomingOffer], outgoing: [outgoingOffer]},
    contracts: [myContract, completedContract, failedContract, receivedContract, completed2, completed3, completed4]
  }
}
