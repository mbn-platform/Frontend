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
    pairFilterChecked: false,
    smallAssetesFilterChecked: false,
  }

  onTabClick = (tab) => {
    if(this.state.tab !== tab) {
      this.setState({tab});
    }
  }

  onSmallAssetsFilterChange = (checked) => {
    this.setState({smallAssetesFilterChecked: checked});
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
          smallAssetesFilterChecked={this.state.smallAssetesFilterChecked}
          onSmallAssetsFilterChange={this.onSmallAssetsFilterChange}
          market={this.props.market}
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
        if (this.state.pairFilterChecked) {
          data = data.filter((o) => o.symbol === this.props.market);
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
        if (this.state.pairFilterChecked) {
          data = data.filter((o) => o.symbol === this.props.market);
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
        return <Balances fund={this.props.fund} hideSmallAssets={this.state.smallAssetesFilterChecked} />;
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
