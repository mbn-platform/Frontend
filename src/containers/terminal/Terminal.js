import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import MediaQuery from 'react-responsive';
import isEmpty from 'lodash/isEmpty';

import HeaderStatus from '../../components/HeaderStatus';
import Controls from './Controls';
import Charts from './Charts';
import PlaceOrder from './placeOrder/PlaceOrderContainer';
import MyOrders from './MyOrders';
import TopBanner from '../login/TopBanner';
import RecentTrades from './RecentTrades';
import OrderBook from './OrderBook';
import {setFundId} from '../../generic/util';
import {
  getOrders,
  stopTradingDataUpdates,
  selectExchange,
  selectMarket,
  getExchangeMarkets,
  validateUrlParams,
} from '../../actions/terminal';

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

  render = () => (
    <Container fluid className="terminal">
      <TopBanner auth={this.props.auth} />
      <Row>
        <Col xs="12" sm="12" md="12" lg="12" className="terminal-container">
          <HeaderStatus />
          <div className="terminal-main">
            <Controls
              isFullScreenEnabled={this.state.fullScreenEnabled}
            />
            <Row className="charts">
              <Col xs="12" sm="12" md="6" lg="8" className="charts__left">
                <Charts fullScreen={this.state.fullScreenEnabled} onFullScreenChange={this.onFullScreenChange} />
                <Row className="justify-content-between">
                  <PlaceOrder
                    price={this.state.price}
                    type={this.state.type}
                    size={this.state.size}
                  />
                  <MediaQuery query="(min-width: 576px)">
                    <MyOrders />
                  </MediaQuery>
                  <MediaQuery query="(max-width: 575px)">
                    <OrderBook onOrderSelect={this.onOrderSelect} />
                  </MediaQuery>
                </Row>
              </Col>
              <Col xs="12" sm="12" md="6" lg="4"  className="charts__right">
                <Row>
                  <MediaQuery query="(min-width: 576px)">
                    <OrderBook
                      onOrderSelect={this.onOrderSelect}
                    />
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
}

const mapStateToProps = ({
  auth,
  terminal: {
    fund,
    market,
    exchange,
    assetGroup,
    isValidUrl,
  },
  exchanges,
  exchangesInfo,
}) => ({
  auth,
  assetGroup,
  fund,
  market,
  exchange,
  exchanges,
  exchangesInfo,
  isValidUrl,
});

const mapDispatchToProps = {
  stopTradingDataUpdates,
  getOrders,
  selectExchange,
  selectMarket,
  getExchangeMarkets,
  validateUrlParams,
};

export default connect(mapStateToProps, mapDispatchToProps)(Terminal);
