import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import {apiGet, ApiError} from './generic/apiCall';
import {loggedIn, loggedOut} from './actions/auth';
import { Provider } from 'react-redux';
import MainContent from './MainContentContainer';
import Navigation from './Navigation';
import { fetchTime } from './actions/time';
import { Container, Row } from 'reactstrap';
import createMqProvider, {querySchema} from './MediaQuery';
import './App.css';
require('bootstrap');
require('malihu-custom-scrollbar-plugin');

const {MediaQuery} = createMqProvider(querySchema);

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {loading: true};
  }

  componentDidMount() {
    window.addEventListener('load', () => {
      if(window.ethereum) {
        window.web3 = new window.Web3(window.ethereum);
      } else if (window.web3) {
        window.web3 = new window.Web3(window.web3.currentProvider);
      }
      if(store.getState().auth.loggedIn) {
        apiGet('/profile')
          .then(({profile}) => {
            store.dispatch(loggedIn(profile));
          })
          .catch(err => {
            if(err.apiErrorCode && err.apiErrorCode === ApiError.FORBIDDEN) {
              store.dispatch(loggedOut());
            }
          })
          .then(() => {
            this.setState({loading: false});
          });
      } else {
        this.setState({loading: false});
      }
    });
    store.dispatch(fetchTime());
    this.timeInterval = setInterval(() => {
      store.dispatch(fetchTime());
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
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
    <MediaQuery>
      <Container className="main-panel" fluid>
        <Row id="top-banner" style={{minHeight: 'unset'}} />
        <Row noGutters className='flex-wrap flex-md-nowrap'>
          <Navigation />
          <MainContent />
        </Row>
      </Container>
    </MediaQuery>
  </BrowserRouter>
);

export default App;
