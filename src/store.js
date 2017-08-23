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
  const state = localStorage.getItem('reduxState');
  return state ? JSON.parse(state) : {};
}
