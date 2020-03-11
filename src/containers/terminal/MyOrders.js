import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { cancelOrder } from '../../actions/terminal';
import { ClosedOrders } from './ClosedOrders';
import { OpenOrders } from './OpenOrders';
import { Balances } from './Balances';
import { OrdersHeader } from './OrdersHeader';
import createMqProvider, {ordersSchema} from '../../MediaQuery';

class MyOrders extends React.Component {

  constructor(props) {
    super(props);
    const { Screen, MediaQuery } = createMqProvider(ordersSchema);
    this.Screen = Screen;
    this.MediaQuery = MediaQuery;
  }

  state = {
    tab: OrdersHeader.tabs[0],
    sort: {},
    pairChecked: false,
    filledChecked: false,
    smallAssetsChecked: false,
  }

  onTabClick = (tab) => {
    if(this.state.tab !== tab) {
      this.setState({tab});
    }
  }

  handleToggleCheckbox = (name) => ({ target: { checked } }) => {
    this.setState({ [`${name}Checked`]: checked });
  }

  render() {
    const { tab, pairChecked, filledChecked, smallAssetsChecked } = this.state;
    const { orders, market } = this.props;
    let data = tab === OrdersHeader.tabs[0] ? orders.open : orders.closed;

    return (
      <div className="orders-table chart col-sm-12 col-md-12 col-lg-8">
        <OrdersHeader
          market={market}
          selectedTab={tab}
          pairChecked={pairChecked}
          filledChecked={filledChecked}
          smallAssetsChecked={smallAssetsChecked}
          onToggle={this.handleToggleCheckbox}
          onClick={this.onTabClick}
        />
        <div className="orders-table-tabs">
          <div className={classNames('orders-table-tab', 'active')}>
            <div className="orders-table-wrapper">
              {this.renderContent(data)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderContent(data) {
    switch (this.state.tab) {
      case OrdersHeader.tabs[0]:
        if (this.state.pairChecked) {
          data = data.filter((o) => o.symbol === this.props.market);
        }

        if (this.state.filledChecked) {
          data = data.filter((o) => o.filled / o.amount === 1);
        }

        return (
          <this.MediaQuery>
            <this.Screen on={(size) => (
              <OpenOrders
                size={size}
                onOrderCancel={this.props.cancelOrder}
                orders={data}
              />
            )} />
          </this.MediaQuery>
        );
      case OrdersHeader.tabs[1]:
        if (this.state.pairChecked) {
          data = data.filter((o) => o.symbol === this.props.market);
        }

        if (this.state.filledChecked) {
          data = data.filter((o) => o.filled / o.amount === 1);
        }

        return (
          <this.MediaQuery>
            <this.Screen on={(size) => (
              <ClosedOrders
                orders={data}
                size={size}
              />
            )} />
          </this.MediaQuery>
        );
      case OrdersHeader.tabs[2]:
        return <Balances fund={this.props.fund} hideSmallAssets={this.state.smallAssetsChecked} />;
      default:
        return null;
    }
  }
}

const mapStateToProps = state => {
  const {market, orders, fund, assetGroup } = state.terminal;
  return {
    market,
    orders,
    fund: fund || assetGroup,
  };
};

const mapDispatchToProps =  dispatch => ({
  cancelOrder: order => dispatch(cancelOrder(order)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyOrders);
