import { apiGet } from '../generic/apiCall';
import {EXCHANGE_CURRENCIES} from '../reducers/exchangesInfo';
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

export const getExchangeCurrencies = (exchange) => {
  return dispatch => {
    apiGet('/exchange/currencies?exchange=' + exchange)
      .then(currencies => {
        dispatch({
          type: EXCHANGE_CURRENCIES,
          exchange: exchange,
          currencies: currencies
        });});
  };
};
