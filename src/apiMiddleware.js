import {LOGGED_IN} from './actions/auth';
import {getApiKeys} from './actions/apiKeys';
const socketMiddleware = store => next => action => {
  switch(action.type) {
    case LOGGED_IN: {
      store.dispatch(getApiKeys());
      break;
    }
    default:
      break;
  }
  next(action);
};

export default socketMiddleware;
