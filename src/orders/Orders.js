import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import HeaderStatus from '../terminal/HeaderStatus';
import Controls from './Controls';
import OrdersTable from './OrdersTable';
import { connect } from 'react-redux';
import { cancelOrder, getOrders, selectExchange, selectFund, getExchangeMarkets } from '../actions/terminal';
import { fetchDashboardData } from '../actions/dashboard';
import { WEBSOCKET_CONNECT } from '../actions/websocket';
import {isContract, setFundId} from "../generic/util";

class Orders extends React.Component {

  render() {
    const apiKeys = this.props.apiKeys.ownKeys;
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
                  fund={this.props.fund}
                  onApiKeySelect={this.props.selectFund}
                  exchange={this.props.exchange}
                  onExchangeSelect={this.props.selectExchange}
                />
              </div>
              <OrdersTable
                orders={this.props.orders}
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
    if(this.props.fund) {
      let payload = setFundId({}, this.props.fund)
      this.props.getOrders(payload);
    }
  }

  componentWillReceiveProps(props) {
    if(props.fund && (!this.props.fund || this.props.fund._id !== props.fund._id)) {
      let payload = setFundId({}, props.fund)
      this.props.getOrders(payload);
    }
  }

  componentWillUnmount() {
    window.uncustomize();
  }
}

const OrdersContainer = connect(state => ({
  apiKeys: state.apiKeys,
  contracts: state.contracts.current,
  fund: state.terminal.fund,
  orders: state.terminal.orders,
  market: state.terminal.market,
  exchange: state.terminal.exchange,
  exchangeInfo: state.exchangesInfo[state.terminal.exchange],
}), dispatch => ({
  getOrders: params => dispatch(getOrders(params)),
  cancelOrder: order => dispatch(cancelOrder(order)),
  selectExchange: exchange => {
    dispatch(selectExchange(exchange));
    dispatch(getExchangeMarkets(exchange));
  },
  selectFund: fund => dispatch(selectFund(fund)),
  getExchangeMarkets: exchange => dispatch(getExchangeMarkets(exchange)),
  connectToSocket: () => dispatch({
    type: WEBSOCKET_CONNECT,
  }),
}))(Orders);

export default OrdersContainer;
