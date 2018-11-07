import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import HeaderStatus from '../../components/HeaderStatus';
import Controls from './Controls';
import TradingView from './TradingView';
import MarketDepth from './MarketDepth';
import PlaceOrder from './PlaceOrder';
import MyOrders from './MyOrders';
import RecentTrades from './RecentTrades';
import OrderBook from './OrderBook';
import MediaQuery from 'react-responsive';
import qs from 'qs';
import {setFundId} from '../../generic/util';
import {
  getOrders,
  selectExchange,
  selectFund, selectInterval, selectMarket,
  startTradingDataUpdates,
  stopTradingDataUpdates
} from '../../actions/terminal';

class Terminal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {fullScreenEnabled: false, selectedInterval: '30 M', type: 'buy'};
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
    if(this.props.fund && (prevProps.market !== this.props.market ||
      (!prevProps.fund || prevProps.fund._id !== this.props.fund._id))) {
      let payload = {
        symbol: this.props.market
      };
      payload = setFundId(payload, this.props.fund);
      this.props.getOrders(payload);
    }
    const {
      market,
      exchange,
      interval
    } = this.props;

    const {
      market: marketParam,
      exchange: exchangeParam,
      interval: intervalParam
    } = qs.parse(this.props.location.search.slice(1));
    if (marketParam !== market ||  exchangeParam !== exchange || intervalParam !== interval) {
      this.updateUrlParams();
    }
  }

  render() {
    return (
      <Container fluid className="terminal">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12" className="terminal-container">
            <HeaderStatus />
            <div className="terminal-main">
              <Controls
                isFullScreenEnabled={this.state.fullScreenEnabled}
              />
              <Row className="charts">
                <Col xs="12" sm="12" md="6" lg="8" className="charts__left">
                  <TradingView onFullScreenChange={this.onFullScreenChange}/>
                  <MarketDepth />
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

  componentDidMount() {
    const {
      startTradingDataUpdates,
      selectExchange,
      selectInterval,
      selectFund,
      selectMarket,
      fund,
      market,
      getOrders,
      exchange
    } = this.props;
    const {
      market: marketParam,
      exchange: exchangeParam,
      interval: intervalParam
    } = qs.parse(this.props.location.search.slice(1));
    startTradingDataUpdates();
    const savedFund = localStorage.getItem('terminal.selectedFund');
    if (savedFund) {
      selectFund(JSON.parse(savedFund));
    }
    if (fund) {
      let payload = {
        symbol: market
      };
      payload = setFundId(payload, this.props.fund);
      getOrders(payload);
    }
    if (exchangeParam) {
      selectExchange(exchangeParam, true);
    } else {
      selectExchange(exchange, true);
    }
    if (intervalParam) {
      selectInterval(intervalParam);
    }
    if (marketParam) {
      selectMarket(marketParam);
    }
  }


  componentWillUnmount() {
    this.props.stopTradingDataUpdates();
  }

  updateUrlParams = () => {
    const {
      market,
      exchange,
      interval
    } = this.props;
    const currentSearchParams = `market=${market}&exchange=${exchange}&interval=${interval}`;
    this.props.history.replace({
      pathname: '/terminal',
      search: currentSearchParams,
    });
  }
}

const mapStateToProps = state => {
  const { fund, market, exchange, interval } = state.terminal;
  return {
    fund,
    market,
    exchange,
    interval
  };
};

const mapDispatchToProps =  dispatch => ({
  startTradingDataUpdates: () => dispatch(startTradingDataUpdates()),
  stopTradingDataUpdates: () => dispatch(stopTradingDataUpdates()),
  selectInterval: interval => dispatch(selectInterval(interval)),
  selectMarket: market => dispatch(selectMarket(market)),
  selectExchange: (exchange, restore) => dispatch(selectExchange(exchange, restore)),
  selectFund: fund => dispatch(selectFund(fund)),
  getOrders: apiKey => dispatch(getOrders(apiKey)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Terminal);
