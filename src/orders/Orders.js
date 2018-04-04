import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import HeaderStatus from '../terminal/HeaderStatus';
import Controls from './Controls';
import OrdersTable from './OrdersTable';
import { connect } from 'react-redux';
import { cancelOrder, getMyOrders, selectExchange, selectApiKey, getExchangeMarkets } from '../actions/terminal';
import { fetchDashboardData } from '../actions/dashboard';
import { WEBSOCKET_CONNECT } from '../actions/websocket';

class Orders extends React.Component {

  constructor(props) {
    super(props);
  }

  allowedApiKeys(apiKeys, contracts) {
    const allowedOwnKeys = apiKeys.ownKeys.filter(k => k.state !== 'INVALID');
    const allowedReceivedKeys = apiKeys.receivedKeys.filter(k => {
      const contract = contracts.find(c => c.keyId === k._id);
      return !!contract;
    });
    return allowedOwnKeys.concat(allowedReceivedKeys);
  }

  render() {
    const apiKeys = this.allowedApiKeys(this.props.apiKeys, this.props.contracts);
    return (
      <Container fluid className="orders">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <HeaderStatus
              {...this.props.exchangeInfo}
            />
            <div className="orders-main">
              <div className="orders-main__top">
                <div className="row  align-items-center">
                  <div className="orders-main__title"> Orders</div>
                </div>
                <Controls
                  apiKeys={apiKeys}
                  apiKey={this.props.apiKey}
                  onApiKeySelect={this.props.selectApiKey}
                  exchange={this.props.exchange}
                  onExchangeSElect={this.props.selectExchange}
                />
              </div>
              <OrdersTable
                orders={{open: [], completed: []}}
                cancelOrder={this.props.cancelOrder}
              />
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
  componentDidMount() {
    window.customize();
    this.props.connectToSocket();
    this.props.getExchangeMarkets(this.props.exchange);
  }

  componentWillUnmount() {
    window.uncustomize();
  }
}

const OrdersContainer = connect(state => ({
  apiKeys: state.apiKeys,
  contracts: state.contracts.current,
  apiKey: state.terminal.apiKey,
  orders: state.orders,
  market: state.terminal.market,
  exchange: state.terminal.exchange,
  exchangeInfo: state.exchangesInfo[state.terminal.exchange],
}), dispatch => ({
  cancelOrder: order => dispatch(cancelOrder(order)),
  selectExchange: exchange => {
    dispatch(selectExchange(exchange));
    dispatch(getExchangeMarkets(exchange));
  },
  getExchangeMarkets: exchange => dispatch(getExchangeMarkets(exchange)),
  connectToSocket: () => dispatch({
    type: WEBSOCKET_CONNECT,
  }),
}))(Orders);

export default OrdersContainer;
