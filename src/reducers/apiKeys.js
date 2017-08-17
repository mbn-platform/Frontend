import { DELETE_API_KEY, ADD_API_KEY } from '../actions/apiKeys';
// const KEYS = [
//   {keyName: 'Pending Key key', keyValue: 'Acx123123DFdf', stock: 'Some Stock', inUse: false, pairs: ['BTC-BCC'], owned: false, keyId: 1},
//   {keyName: 'Shared key', keyValue: 'Acx123123DFdf', stock: 'Some Stock', inUse: false, pairs: ['BTC-ETH'], owned: false, keyId: 2},
//   {keyName: 'My Key in use', keyValue: 'Acx12312sxdf', stock: 'Some Other Stock', inUse: true, pairs: ['BTC-ETH'], owned: true, keyId: 3},
//   {keyName: 'My Fee key', keyValue: 'Acx12312sxdf', stock: 'Some Other Stock', inUse: false, pairs: ['BTC-NEO'], owned: true, keyId: 4}
// ];
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
