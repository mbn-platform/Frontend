import { createStore, compose, applyMiddleware } from 'redux';
import reducer from './rootReducer';
import thunk from 'redux-thunk';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  getReduxState(),
  composeEnhancers(
    applyMiddleware(thunk)
  )
);
export default store;



function getReduxState() {
  let state = localStorage.getItem('reduxState');
  let isMainNet = localStorage.getItem('isMainNet');
  if(state) {
    state = JSON.parse(state);
    if(isMainNet !== null) {
      state.isMainNet = JSON.parse(isMainNet);
    }
  } else {
    state = {};
  }
  return state;
}
