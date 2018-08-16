import { ApiContract } from '../generic/api';
export const FETCH_CONTRACTS = 'FETCH_CONTRACTS';
// export const UPDATE_CONTRACTS = 'UPDATE_CONTRACTS';
export const RATE_CONTRACT = 'RATE_CONTRACT';
export const UPDATE_CONTRACT_BALANCE = 'UPDATE_CONTRACT_BALANCE';
export const FINISH_CONTRACT = 'FINISH_CONTRACT';
export const UPDATE_CONTRACT_TOTAL_BALANCE = 'UPDATE_CONTRACT_TOTAL_BALANCE';

const ContractsApi = new ApiContract(window.web3);

export function fetchContracts() {
  return dispatch => {
    ContractsApi.fetch()
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
    ContractsApi.rate(feedback)
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

// export function updateContracts(contracts) {
//   return {
//     type: UPDATE_CONTRACTS,
//     contracts: contracts
//   };
// }
