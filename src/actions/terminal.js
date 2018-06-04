import { apiGet, apiPost, apiDelete, ApiError } from '../generic/apiCall';
import { fetchDashboardData } from '../actions/dashboard';
export const SELECT_FUND = 'SELECT_FUND';
export const SELECT_MARKET = 'SELECT_MARKET';
export const SELECT_EXCHANGE = 'SELECT_EXCHANGE';
export const SELECT_INTERVAL = 'SELECT_INTERVAL';
export const EXCHANGE_MARKETS = 'EXCHANGE_MARKETS';
export const EXCHANGE_RATES = 'EXCHANGE_RATES';
export const CANCEL_ORDER = 'CANCEL_ORDER';
export const PLACE_ORDER = 'PLACE_ORDER';
export const UPDATE_ORDER = 'UPDATE_ORDER';
export const GET_MY_ORDERS = 'GET_MY_ORDERS';
export const UPDATE_EXCHANGE_RATES = 'UPDATE_EXCHANGE_RATES';
export const UPDATE_RATINGS = 'UPDATE_RATINGS';
export const UPDATE_TICKER = 'UPDATE_TICKER';
export const UPDATE_ORDER_BOOK = 'UPDATE_ORDER_BOOK';
export const UPDATE_HISTORY = 'UPDATE_HISTORY';
export const GET_EXCHANGE_MARKETS = 'GET_EXCHANGE_MARKETS';
export const UPDATE_MARKET_SUMMARIES = 'UPDATE_MARKET_SUMMARIES';

export function selectFund(fund) {
  localStorage.setItem('terminal.selectedFund', JSON.stringify(fund));
  return {
    type: SELECT_FUND,
    fund
  };
}

export function selectMarket(market) {
  localStorage.setItem('terminal.selectedMarket', market);
  return {
    type: SELECT_MARKET,
    market,
  };
}

export function selectExchange(exchange) {
  localStorage.setItem('terminal.selectedExchange', JSON.stringify(exchange));
  return (dispatch, getState) => {
    let newSelectedKey = null;
    const ownKeys = getState().apiKeys.ownKeys.filter(key => key.exchange === exchange);
    if (ownKeys.length > 0) {
      newSelectedKey = ownKeys[0];
    }
    dispatch(selectFund(newSelectedKey));
    dispatch({
      type: SELECT_EXCHANGE,
      exchange,
    });
  };
}

export function selectInterval(interval) {
  localStorage.setItem('terminal.selectedInterval', JSON.stringify(interval));
  return {
    type: SELECT_INTERVAL,
    interval,
  };
}

export function getExchangeMarkets(exchange) {
  return dispatch => {
    return apiGet('/exchange/markets?exchange=' + exchange)
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

export function getOrders(params) {
  return dispatch => {
    const query = Object.entries(params).map(e => e.join('=')).join('&');
    apiGet('/order?' + query)
      .then(res => dispatch({
        type: GET_MY_ORDERS,
        orders: res,
        fundId: params.keyId || params.contractId,
      }))
      .catch(err => {
        console.log(err);
      });
  };
}

export function cancelOrder(order) {
  return dispatch => {
    apiDelete('/order/' + order._id)
      .then(res => {
        dispatch({
          type: CANCEL_ORDER,
          order: res,
        });
      })
      .catch(err => {
        if(err.apiErrorCode) {
          switch(err.apiErrorCode) {
            case ApiError.ORDER_NOT_OPEN:
              alert('this order is already closed');
              break;
            case ApiError.TRY_AGAIN_LATER:
              alert('Server is busy. Try again later');
              break;
            default:
              console.log('unhandled api error', err.apiErrorCode);
          }
        } else {
          console.log('error performing request', err);
        }
      });
  };
}

export function placeOrder(order) {
  return dispatch => {
    apiPost('/order', null, order)
      .then(res => {
        console.log(res);
        alert('Order has been placed');
        dispatch({
          type: PLACE_ORDER,
          order: res,
        });
      })
      .catch(error => {
        if(error.apiErrorCode) {
          switch(error.apiErrorCode) {
            case ApiError.INSUFFICIENT_FUNDS:
              alert('Error. Insufficient funds');
              break;
            case ApiError.TRY_AGAIN_LATER:
              alert('Server is busy. Try again later');
              break;
            case ApiError.MIN_TRADE_REQUIREMENT_NOT_MET:
              alert('Min trade requirement not met');
              break;
            default:
              console.log('unhandled api error', error.apiErrorCode);
          }
        }
      });
  };
  //apiPost(url, null, order)
  //.then(order => {
  //alert('Order has been placed');
  //dispatch({
  //type: PLACE_ORDER,
  //order,
  //});
  //dispatch(fetchDashboardData());
  //})
  //.catch(err => {
  //if(err.apiErrorCode) {
  //switch(err.apiErrorCode) {
  //case ApiError.FORBIDDEN:
  //alert('The key does not allow to trade this pair');
  //break;
  //case ApiError.EXCHANGE_ERROR:
  //alert('Exchange error');
  //break;
  //case ApiError.INSUFFICIENT_FUNDS:
  //alert('Not enough funds');
  //break;
  //case ApiError.MIN_TRADE_REQUIREMENT_NOT_MET:
  //alert('Order size is less than minimal order size for this market');
  //break;
  //default:
  //console.log('unhandled api error', err.apiErrorCode);
  //}
  //} else {
  //console.log('error');
  //}
  //});
  //};
}


export function updateRatings() {
  return dispatch => {
    apiGet('/rating')
      .then(data => {
        dispatch({
          type: UPDATE_RATINGS,
          rating: data.rating,
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
