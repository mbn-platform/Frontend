export const UPDATE_CONTRACTS = 'UPDATE_CONTRACTS';

export function updateContracts(contracts) {
  return {
    type: UPDATE_CONTRACTS,
    contracts: contracts
  };
}
