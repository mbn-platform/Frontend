import React from 'react';
import logo from './Logo.svg';
import { BrowserRouter, NavLink, Route, Redirect, Switch } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reducer from './rootReducer';
import thunk from 'redux-thunk'
import MainRouter from './MainRouter';

const store = createStore(reducer, applyMiddleware(thunk));


const Root = () => (
  <div>Site is under heavy construction</div>
);

const App = () => (
  <Provider store={store}>
    <MainRouter>
    </MainRouter>
  </Provider>
);

export default App;
