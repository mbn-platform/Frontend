import { DELETE_API_KEY, ADD_API_KEY, UPDATE_API_KEY } from '../actions/apiKeys';
//const KEYS = [
  //{keyName: 'first key', keyValue: 'Acx123123DFdf', stock: 'Some Stock', inUse: true, pairs: ['ETH/BTC']},
  //{keyName: 'second key', keyValue: 'Acx12312sxdf', stock: 'Some Other Stock', inUse: false, pairs: []}
//];
const KEYS = [];

export default function(state = KEYS, action) {
  switch(action.type) {
    case DELETE_API_KEY:
      return state.filter(apiKey => apiKey.keyId !== action.apiKey.keyId);
    case ADD_API_KEY:
      return state.concat(action.apiKey);
    default:
      return state;
  }
}
