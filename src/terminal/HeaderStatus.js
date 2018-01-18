import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { getMarketSummary } from '../api/bittrex/bittrex';
import classNames from 'classnames';

class HeaderStatus extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      'USDT-BTC': {},
      'USDT-ETH': {},
      'BTC-ETH': {},
    };
  }

  render() {
    let currencies;
    if(this.props.apiKey) {
      const cur = this.props.market.split('-');
      const currency1 = this.props.apiKey.currencies.find(c => c.name === cur[0]) || {name: cur[0]};
      const currency2 = this.props.apiKey.currencies.find(c => c.name === cur[1]) || {name: cur[1]};
      currencies = [currency1, currency2];
    } else {
      currencies = [{}, {}];
    }
    return (
      <header className="header-status">
        <Container fluid className="h-100">
          <Row className="h-100 justify-content-between">
            <Col xs="8" sm="8" md="8" lg="7" xl="4" className="curses-wrap row">
              <Rate
                pair="BTC/USD"
                val={this.state['USDT-BTC'].Last ? Math.floor(this.state['USDT-BTC'].Last) : ''}
                change={this.state['USDT-BTC'].last}
              />
              <Rate
                pair="ETH/USD"
                val={this.state['USDT-ETH'].Last ? this.state['USDT-ETH'].Last.toFixed(2) : ''}
                change={this.state['USDT-ETH'].last}
              />
              <Rate
                pair="BTC/ETH"
                val={this.state['BTC-ETH'].Last ? parseFloat(this.state['BTC-ETH'].Last.toFixed(4)) : ''}
                change={this.state['BTC-ETH'].last}
              />
            </Col>
            <Balance
              first={currencies[0]}
              second={currencies[1]}
            />
          </Row>
        </Container>
      </header>
    );
  }
  componentWillMount() {
    this.interval = setInterval(this.updateRates.bind(this), 5000);
    this.updateRates();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updatePair(pair, newValue) {
    const oldValue = this.state[pair];
    if(oldValue) {
      const last = ((newValue.Last / oldValue.Last - 1) * 100);
      if(last !== 0) {
        this.setState({[pair]: {...newValue, last}});
      } else {
        this.setState({[pair]: {...newValue, last: oldValue.last}});
      }
    } else {
      this.setState({[pair]: newValue});
    }
  }

  updateRates() {
    ['USDT-BTC', 'USDT-ETH', 'BTC-ETH'].forEach(pair => {
      getMarketSummary(pair).then(json => {
        this.updatePair(pair, json.result[0]);
      });
    });
  }
}

const Rate = ({ pair, val, change }) => (
  <Col sm="4" md="4" lg="4" xs="4" className="curses row h-100 align-items-center justify-content-between">
    <Col xs="auto" className="curses-name">{pair}</Col>
    <Col xs="auto" className="curses-val">{val}</Col>
    <Col xs="auto" className={classNames('curses-change', change > 0 ? 'up' : 'down')}>
      <span className={classNames('icon', 'icon-dir', change > 0 ? 'icon-up-dir' : 'icon-down-dir')}></span>
      {change ? change.toFixed(2) + '%' : ''}
    </Col>
  </Col>
);

const Balance = ({first, second}) => (
  <Col xs="4" sm="4" md="4" lg="3" xl="2" className="row justify-content-end align-items-center">
    <div className="balance-title"> BALANCE:</div>
    <div className="balance-wrap">
      <BalanceValue {...first} />
      <BalanceValue {...second} />
    </div>
  </Col>
);

const BalanceValue = ({name, value}) => (
  <Row className="balance justify-content-center align-items-center">
    <div className="balance-name">{name}</div>
    <div className="balance-val">{value || 0}</div>
  </Row>
);

export default HeaderStatus;
