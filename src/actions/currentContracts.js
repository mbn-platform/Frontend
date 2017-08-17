export const UPDATE_CURRENT_CONTRACTS = 'UPDATE_CURRENT_CONTRACTS';

export function updateCurrentContracts(contracts) {
  return {
    type: UPDATE_CURRENT_CONTRACTS,
    currentContracts: contracts
  };
}
