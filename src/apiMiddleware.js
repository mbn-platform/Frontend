import {LOGGED_IN} from './actions/auth';
import {fetchKeys} from './actions/apiKeys';
import {fetchContracts, FETCH_CONTRACTS} from './actions/contracts';
import {SELECT_EXCHANGE, getExchangeMarkets, selectMarket} from './actions/terminal';
import { CONTRACT_STATE_INIT, CONTRACT_STATE_ACCEPTED,
  CONTRACT_STATE_VERIFIED, CONTRACT_STATE_FINISHED,
  CONTRACT_STATE_HALTED } from './constants';
import {ACCEPT_OFFER, REJECT_OFFER, CANCEL_OFFER, SEND_OFFER} from './actions/offers';
import {updateExchanges} from './actions/exchanges';
const socketMiddleware = store => next => action => {
  switch(action.type) {
    case LOGGED_IN: {
      store.dispatch(fetchKeys());
      store.dispatch(fetchContracts());
      store.dispatch(updateExchanges());
      break;
    }
    case SELECT_EXCHANGE: {
      store.dispatch(getExchangeMarkets(action.exchange));
      break;
    }
    case FETCH_CONTRACTS: {
      // Hack for easier contracts splitting
      const userId = store.getState().auth.profile._id;
      const offers = {incoming: [], outgoing: []};
      const contracts = {current: [], finished: []};
      for(const c of action.contracts) {
        switch(c.state) {
          case CONTRACT_STATE_INIT:
          case CONTRACT_STATE_ACCEPTED: {
            if(c.from._id === userId) {
              offers.outgoing.push(c);
            } else {
              offers.incoming.push(c);
            }
            break;
          }
          case CONTRACT_STATE_VERIFIED:
            contracts.current.push(c);
            break;
          case CONTRACT_STATE_FINISHED:
          case CONTRACT_STATE_HALTED:
            contracts.finished.push(c);
            break;
          default:
            break;
        }
      }
      action.contracts = contracts;
      action.offers = offers;
      break;
    }
    case ACCEPT_OFFER:
    case REJECT_OFFER:
    case CANCEL_OFFER: {
      const userId = store.getState().auth.profile._id;
      action.userId = userId;
      break;
    }
    default:
      break;
  }
  switch(action.type) {
    case SEND_OFFER:
    case REJECT_OFFER:
    case CANCEL_OFFER:
      store.dispatch(fetchKeys());
      break;
    default:
      break;
  }
  next(action);
};

export default socketMiddleware;
