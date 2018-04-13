import {LOGGED_IN} from './actions/auth';
import {fetchKeys} from './actions/dashboard';
const socketMiddleware = store => next => action => {
  switch(action.type) {
    case LOGGED_IN: {
      store.dispatch(fetchKeys());
      break;
    }
    default:
      break;
  }
  next(action);
};

export default socketMiddleware;
