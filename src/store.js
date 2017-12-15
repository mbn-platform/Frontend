import { createStore, compose, applyMiddleware } from 'redux';
import reducer from './rootReducer';
import thunk from 'redux-thunk';
import generateData from './demoData';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  getReduxState(),
  composeEnhancers(
    applyMiddleware(thunk)
  )
);
store.subscribe(() => saveState(store.getState()));
export default store;



function newFakeData() {
  const data = generateData();
  return data;
}

function getReduxState() {
  localStorage.clear()
  const state = localStorage.getItem('reduxState');
  const lastUpdated = localStorage.getItem('demoDataLastUpdated') || 0;
  if(Date.now() - lastUpdated < 30 * 60 * 1000 && state) {
    try {
      const json = JSON.parse(state);
      saveState(json);
      return json;
    } catch(e) {
      const data = newFakeData();
      saveState(data);
      return data;
    }
  } else {
    const data = newFakeData();
    saveState(data);
    return data;
  }
}

function saveState(state) {
  localStorage.setItem('reduxState', JSON.stringify(state));
  localStorage.setItem('demoDataLastUpdated', Date.now());
}
