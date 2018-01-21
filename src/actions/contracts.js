export const UPDATE_CONTRACTS = 'UPDATE_CONTRACTS';
export const RATE_CONTRACT = 'RATE_CONTRACT';

export function updateContracts(contracts) {
  return {
    type: UPDATE_CONTRACTS,
    contracts: contracts
  };
}

export function rateContract(feedback) {
  return dispatch => {};
}
