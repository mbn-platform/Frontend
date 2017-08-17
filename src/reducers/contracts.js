import { UPDATE_CONTRACTS } from '../actions/contracts';
// const CONTRACTS = [
//   {name: 'Trader', link: '/somelink', keyId: 3, expireDate: Date.now()},
//   {name: 'Investor', link: '/somelink', keyId: 2, expireDate: Date.now()}
// ];
const CONTRACTS = [];

export default function(state = CONTRACTS, action) {
  switch(action.type) {
    case UPDATE_CONTRACTS:
      return action.contracts;
    default:
      return state;
  }
}
