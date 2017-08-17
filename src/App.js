import React from 'react';
import logo from './Logo.svg';
import { BrowserRouter, NavLink } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reducer from './rootReducer';
import thunk from 'redux-thunk';
import MainContent from './MainContent';

const store = createStore(reducer, applyMiddleware(thunk));

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {loading: true};
  }

  componentDidMount() {
    window.addEventListener('load', () => {
      if(typeof window.web3 !== 'undefined') {
        window.web3 = new window.Web3(window.web3.currentProvider);
      }
      this.setState({loading: false});
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


const MainRouter = () => (
  <BrowserRouter>
    <div>
      <nav>
        <NavLink to="/">
          <img src={logo} className="App-logo" alt="logo" />
        </NavLink>
        <a href="/">
        </a>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/profile/some">Profile</NavLink>
        <NavLink to="/ratings">Ratings</NavLink>
        <NavLink to="/terminal">Terminal</NavLink>
      </nav>
      <MainContent />
    </div>
  </BrowserRouter>
);



export default App;
