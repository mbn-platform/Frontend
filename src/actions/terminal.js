import { apiGet, apiPost, ApiError } from '../generic/apiCall';
import { fetchDashboardData } from '../actions/dashboard';
import { getMarketSummaries } from '../api/bittrex/bittrex';
export const SELECT_API_KEY = 'SELECT_API_KEY';
export const CANCEL_ORDER = 'CANCEL_ORDER';
export const SELECT_MARKET = 'SELECT_MARKET';
export const PLACE_ORDER = 'PLACE_ORDER';
export const GET_MY_ORDERS = 'GET_MY_ORDERS';
export const UPDATE_EXCHANGE_RATES = 'UPDATE_EXCHANGE_RATES';
export const UPDATE_RATINGS = 'UPDATE_RATINGS';

export function selectApiKey(key) {
  return {
    type: SELECT_API_KEY,
    key
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


export function selectMarket(market) {
  return {
    type: SELECT_MARKET,
    market,
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


export function updateRates() {
  return dispatch => {
    getMarketSummaries().then(json => {
      if(json.success) {
        const rates = json.result.reduce((accum, rate) => {
          const [main, second] = rate.MarketName.split('-');
          accum[main][second] = rate.Last;
          return accum;
        }, {USDT: {}, BTC: {}, ETH: {}});
        dispatch({
          type: UPDATE_EXCHANGE_RATES,
          rates,
        });
      }
    }).catch(e => console.log(e));
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
  }
}
