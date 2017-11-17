import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import { Provider } from 'react-redux';
import MainContent from './MainContentContainer';
import Navigation from './Navigation';
import { fetchTime } from './actions/time';
import { Container, Row } from 'reactstrap';
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
    <Container className="main-panel" fluid>
      <Row noGutters>
        <Navigation />
        <MainContent />
      </Row>
    </Container>
  </BrowserRouter>
);





export default App;
