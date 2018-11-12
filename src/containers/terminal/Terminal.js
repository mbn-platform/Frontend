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
      exchange
    } = this.props;
    const {
      exchangeParam,
      marketParam
    } = this.state;

    if (marketParam !== market ||  exchangeParam !== exchange) {
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
      selectFund,
      selectMarket,
      fund,
      market,
      getOrders,
      exchange,
      match,
      history,
      exchanges
    } = this.props;
    startTradingDataUpdates();
    const savedFund = localStorage.getItem('terminal.selectedFund');
    if (savedFund) {
      selectFund(JSON.parse(savedFund));
    }
    if (fund) {
      let payload = {
        symbol: market
      };
      payload = setFundId(payload, fund);
      getOrders(payload);
    }
    const { exchangeParam, marketParam } = match.params;
    if (marketParam) {
      if (exchanges.indexOf(exchangeParam) !== -1) {
        this.setState({
          exchangeParam,
          marketParam
        });
        selectExchange(exchangeParam, true);
        selectMarket(marketParam);
      } else {
        this.setState({
          exchangeParam: exchange,
          marketParam
        });
        selectExchange(exchange|| exchanges[0], true);
      }
    } else {
      selectExchange(exchange || exchanges[0], true);
      history.replace(`/terminal/${exchange}/${market}`);
    }
  }


  componentWillUnmount() {
    this.props.stopTradingDataUpdates();
  }

  updateUrlParams = () => {
    const {
      exchange,
      market
    } = this.props;
    this.setState({
      exchangeParam: exchange,
      marketParam: market,
    });
    const currentSearchParams = `/${exchange}/${market}`;
    this.props.history.replace(`/terminal${currentSearchParams}`);
  }
}

const mapStateToProps = state => {
  const {
    terminal: {
      fund,
      market,
      exchange,
      interval
    },
    exchanges
  } = state;
  return {
    fund,
    market,
    exchange,
    interval,
    exchanges
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
