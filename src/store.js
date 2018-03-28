import { createStore, compose, applyMiddleware } from 'redux';
import reducer from './rootReducer';
import thunk from 'redux-thunk';
import socketMiddleware from './socket_middleware';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  getReduxState(),
  composeEnhancers(
    applyMiddleware(thunk, socketMiddleware),
  )
);
export default store;



function getReduxState() {
  let state = localStorage.getItem('reduxState');
  let selectedNet = localStorage.getItem('selectedNet') || 'mainnet';
  if(state) {
    state = JSON.parse(state);
    state.selectedNet = selectedNet;
  } else {
    state = {};
  }
  return state;
}
