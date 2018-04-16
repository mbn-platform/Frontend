import {LOGGED_IN} from './actions/auth';
import {fetchKeys} from './actions/dashboard';
import {fetchContracts, FETCH_CONTRACTS} from './actions/contracts';
import { CONTRACT_STATE_INIT, CONTRACT_STATE_ACCEPTED } from './constants';
const socketMiddleware = store => next => action => {
  switch(action.type) {
    case LOGGED_IN: {
      store.dispatch(fetchKeys());
      store.dispatch(fetchContracts());
      break;
    }
    case FETCH_CONTRACTS: {
      // Hack for easier contracts splitting
      const userId = store.getState().auth.profile._id; 
      const offers = {incoming: [], outgoing: []};
      for(const c of action.contracts) {
        if(c.state === CONTRACT_STATE_INIT ||
          c.state === CONTRACT_STATE_ACCEPTED) {
          if(c.from._id === userId) {
            offers.outgoing.push(c);
          } else {
            offers.incoming.push(c);
          }
        }
      }
      action.offers = offers;
      break;
    }
    default:
      break;
  }
  next(action);
};

export default socketMiddleware;
