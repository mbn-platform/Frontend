import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import store from './store';
import { Provider } from 'react-redux';
import MainContent from './MainContentContainer';
import Navigation from './Navigation';
import './App.css';


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
    <div className="page_wrapper">
      <Route path="/login" exact render={() => (<div className="login_bg"></div>)} />
      <div className="page_cols_wrapper clearfix">
        <Navigation />
        <MainContent />
      </div>
    </div>
  </BrowserRouter>
);





export default App;
