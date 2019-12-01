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
  selectExchange,
  selectMarket,
  startTradingDataUpdates,
  stopTradingDataUpdates
} from '../../actions/terminal';

class Terminal extends React.Component {
  state = {
    fullScreenEnabled: false,
    type: 'buy',
  }

  componentDidMount() {
    const {
      startTradingDataUpdates,
      selectExchange,
      selectMarket,
      fund,
      market,
      getOrders,
      exchange,
      history,
    } = this.props;
    startTradingDataUpdates();
    if (fund) {
      const payload = {};
      setFundId(payload, fund);
      getOrders(payload);
    }

    selectExchange(exchange, true);
    selectMarket(market);
    history.replace(`/terminal/${exchange}/${market}`);
  }

  componentWillUnmount() {
    this.props.stopTradingDataUpdates();
  }

  onOrderSelect = (price, size) => {
    this.setState({price: price || '', size: size || ''});
  }

  onFullScreenChange = value => {
    this.setState({fullScreenEnabled: value});
  }

  // allowedApiKeys(apiKeys, contracts) {
  //   const allowedOwnKeys = apiKeys.ownKeys.filter(k => k.state === 'FREE');
  //   const allowedReceivedKeys = apiKeys.receivedKeys.filter(k => {
  //     const contract = contracts.find(c => c.keyId === k._id);
  //     return !!contract;
  //   });
  //   return allowedOwnKeys.concat(allowedReceivedKeys);
  // }

  componentDidUpdate(prevProps) {
    const fund = this.props.fund || this.props.assetGroup;
    if (fund && (prevProps.market !== this.props.market ||
      (!prevProps.fund || prevProps.fund._id !== fund._id))) {
      const payload = {};
      setFundId(payload, fund);
      this.props.getOrders(payload);
    }

    const { market, exchange } = this.props;
    if (prevProps.market !== market ||  prevProps.exchange !== exchange) {
      this.props.history.replace(`/terminal/${exchange}/${market}`);
    }
  }

  render() {
    return (
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
                      <MyOrders/>
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
}

const mapStateToProps = ({
  auth,
  terminal: {
    fund,
    market,
    exchange,
    assetGroup,
  },
}) => ({
  auth,
  assetGroup,
  fund,
  market,
  exchange,
});

const mapDispatchToProps = {
  startTradingDataUpdates,
  stopTradingDataUpdates,
  selectMarket,
  selectExchange,
  getOrders,
};

export default connect(mapStateToProps, mapDispatchToProps)(Terminal);
