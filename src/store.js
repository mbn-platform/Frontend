import { createStore, compose, applyMiddleware } from 'redux';
import reducer from './rootReducer';
import thunk from 'redux-thunk';
import socketMiddleware from './socket_middleware';
import apiMiddleware from './apiMiddleware';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  getReduxState(),
  composeEnhancers(
    applyMiddleware(thunk, socketMiddleware, apiMiddleware),
  )
);
export default store;

function getReduxState() {
  let state = localStorage.getItem('reduxState');
  if(state) {
    state = {...JSON.parse(state)};
  } else {
    state = undefined;
  }
  return state;
}
