export const UPDATE_CONTRACTS = 'UPDATE_CONTRACTS';
export const RATE_CONTRACT = 'RATE_CONTRACT';

export function updateContracts(contracts) {
  return {
    type: UPDATE_CONTRACTS,
    contracts: contracts
  };
}

export function rateContract(feedback) {
  return dispatch => window.fetch('/api/feedback', {
    credentials: 'same-origin',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(feedback),
  }).then(res => res.json())
    .then(json => {
      if(json._id) {
        dispatch({
          type: RATE_CONTRACT,
          contract: json
        });
      }
    });
}
