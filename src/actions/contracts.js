import { apiPost } from '../generic/apiCall';
export const UPDATE_CONTRACTS = 'UPDATE_CONTRACTS';
export const RATE_CONTRACT = 'RATE_CONTRACT';

export function updateContracts(contracts) {
  return {
    type: UPDATE_CONTRACTS,
    contracts: contracts
  };
}

export function rateContract(feedback) {
  return dispatch => {
    apiPost('/api/feedback', null, feedback)
      .then(json => {
        dispatch({
          type: RATE_CONTRACT,
          contract: json
        });
      });
  };
}
