import { apiGet } from '../generic/apiCall';
export const SELECT_API_KEY = 'SELECT_API_KEY';
export const CANCEL_ORDER = 'CANCEL_ORDER';
export const SELECT_MARKET = 'SELECT_MARKET';
export const PLACE_ORDER = 'PLACE_ORDER';
export const GET_MY_ORDERS = 'GET_MY_ORDERS';

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
  console.log('canceling order');
  return {
    type: CANCEL_ORDER,
    order
  };
}

export function selectMarket(market) {
  return {
    type: SELECT_MARKET,
    market,
  };
}

export function placeOrder(order) {
  return {
    type: PLACE_ORDER,
    order,
  };
}
 
