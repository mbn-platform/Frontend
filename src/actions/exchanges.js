import { apiGet } from '../generic/apiCall';
export const UPDATE_EXCHANGES = 'UPDATE_EXCHANGES';

export const updateExchanges = () => {
  return dispatch => {
    apiGet('/exchanges')
      .then(json => dispatch({
        type: UPDATE_EXCHANGES,
        exchanges: json.exchanges,
      }));
  };
};
