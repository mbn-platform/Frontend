import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import MediaQuery from 'react-responsive';

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
  checkUrlParams,
} from '../../actions/terminal';

class Terminal extends React.Component {
  state = {
    fullScreenEnabled: false,
    type: 'buy',
  }

  componentDidMount() {
    const { fund, getOrders, auth, history, match } = this.props;

    if (fund) {
      const payload = {};
      setFundId(payload, fund);
      getOrders(payload);
    }

    if (!auth.loggedIn) {
      this.props.checkUrlParams(match.params, history);
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
      || (!prevProps.fund || prevProps.fund._id !== fund._id))
    ) {
      const payload = setFundId({}, fund);
      this.props.getOrders(payload);
    }

    const { market, exchange, exchanges, match: { params }, history } = this.props;

    if (prevProps.exchanges !== exchanges) {
      this.props.checkUrlParams(params, history);
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
});

const mapDispatchToProps = {
  stopTradingDataUpdates,
  getOrders,
  checkUrlParams,
};

export default connect(mapStateToProps, mapDispatchToProps)(Terminal);
