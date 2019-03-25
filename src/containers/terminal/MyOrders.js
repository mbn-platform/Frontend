import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import createMqProvider, {querySchema} from '../../MediaQuery';
import { cancelOrder } from '../../actions/terminal';
import { ClosedOrders } from './ClosedOrders';
import { OpenOrders } from './OpenOrders';
import { OrdersHeader } from './OrdersHeader';

const { Screen} = createMqProvider(querySchema);

class MyOrders extends React.Component {

  state = {
    tab: OrdersHeader.tabs[0],
    sort: {},
    pairFilterChecked: false,
  }

  onTabClick = (tab) => {
    if(this.state.tab !== tab) {
      this.setState({tab});
    }
  }

  onPairFilterChange = (checked) => {
    this.setState({pairFilterChecked: checked});
  }

  render() {
    const { tab } = this.state;
    const { orders } = this.props;
    let data = tab === OrdersHeader.tabs[0] ? orders.open : orders.closed;
    return (
      <div className="orders-table chart col-sm-12 col-md-12 col-lg-8">
        <OrdersHeader
          selectedTab={tab} onClick={this.onTabClick}
          pairFilterChecked={this.state.pairFilterChecked}
          onPairFilterChange={this.onPairFilterChange}
          market={this.props.market}
        />
        <Screen on={screenWidth => (
          <div className="orders-table-tabs">
            {
              <div className={classNames('orders-table-tab', 'active')}>
                <div className="orders-table-wrapper">
                  {this.renderContent(data)}
                </div>
              </div>
            }
          </div>
        )}/>
      </div>
    );
  }

  renderContent(data) {
    switch (this.state.tab) {
      case OrdersHeader.tabs[0]:
        if (this.state.pairFilterChecked) {
          data = data.filter((o) => o.symbol === this.props.market);
        }
        return (
          <OpenOrders
            onOrderCancel={this.props.cancelOrder}
            orders={data}
          />
        );
      case OrdersHeader.tabs[1]:
        if (this.state.pairFilterChecked) {
          data = data.filter((o) => o.symbol === this.props.market);
        }
        return (
          <ClosedOrders
            orders={data}
          />
        );
      default:
        return null;
    }
  }
}

const mapStateToProps = state => {
  const {market, orders} = state.terminal;
  return {
    market,
    orders,
  };
};

const mapDispatchToProps =  dispatch => ({
  cancelOrder: order => dispatch(cancelOrder(order)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyOrders);
