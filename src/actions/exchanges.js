import {EXCHANGE_CURRENCIES} from '../reducers/exchangesInfo';
import { ApiExchange} from '../generic/api';

export const UPDATE_EXCHANGES = 'UPDATE_EXCHANGES';

const ExchangeApi = new ApiExchange();

export const updateExchanges = () => {
  return dispatch => {
    ExchangeApi.update()
      .then(({ exchanges }) => {
        dispatch({
          type: UPDATE_EXCHANGES,
          exchanges,
        });
      });
  };
};

export const getExchangeCurrencies = exchange => {
  return dispatch => {
    ExchangeApi.getCurrencies(exchange)
      .then(currencies => {
        dispatch({
          type: EXCHANGE_CURRENCIES,
          exchange,
          currencies,
        });
      });
  };
};
