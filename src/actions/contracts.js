import { apiPost, apiGet } from '../generic/apiCall';
export const FETCH_CONTRACTS = 'FETCH_CONTRACTS';
export const UPDATE_CONTRACTS = 'UPDATE_CONTRACTS';
export const RATE_CONTRACT = 'RATE_CONTRACT';
export const UPDATE_CONTRACT_BALANCE = 'UPDATE_CONTRACT_BALANCE';

export function updateContracts(contracts) {
  return {
    type: UPDATE_CONTRACTS,
    contracts: contracts
  };
}

export function fetchContracts() {
  return dispatch => {
    apiGet('/contract')
      .then(res => {
        dispatch({
          type: FETCH_CONTRACTS,
          contracts: res.contracts,
        });
      });
  };
}

export function rateContract(feedback) {
  return dispatch => {
    apiPost('/feedback', null, feedback)
      .then(json => {
        dispatch({
          type: RATE_CONTRACT,
          feedback: json
        });
      })
      .catch(error => {
        if(error.apiErrorCode) {
          switch(error.apiErrorCode) {
            default:
              console.log('unhandled api error', error.apiErrorCode);
          }
        }
      });
  };
}
