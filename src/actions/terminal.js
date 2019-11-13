import { ApiError } from '../generic/apiCall';
import { ApiTerminal} from '../generic/api';
import { showInfoModal, showUpgradeTariffModal } from './modal';
import { LOGGED_OUT } from './auth';

export const SELECT_FUND = 'SELECT_FUND';
export const SELECT_MARKET = 'SELECT_MARKET';
export const SELECT_EXCHANGE = 'SELECT_EXCHANGE';
export const SELECT_INTERVAL = 'SELECT_INTERVAL';
export const EXCHANGE_MARKETS = 'EXCHANGE_MARKETS';
export const EXCHANGE_RATES = 'EXCHANGE_RATES';
export const EXCHANGE_RATES_ALL = 'EXCHANGE_RATES_ALL';
export const CANCEL_ORDER = 'CANCEL_ORDER';
export const PLACE_ORDER = 'PLACE_ORDER';
export const PLACE_ALGO_ORDER = 'PLACE_ALGO_ORDER';
export const UPDATE_ORDER = 'UPDATE_ORDER';
export const GET_MY_ORDERS = 'GET_MY_ORDERS';
export const UPDATE_EXCHANGE_RATES = 'UPDATE_EXCHANGE_RATES';
export const UPDATE_RATINGS = 'UPDATE_RATINGS';
export const UPDATE_TICKER = 'UPDATE_TICKER';
export const UPDATE_ORDER_BOOK = 'UPDATE_ORDER_BOOK';
export const UPDATE_HISTORY = 'UPDATE_HISTORY';
export const UPDATE_MARKET_SUMMARIES = 'UPDATE_MARKET_SUMMARIES';
export const TRADING_DATA_START = 'TRADING_DATA_START';
export const TRADING_DATA_STOP = 'TRADING_DATA_STOP';
export const SELECT_ASSET_GROUP = 'SELECT_ASSET_GROUP';

const TerminalApi = new ApiTerminal();

export function selectFund(fund) {
  localStorage.setItem('terminal.selectedFund', JSON.stringify(fund));
  return {
    type: SELECT_FUND,
    fund
  };
}

export function startTradingDataUpdates() {
  return {type: TRADING_DATA_START};
}

export function stopTradingDataUpdates() {
  return {type: TRADING_DATA_STOP};
}

export function selectMarket(market) {
  localStorage.setItem('terminal.selectedMarket', market);
  return {
    type: SELECT_MARKET,
    market,
  };
}

export function selectExchange(exchange, restore) {
  localStorage.setItem('terminal.selectedExchange', exchange);
  return (dispatch, getState) => {
    const state = getState();
    const apiKeys = state.apiKeys.ownKeys.filter(k => k.exchange === exchange);
    const contracts = state.contracts.current
      .filter(c => c.exchange === exchange && c.to._id === state.auth.profile._id);
    const selectedFund = apiKeys[0] || contracts[0] || null;
    dispatch(selectFund(selectedFund));
    dispatch({
      type: SELECT_EXCHANGE,
      exchange,
      restore,
    });
  };
}

export function selectInterval(interval) {
  localStorage.setItem('terminal.selectedInterval', interval);
  return {
    type: SELECT_INTERVAL,
    interval,
  };
}

export function getExchangeMarkets(exchange) {
  return dispatch => {
    TerminalApi.getExchangeMarkets(exchange)
      .then(res => {
        dispatch({
          type: EXCHANGE_MARKETS,
          exchange,
          markets: res.markets,
        });
      })
      .catch(e => {
        console.error('failed to get exchange info', e);
      });
  };
}

export function getExchangeRates(exchange) {
  return dispatch => {
    TerminalApi.getExchangeRates(exchange)
      .then(res => {
        dispatch(updateRates(exchange, res));
      });
  };
}

export function getAllRates() {
  return dispatch => {
    TerminalApi.getExchangeRates()
      .then(res => dispatch(updateAllRates(res)));
  };
}


export function getMyOrders(key) {
  return dispatch => {
    TerminalApi.getMyOrders(key)
      .then(res => {
        dispatch({
          type: GET_MY_ORDERS,
          orders: res,
        });
      })
      .catch(error => console.error(error));
  };
}

export function getOrders(params) {
  return dispatch => {
    TerminalApi.getOrders(params)
      .then(res => dispatch({
        type: GET_MY_ORDERS,
        orders: res,
        fundId: params.groupId || params.contractId || params.keyId,
      }))
      .catch(err => {
        console.error(err);
      });
  };
}

export function cancelOrder(order) {
  return dispatch => {
    (order.isAlgo ?
      TerminalApi.cancelAlgoOrder(order) :
      TerminalApi.cancelOrder(order)
    )
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
              dispatch(showInfoModal('thisOrderIsAlreadyClosed'));
              break;
            case ApiError.TRY_AGAIN_LATER:
              dispatch(showInfoModal('serverIsBusyTryAgainLater'));
              break;
            case ApiError.ORDER_ALREADY_CLOSED:
              dispatch(showInfoModal('thisOrderIsAlreadyClosed'));
              break;
            case ApiError.ORDER_NOT_SUPPORTED:
              dispatch(showInfoModal('orderNotSupported'));
              break;
            case ApiError.FORBIDDEN:
              dispatch({
                type: LOGGED_OUT,
              });
              break;
            default:
              dispatch(showInfoModal('failedToCancelOrder', {order :err.apiErrorCode}));
              console.error('unhandled api error', err.apiErrorCode);
          }
        } else {
          console.error('error performing request', err);
        }
      });
  };
}

export function placeAlgoOrder(order) {
  return (dispatch, store) => {
    console.log(store);
    TerminalApi.placeAlgoOrder(order)
      .then(res => {
        dispatch(showInfoModal('orderHasBeenPlaced'));
      })
      .catch(error => {
        if(error.apiErrorCode) {
          switch(error.apiErrorCode) {
            case ApiError.TARIFF_LIMIT:
              dispatch(showUpgradeTariffModal('profile.needToUpgradePlan',
                {},
                {
                  upgradeTariffText: 'profile.upgrade',
                  cancelText: 'profile.cancel',
                },
              ));
              break;
            default:
              console.log('unhandler error: ' + JSON.stringify(error));
          }
        }
      });
  };
}

export function placeOrder(order) {
  return dispatch => {
    TerminalApi.placeOrder(order)
      .then(res => {
        dispatch(showInfoModal('orderHasBeenPlaced'));
      })
      .catch(error => {
        if(error.apiErrorCode) {
          switch(error.apiErrorCode) {
            case ApiError.FORBIDDEN:
              dispatch({
                type: LOGGED_OUT,
              });
              break;
            case ApiError.INSUFFICIENT_FUNDS:
              dispatch(showInfoModal('errorInsufficientFunds'));
              break;
            case ApiError.TRY_AGAIN_LATER:
              dispatch(showInfoModal('serverIsBusyTryAgainLater'));
              break;
            case ApiError.MIN_TRADE_REQUIREMENT_NOT_MET:
              dispatch(showInfoModal('minTradeRequirementNotMet'));
              break;
            case ApiError.MARKET_NOT_ALLOWED:
              dispatch(showInfoModal('youAreNotAllowedToTradeOnThatMarket'));
              break;
            case ApiError.THROTTLE_LIMIT:
              dispatch(showInfoModal('youHaveMadeTooManyOrders'));
              break;
            case ApiError.LOCK:
              dispatch(showInfoModal('youCanPlaceOnlyOneOrderAtOnce'));
              break;
            case ApiError.TARIFF_LIMIT:
              dispatch(showUpgradeTariffModal('profile.needToUpgradePlan',
                {},
                {
                  upgradeTariffText: 'profile.upgrade',
                  cancelText: 'profile.cancel',
                },
              ));
              break;
            default:
              dispatch(showInfoModal('failedToPlaceOrder', {order : error.apiErrorCode}));
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
    TerminalApi.updateRatings()
      .then(data => {
        dispatch({
          type: UPDATE_RATINGS,
          rating: data.rating,
        });
      })
      .catch(e => console.error('error'));
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
export function updateAllRates(rates) {
  return {
    type: EXCHANGE_RATES_ALL,
    rates,
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

export const selectAssetGroup = groupName => {
  localStorage.setItem('terminal.selectedGroup', groupName);
  return {
    type: SELECT_ASSET_GROUP,
    groupName,
  };
};
