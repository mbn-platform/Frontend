import { apiGet, apiPost, ApiError } from '../generic/apiCall';
import { fetchDashboardData } from '../actions/dashboard';
export const SELECT_API_KEY = 'SELECT_API_KEY';
export const SELECT_MARKET = 'SELECT_MARKET';
export const SELECT_EXCHANGE = 'SELECT_EXCHANGE';
export const SELECT_INTERVAL = 'SELECT_INTERVAL';
export const EXCHANGE_MARKETS = 'EXCHANGE_MARKETS';
export const EXCHANGE_RATES = 'EXCHANGE_RATES';
export const CANCEL_ORDER = 'CANCEL_ORDER';
export const PLACE_ORDER = 'PLACE_ORDER';
export const GET_MY_ORDERS = 'GET_MY_ORDERS';
export const UPDATE_EXCHANGE_RATES = 'UPDATE_EXCHANGE_RATES';
export const UPDATE_RATINGS = 'UPDATE_RATINGS';
export const UPDATE_TICKER = 'UPDATE_TICKER';
export const UPDATE_ORDER_BOOK = 'UPDATE_ORDER_BOOK';
export const UPDATE_HISTORY = 'UPDATE_HISTORY';
export const GET_EXCHANGE_MARKETS = 'GET_EXCHANGE_MARKETS';
export const UPDATE_MARKET_SUMMARIES = 'UPDATE_MARKET_SUMMARIES';

export function selectApiKey(key) {
  return {
    type: SELECT_API_KEY,
    key
  };
}

export function selectMarket(market) {
  return {
    type: SELECT_MARKET,
    market,
  };
}

export function selectExchange(exchange) {
  return {
    type: SELECT_EXCHANGE,
    exchange,
  };
}

export function selectInterval(interval) {
  return {
    type: SELECT_INTERVAL,
    interval,
  };
}

export function getExchangeMarkets(exchange) {
  return dispatch => {
    apiGet('/exchange/markets?exchange=' + exchange)
      .then(res => {
        dispatch({
          type: EXCHANGE_MARKETS,
          exchange,
          markets: res.markets,
        });
      })
      .catch(e => {
        console.log('failed to get exchange info', e);
        console.log(e.apiErrorCode);
      });
  };
}


export function getMyOrders(key) {
  return dispatch => {
    apiGet('/api/trades/' + key._id)
      .then(res => {
        dispatch({
          type: GET_MY_ORDERS,
          orders: res,
        });
      })
      .catch(error => console.log(error));
  };
}

export function cancelOrder(order) {
  return dispatch => {
    apiPost('/api/order/' + order._id + '/cancel')
      .then(() => {
        dispatch({
          type: CANCEL_ORDER,
          order,
        });
      })
      .catch(err => {
        if(err.apiErrorCode) {
          switch(err.apiErrorCode) {
            case ApiError.ORDER_NOT_OPEN:
              alert('this order is already closed');
              break;
            default:
              console.log('unhandled api error', err.apiErrorCode);
          }
        } else {
          console.log('error performing request');
        }
      });
  };
}

export function placeOrder(order, type) {
  return dispatch => {
    let url;
    switch(type) {
      case 'buy':
        url = '/api/order/buy';
        break;
      case 'sell':
        url = '/api/order/sell';
        break;
      default:
        alert('error');
    }
    apiPost(url, null, order)
      .then(order => {
        alert('Order has been placed');
        dispatch({
          type: PLACE_ORDER,
          order,
        });
        dispatch(fetchDashboardData());
      })
      .catch(err => {
        if(err.apiErrorCode) {
          switch(err.apiErrorCode) {
            case ApiError.FORBIDDEN:
              alert('The key does not allow to trade this pair');
              break;
            case ApiError.EXCHANGE_ERROR:
              alert('Exchange error');
              break;
            case ApiError.INSUFFICIENT_FUNDS:
              alert('Not enough funds');
              break;
            case ApiError.MIN_TRADE_REQUIREMENT_NOT_MET:
              alert('Order size is less than minimal order size for this market');
              break;
            default:
              console.log('unhandled api error', err.apiErrorCode);
          }
        } else {
          console.log('error');
        }
      });
  };
}


export function updateRatings() {
  return dispatch => {
    apiGet('/api/rating')
      .then(ratings => {
        dispatch({
          type: UPDATE_RATINGS,
          ratings,
        });
      })
      .catch(e => console.log('error'));
  };
}

export function updateOrderBook(exchange, market, orderBook) {
  return {
    type: UPDATE_ORDER_BOOK,
    exchange,
    market,
    orderBook,
  };
}

export function updateHistory(exchange, market, history) {
  return {
    type: UPDATE_HISTORY,
    history,
    market,
    exchange,
  };
}

export function updateRates(exchange, rates) {
  return {
    type: EXCHANGE_RATES,
    exchange,
    rates,
  };
}

export function updateTicker(exchange, market, ticker) {
  return {
    type: UPDATE_TICKER,
    exchange, market, ticker,
  };
}
