import {LOGGED_IN} from './actions/auth';
import {fetchKeys} from './actions/apiKeys';
import { UPDATE_KEYS } from './actions/dashboard';
import {fetchContracts, FETCH_CONTRACTS} from './actions/contracts';
import { CONTRACT_STATE_INIT, CONTRACT_STATE_ACCEPTED,
  CONTRACT_STATE_VERIFIED, CONTRACT_STATE_FINISHED,
  CONTRACT_STATE_HALTED } from './constants';
import {ACCEPT_OFFER, REJECT_OFFER, CANCEL_OFFER, SEND_OFFER} from './actions/offers';
import {updateExchanges} from './actions/exchanges';
import {selectFund, selectAssetGroup} from './actions/terminal';
import {getAssetGroups, GET_ASSET_GROUP} from './actions/assetGroup';

let fundRestored = false;
const apiMiddleware = store => next => action => {
  switch(action.type) {
    case LOGGED_IN: {
      store.dispatch(fetchKeys());
      store.dispatch(fetchContracts());
      store.dispatch(updateExchanges());
      store.dispatch(getAssetGroups());
      break;
    }
    case UPDATE_KEYS: {
      if (!fundRestored) {
        const fundId = window.localStorage.getItem('lastSelectedFund');
        if (fundId) {
          const fund = action.data.find((v) => v._id === fundId);
          if (fund) {
            store.dispatch(selectFund(fund));
            fundRestored = true;
          }
        }
      }
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
      action.userId = userId;
      if (!fundRestored) {
        const fundId = window.localStorage.getItem('lastSelectedFund');
        if (fundId) {
          const fund = contracts.current.find((c) => c._id === fundId);
          if (fund) {
            store.dispatch(selectFund(fund));
            fundRestored = true;
          }
        }
      }
      break;
    }
    case ACCEPT_OFFER:
    case REJECT_OFFER:
    case CANCEL_OFFER: {
      const userId = store.getState().auth.profile._id;
      action.userId = userId;
      break;
    }
    case GET_ASSET_GROUP: {
      if (!fundRestored) {
        const fundId = window.localStorage.getItem('lastSelectedFund');
        if (fundId) {
          const fund = action.assetGroups.find((c) => c._id === fundId);
          if (fund) {
            store.dispatch(selectAssetGroup(fund));
            fundRestored = true;
          }
        }
      }
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

export default apiMiddleware;
