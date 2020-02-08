import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';

import HeaderStatus from 'components/HeaderStatus';
import Controls from './Controls';
import OrdersTable from './OrdersTable';
import {
  getOrders,
  selectExchange, getExchangeMarkets,
  stopTradingDataUpdates, selectMarket,
} from 'actions/terminal';
import { setFundId } from 'generic/util';
import * as selectors from 'selectors/terminal';

class Orders extends React.Component {
  componentDidMount() {
    this.handleSelect(this.props.exchange);

    if (this.props.fund) {
      const payload = setFundId({}, this.props.fund);
      this.props.getOrders(payload);
    }
  }

  componentDidUpdate(prevProps) {
    const { control } = this.props;

    if (control && (control !== prevProps.control)) {
      const payload = setFundId({}, control);

      this.props.getOrders(payload);
    }
  }

  componentWillUnmount() {
    this.props.stopTradingDataUpdates();
  }

  handleSelect = (exchange) => {
    this.props.selectExchange(exchange);
    this.props.getExchangeMarkets(exchange);
    this.props.selectMarket(this.props.market);
  }

  render = () => (
    <Container fluid className="orders">
      <Row>
        <Col xs="12" sm="12" md="12" lg="12">
          <HeaderStatus />
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
              <Controls />
            </div>
            <OrdersTable />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

const mapStateToProps = state => ({
  fund: selectors.fundSelector(state),
  control: selectors.controlSelector(state),
  market: selectors.marketSelector(state),
  exchange: selectors.exchangeSelector(state),
});

const mapDispatchToProps = {
  stopTradingDataUpdates,
  getOrders,
  selectExchange,
  getExchangeMarkets,
  selectMarket,
};

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
