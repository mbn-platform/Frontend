import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import HeaderStatus from '../terminal/HeaderStatus';
import Controls from './Controls';
import OrdersTable from './OrdersTable';
import { connect } from 'react-redux';
import { cancelOrder, getMyOrders } from '../actions/terminal';
import { fetchDashboardData } from '../actions/dashboard';

class Orders extends React.Component {

  constructor(props) {
    super(props);
    this.state = {selectedApiKey: this.props.selectedApiKey || this.allowedApiKeys(props.apiKeys, props.contracts)[0]};
    this.update = this.update.bind(this);
  }

  allowedApiKeys(apiKeys, contracts) {
    const allowedOwnKeys = apiKeys.ownKeys.filter(k => k.state !== 'INVALID');
    const allowedReceivedKeys = apiKeys.receivedKeys.filter(k => {
      const contract = contracts.find(c => c.keyId === k._id);
      return !!contract;
    });
    return allowedOwnKeys.concat(allowedReceivedKeys);
  }

  update() {
    if(this.state.selectedApiKey) {
      this.props.getMyOrders(this.state.selectedApiKey);
    }
    this.timeout = setTimeout(this.update, 5000);
  }

  componentWillReceiveProps(props) {
    if(props.apiKeys !== this.props.apiKeys) {
      const allowed = this.allowedApiKeys(props.apiKeys, props.contracts);
      let key;
      if(this.state.selectedApiKey) {
        key = allowed.find(k => k._id === this.state.selectedApiKey._id) || allowed[0];
      } else {
        key = allowed[0];
      }
      this.setState({selectedApiKey: key});
    }
  }

  componentDidUpdate(props, prevState) {
    if(this.state.selectedApiKey && (!prevState.selectedApiKey || this.state.selectedApiKey._id !== prevState.selectedApiKey._id)) {
      clearTimeout(this.timeout);
      this.update();
    }
  }

  render() {
    const apiKeys = this.allowedApiKeys(this.props.apiKeys, this.props.contracts);
    return (
      <Container fluid className="orders">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <HeaderStatus
              apiKey={this.state.selectedApiKey}
              market={this.props.selectedMarket}
            />
            <div className="orders-main">
              <div className="orders-main__top">
                <div className="row  align-items-center">
                  <div className="orders-main__title"> Orders</div>
                </div>
                <Controls
                  apiKeys={apiKeys}
                  selectedApiKey={this.state.selectedApiKey}
                  onApiKeySelect={key => this.setState({selectedApiKey: key})}
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
    this.update();
    this.keysUpdatesTimeout = setInterval(() => this.props.fetchDashboardData(), 5000);
    this.props.fetchDashboardData();
  }

  componentWillUnmount() {
    window.uncustomize();
    clearTimeout(this.timeout);
    clearInterval(this.keysUpdatesTimeout);
  }
}

const OrdersContainer = connect(state => ({
  apiKeys: state.apiKeys,
  contracts: state.contracts.current,
  selectedApiKey: state.terminal.selectedApiKey,
  orders: state.terminal.orders,
  selectedMarket: state.terminal.selectedMarket,
}), dispatch => ({
  cancelOrder: order => dispatch(cancelOrder(order)),
  getMyOrders: key => dispatch(getMyOrders(key)),
  fetchDashboardData: () => dispatch(fetchDashboardData()),
}))(Orders);

export default OrdersContainer;
