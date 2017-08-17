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




class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {loading: true};
  }

  componentDidMount() {
    window.addEventListener('load', () => {
      if(typeof window.web3 !== undefined) {
        window.web3 = new window.Web3(window.web3.currentProvider);
        this.setState({loading: false});
      }
    });
  }
  render() {
    return (
      <Provider store={store}>
        {this.state.loading ? <div/> : (<MainRouter />)}
      </Provider>
      );
  }
}

export default App;
