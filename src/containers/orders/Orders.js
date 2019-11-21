import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';

import HeaderStatus from '../../components/HeaderStatus';
import Controls from './Controls';
import OrdersTable from './OrdersTable';
import {
  cancelOrder, getOrders, getGroupOrder,
  selectExchange, selectFund, getExchangeMarkets,
  startTradingDataUpdates, stopTradingDataUpdates,
} from '../../actions/terminal';
import { setFundId } from '../../generic/util';

class Orders extends React.Component {
  componentDidMount() {
    this.props.startTradingDataUpdates();
    this.onExchangeSelect(this.props.exchange);

    if (this.props.fund) {
      const payload = setFundId({}, this.props.fund);
      this.props.getOrders(payload);
    }
  }

  componentDidUpdate(prevProps) {
    const fund = this.props.fund || this.props.assetGroup;

    if (fund && (this.props.fund !== prevProps.fund || this.props.assetGroup !== prevProps.assetGroup)) {
      const payload = setFundId({}, fund);
      this.props.getOrders(payload);
    }
  }

  componentWillUnmount() {
    this.props.stopTradingDataUpdates();
  }

  onExchangeSelect = (exchange) => {
    this.props.selectExchange(exchange);
    this.props.getExchangeMarkets(exchange);
  };

  render() {
    const apiKeys = this.props.apiKeys.ownKeys;
    const { contracts, exchangeInfo, fund, assetGroup } = this.props;

    return (
      <Container fluid className="orders">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <HeaderStatus {...exchangeInfo} />
            <div className="orders-main">
              <div className="orders-main__top">
                <div className="row  align-items-center">
                  <div className="orders-main__title">
                    <FormattedMessage
                      id="orders.orders"
                      defaultMessage="Orders"
                    />
                  </div>
                </div>
                <Controls
                  apiKeys={apiKeys}
                  userId={this.props.userId}
                  contracts={contracts}
                  fund={this.props.fund}
                  onApiKeySelect={this.props.selectFund}
                  exchange={this.props.exchange}
                  exchanges={this.props.exchanges}
                  onExchangeSelect={this.onExchangeSelect}
                />
              </div>
              <OrdersTable
                orders={this.props.orders}
                cancelOrder={this.props.cancelOrder}
                getGroupOrder={this.props.getGroupOrder}
                assetGroup={assetGroup}
                fund={fund}
              />
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  apiKeys: state.apiKeys,
  userId: state.auth.profile._id,
  contracts: state.contracts.current,
  fund: state.terminal.fund,
  assetGroup: state.terminal.assetGroup,
  orders: state.terminal.orders,
  market: state.terminal.market,
  exchange: state.terminal.exchange,
  exchanges: state.exchangesInfo.exchanges || [],
  exchangeInfo: state.exchangesInfo[state.terminal.exchange],
});

const mapDispatchToProps = {
  startTradingDataUpdates,
  stopTradingDataUpdates,
  getOrders,
  getGroupOrder,
  cancelOrder,
  selectExchange,
  getExchangeMarkets,
  selectFund,
};

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
