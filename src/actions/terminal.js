import { ApiError } from '../generic/apiCall';
import { ApiTerminal } from '../generic/api';
import { ApiExchange } from '../generic/api';
import { showUpgradeTariffModal } from './modal';
import { LOGGED_OUT } from './auth';
import { UPDATE_EXCHANGES } from './exchanges';
import { addQuickNotif } from './quickNotif';

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
export const GET_GROUP_ORDER = 'GET_GROUP_ORDER';
export const UPDATE_EXCHANGE_RATES = 'UPDATE_EXCHANGE_RATES';
export const UPDATE_RATINGS = 'UPDATE_RATINGS';
export const UPDATE_TICKER = 'UPDATE_TICKER';
export const UPDATE_ORDER_BOOK = 'UPDATE_ORDER_BOOK';
export const UPDATE_HISTORY = 'UPDATE_HISTORY';
export const UPDATE_MARKET_SUMMARIES = 'UPDATE_MARKET_SUMMARIES';
export const TRADING_DATA_STOP = 'TRADING_DATA_STOP';
export const SELECT_ASSET_GROUP = 'SELECT_ASSET_GROUP';
export const CHECK_URL_VALIDITY = 'CHECK_URL_VALIDITY';

const TerminalApi = new ApiTerminal();
const ExchangeApi = new ApiExchange();

export const selectFund = fund => ({
  type: SELECT_FUND,
  fund,
});

export const stopTradingDataUpdates = () => ({
  type: TRADING_DATA_STOP,
});

export const selectMarket = market => ({
  type: SELECT_MARKET,
  market,
});

export const selectExchange = exchange => ({
  type: SELECT_EXCHANGE,
  exchange,
});

export const selectControlsByExchange = exchange => {
  return (dispatch, getState) => {
    dispatch(selectExchange(exchange));

    const {
      terminal: { assetGroup },
      apiKeys: { ownKeys },
      contracts: { current },
      auth: { profile },
      assetGroups,
    } = getState();

    const funds = ownKeys.concat(current.filter(c => c.to._id === profile._id));
    const fund = funds.find(k => k.exchange === exchange);
    const groupExists = assetGroups.find(g => g.exchange === exchange);

    if (assetGroup) {
      if (groupExists) {
        dispatch(selectAssetGroup(groupExists));
      } else {
        dispatch(selectAssetGroup(null));
        dispatch(fund ? selectFund(fund) : selectFund(null));
      }
    } else {
      dispatch(fund ? selectFund(fund) : selectFund(null));
    }
  };
};

export function getExchangeMarkets(exchange) {
  return dispatch => {
    TerminalApi.getExchangeMarkets(exchange)
      .then(({ markets }) => {
        dispatch({
          type: EXCHANGE_MARKETS,
          exchange,
          markets,
        });
      })
      .catch(e => {
        console.error('failed to get exchange info', e);
      });
  };
}

export const validateUrlParams = ({ exchange, market }) => {
  return dispatch => {
    ExchangeApi.update()
      .then(({ exchanges }) => {
        const hasExchange = exchanges.includes(exchange);

        if (hasExchange) {
          TerminalApi.getExchangeMarkets(exchange)
            .then(({ markets }) => {
              const hasMarket = markets.find(m => m.symbol === market);

              if (hasMarket) {
                dispatch(selectControlsByExchange(exchange));
                dispatch(selectExchange(exchange));
                dispatch(selectMarket(market));
                dispatch({
                  type: UPDATE_EXCHANGES,
                  exchanges,
                });
                dispatch({
                  type: EXCHANGE_MARKETS,
                  exchange,
                  markets,
                });
                dispatch(checkUrlValidity(true));
              } else {
                dispatch(selectExchange('binance'));
                dispatch(selectMarket('USDT-BTC'));
                dispatch(checkUrlValidity(false));
              }
            })
            .catch(() => console.error('error'));
        } else {
          dispatch(selectExchange('binance'));
          dispatch(selectMarket('USDT-BTC'));
          dispatch(checkUrlValidity(false));
        }
      });
  };
};

export const checkUrlValidity = isValidUrl => ({
  type: CHECK_URL_VALIDITY,
  isValidUrl,
});

export function selectInterval(interval) {
  return {
    type: SELECT_INTERVAL,
    interval,
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

export const getGroupOrder = (id) => (
  dispatch => {
    TerminalApi.getGroupOrder(id)
      .then(order => dispatch({
        type: GET_GROUP_ORDER,
        order,
      }))
      .catch(err => {
        console.error(err);
      });
  }
);

export function cancelOrder(order) {
  return dispatch => {
    (order.isAlgo && !order.fullAmount ?
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
              dispatch(addQuickNotif({
                type: 'error',
                object: {
                  text: 'thisOrderIsAlreadyClosed',
                  _id: 'thisOrderIsAlreadyClosed',
                },
              }));
              break;
            case ApiError.TRY_AGAIN_LATER:
              dispatch(addQuickNotif({
                type: 'error',
                object: {
                  text: 'serverIsBusyTryAgainLater',
                  _id: 'serverIsBusyTryAgainLater',
                },
              }));
              break;
            case ApiError.ORDER_ALREADY_CLOSED:
              dispatch(addQuickNotif({
                type: 'error',
                object: {
                  text: 'thisOrderIsAlreadyClosed',
                  _id: 'thisOrderIsAlreadyClosed',
                },
              }));
              break;
            case ApiError.ORDER_NOT_SUPPORTED:
              dispatch(addQuickNotif({
                type: 'error',
                object: {
                  text: 'orderNotSupported',
                  _id: 'orderNotSupported',
                },
              }));
              break;
            case ApiError.FORBIDDEN:
              dispatch({
                type: LOGGED_OUT,
              });
              break;
            default:
              dispatch(addQuickNotif({
                type: 'error',
                object: {
                  text: 'failedToCancelOrder',
                  _id: 'failedToCancelOrder',
                  values: {errorCode: err.apiErrorCode},
                },
              }));
          }
        } else {
          console.error('error performing request', err);
        }
      });
  };
}

export function placeAlgoOrder(order) {
  return (dispatch, store) => {
    TerminalApi.placeAlgoOrder(order)
      .then(res => {
        dispatch(addQuickNotif({
          type: 'success',
          object: {
            text: 'orderHasBeenPlaced',
            _id: 'orderHasBeenPlaced',
          },
        }));
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
            case ApiError.MAINTENANCE:
              dispatch(addQuickNotif({
                type: 'error',
                object: {
                  text: 'exchange.maintenance',
                  _id: 'exchange.maintenance',
                },
              }));
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
        if (order.groupId) {
          if (res.noOrderContracts && res.noOrderContracts.length > 0) {
            dispatch(addQuickNotif(res.noOrderContracts.map((c) => ({
              type: 'group_contract_order_not_placed',
              object: c,
            }))));
          }
        }
        dispatch(addQuickNotif({
          type: 'success',
          object: {
            text: 'orderHasBeenPlaced',
            _id: 'orderHasBeenPlaced',
          },
        }));
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
              dispatch(addQuickNotif({
                type: 'error',
                object: {
                  text: 'errorInsufficientFunds',
                  _id: 'errorInsufficientFunds',
                },
              }));
              break;
            case ApiError.TRY_AGAIN_LATER:
              dispatch(addQuickNotif({
                type: 'error',
                object: {
                  text: 'serverIsBusyTryAgainLater',
                  _id: 'serverIsBusyTryAgainLater',
                },
              }));
              break;
            case ApiError.MIN_TRADE_REQUIREMENT_NOT_MET:
              dispatch(addQuickNotif({
                type: 'error',
                object: {
                  text: 'minTradeRequirementNotMet',
                  _id: 'minTradeRequirementNotMet',
                },
              }));
              break;
            case ApiError.MARKET_NOT_ALLOWED:
              dispatch(addQuickNotif({
                type: 'error',
                object: {
                  text: 'youAreNotAllowedToTradeOnThatMarket',
                  _id: 'youAreNotAllowedToTradeOnThatMarket',
                },
              }));
              break;
            case ApiError.THROTTLE_LIMIT:
              dispatch(addQuickNotif({
                type: 'error',
                object: {
                  text: 'youHaveMadeTooManyOrders',
                  _id: 'youHaveMadeTooManyOrders',
                },
              }));
              break;
            case ApiError.LOCK:
              dispatch(addQuickNotif({
                type: 'error',
                object: {
                  text: 'youCanPlaceOnlyOneOrderAtOnce',
                  _id: 'youCanPlaceOnlyOneOrderAtOnce',
                },
              }));
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
            case ApiError.MAINTENANCE:
              dispatch(addQuickNotif({
                type: 'error',
                object: {
                  text: 'exchange.maintenance',
                  _id: 'exchange.maintenance',
                },
              }));
              break;
            default:
              dispatch(addQuickNotif({
                type: 'error',
                object: {
                  text: 'failedToPlaceOrder',
                  _id: 'failedToPlaceOrder',
                  values: {errorCode: error.apiErrorCode},
                },
              }));
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

export const updateRatings = () => {
  return dispatch => {
    TerminalApi.updateRatings()
      .then(({ rating }) => {
        dispatch({
          type: UPDATE_RATINGS,
          rating,
        });
      })
      .catch(e => console.error('error'));
  };
};

export const updateOrderBook = (exchange, market, orderBook, isFull) => ({
  type: UPDATE_ORDER_BOOK,
  exchange, market, orderBook,
  isFull,
});

export const updateHistory = (exchange, market, history) => ({
  type: UPDATE_HISTORY,
  history, market, exchange,
});

export const updateRates = (exchange, rates) => ({
  type: EXCHANGE_RATES,
  exchange, rates,
});

export const updateTicker = (exchange, market, ticker) => ({
  type: UPDATE_TICKER,
  exchange, market, ticker,
});

export const selectAssetGroup = group => ({
  type: SELECT_ASSET_GROUP,
  group,
});
