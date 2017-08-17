import { UPDATE_CURRENT_CONTRACTS } from '../actions/currentContracts';
const CONTRACTS = [
  {name: 'Trader', link: '/somelink', keyId: 3, expireDate: Date.now()},
  {name: 'Investor', link: '/somelink', keyId: 2, expireDate: Date.now()}
];

export default function(state = CONTRACTS, action) {
  switch(action.type) {
    case UPDATE_CURRENT_CONTRACTS:
      return action.currentContracts;
    default:
      return state;
  }
}
