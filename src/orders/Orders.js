import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import HeaderStatus from '../terminal/HeaderStatus';
import Controls from './Controls';
import OrdersTable from './OrdersTable';
import { connect } from 'react-redux';
import { selectApiKey, cancelOrder } from '../actions/terminal';

class Orders extends React.Component {

  render() {
    return (
      <Container fluid className="orders">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <HeaderStatus
              apiKey={this.props.selectedApiKey}
              market={this.props.selectedMarket}
            />
            <div className="orders-main">
              <div className="orders-main__top">
                <div className="row  align-items-center">
                  <div className="orders-main__title"> Orders</div>
                </div>
                <Controls
                  apiKeys={[...this.props.apiKeys.ownKeys, ...this.props.apiKeys.receivedKeys]}
                  selectedApiKey={this.props.selectedApiKey}
                  onApiKeySelect={key => this.props.selectApiKey(key)}
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
    if(!this.props.selectedApiKey) {
      const key = this.props.apiKeys.ownKeys[0] || this.props.apiKeys.receivedKeys[0];
      this.props.selectApiKey(key);
    }
  }

  componentWillUnmount() {
    window.uncustomize();
  }
}

const OrdersContainer = connect(state => ({
  apiKeys: state.apiKeys,
  selectedApiKey: state.terminal.selectedApiKey,
  orders: state.terminal.orders,
  selectedMarket: state.terminal.selectedMarket,
}), dispatch => ({
  selectApiKey: key => dispatch(selectApiKey(key)),
  cancelOrder: order => dispatch(cancelOrder(order)),
}))(Orders);

export default OrdersContainer;
