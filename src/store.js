import { createStore, compose, applyMiddleware } from 'redux';
import { persistStore } from 'redux-persist';
import reducer from './rootReducer';
import thunk from 'redux-thunk';
import socketMiddleware from './socket_middleware';
import apiMiddleware from './apiMiddleware';

export default () => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    reducer,
    composeEnhancers(
      applyMiddleware(thunk, socketMiddleware, apiMiddleware),
    )
  );

  const persistor = persistStore(store);

  return { store, persistor };
};
