import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import MediaQuery from 'react-responsive';
import { isEmpty } from 'ramda';

import { setFundId } from 'generic/util';
import HeaderStatus from 'components/HeaderStatus';
import PlaceOrder from './placeOrder/PlaceOrderContainer';
import TopBanner from '../login/TopBanner';
import Controls from './Controls';
import Charts from './Charts';
import MyOrders from './MyOrders';
import RecentTrades from './RecentTrades';
import OrderBook from './OrderBook';
import {
  getOrders,
  stopTradingDataUpdates,
  selectExchange,
  selectMarket,
  getExchangeMarkets,
  validateUrlParams,
} from 'actions/terminal';
import * as selectors from 'selectors/terminal';
import { loggedInSelector } from 'selectors/auth';

class Terminal extends React.Component {
  state = {
    fullScreenEnabled: false,
    type: 'buy',
  }

  componentDidMount() {
    const {
      exchange, market, fund, assetGroup, getOrders, match: { params },
    } = this.props;

    if (fund || assetGroup) {
      const payload = setFundId({}, fund || assetGroup);
      getOrders(payload);
    }

    if (isEmpty(params)) {
      this.props.selectExchange(exchange);
      this.props.getExchangeMarkets(exchange);
      this.props.selectMarket(market);
      this.props.history.replace(`/terminal/${exchange}/${market}`);
    } else {
      this.props.validateUrlParams(params);
    }
  }

  componentWillUnmount() {
    this.props.stopTradingDataUpdates();
  }

  onOrderSelect = (price = '', size = '') => {
    this.setState({ price , size });
  }

  onFullScreenChange = value => {
    this.setState({ fullScreenEnabled: value });
  }

  componentDidUpdate(prevProps) {
    const fund = this.props.fund || this.props.assetGroup;
    if (
      fund && (prevProps.market !== this.props.market
      || this.props.fund !== prevProps.fund
      || this.props.assetGroup !== prevProps.assetGroup)
    ) {
      const payload = setFundId({}, fund);
      this.props.getOrders(payload);
    }

    const { market, exchange, isValidUrl } = this.props;

    if (prevProps.isValidUrl !== isValidUrl && isValidUrl) {
      this.props.history.replace(`/terminal/${exchange}/${market}`);
    }

    if (prevProps.market !== market || prevProps.exchange !== exchange) {
      this.props.history.replace(`/terminal/${exchange}/${market}`);
    }
  }

  render = () => {
    const { loggedIn } = this.props;
    const { fullScreenEnabled, price, type, size } = this.state;

    return (
      <Container fluid className="terminal">
        <TopBanner loggedIn={loggedIn} />
        <Row>
          <Col xs="12" sm="12" md="12" lg="12" className="terminal-container">
            <HeaderStatus />
            <div className="terminal-main">
              <Controls isFullScreenEnabled={fullScreenEnabled} />
              <Row className="charts">
                <Col xs="12" sm="12" md="6" lg="8" className="charts__left">
                  <Charts fullScreen={fullScreenEnabled} onFullScreenChange={this.onFullScreenChange} />
                  <Row className="justify-content-between">
                    <PlaceOrder price={price} type={type} size={size} />
                    <MediaQuery query="(min-width: 576px)">
                      <MyOrders />
                    </MediaQuery>
                    <MediaQuery query="(max-width: 575px)">
                      <OrderBook onOrderSelect={this.onOrderSelect} />
                    </MediaQuery>
                  </Row>
                </Col>
                <Col xs="12" sm="12" md="6" lg="4" className="charts__right">
                  <Row>
                    <MediaQuery query="(min-width: 576px)">
                      <OrderBook onOrderSelect={this.onOrderSelect} />
                    </MediaQuery>
                    <MediaQuery query="(max-width: 575px)">
                      <MyOrders />
                    </MediaQuery>
                    <RecentTrades />
                  </Row>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    );
  };
}

const mapStateToProps = (state) => ({
  loggedIn: loggedInSelector(state),
  fund: selectors.fundSelector(state),
  market: selectors.marketSelector(state),
  exchange: selectors.exchangeSelector(state),
  assetGroup: selectors.assetGroupSelector(state),
  isValidUrl: selectors.isValidUrlSelector(state),
});

const mapDispatchToProps = {
  getOrders,
  selectMarket,
  selectExchange,
  validateUrlParams,
  getExchangeMarkets,
  stopTradingDataUpdates,
};

export default connect(mapStateToProps, mapDispatchToProps)(Terminal);
