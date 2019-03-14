import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import ReactTable from '../../components/SelectableReactTable';
import {sortData, onColumnSort, classNameForColumnHeader}  from '../../generic/terminalSortFunctions';
import { FormattedMessage } from 'react-intl';
import createMqProvider, {querySchema} from '../../MediaQuery';
import { cancelOrder } from '../../actions/terminal';
import { ClosedOrders } from './ClosedOrders';
import { OpenOrders } from './OpenOrders';
import { OrdersHeader } from './OrdersHeader';

const { Screen} = createMqProvider(querySchema);

class MyOrders extends React.Component {

  constructor(props) {
    super(props);
    this.state = {tab: OrdersHeader.tabs[0], sort: {}};
    this.onColumnSort = onColumnSort.bind(this);
    this.sortData = sortData.bind(this);
    this.sortFunctions = {};
  }

  onRowClick = () => {
    return {
      onClick: () => null
    };
  }

  onTabClick = (tab) => {
    if(this.state.tab !== tab) {
      this.setState({tab});
    }
  }

  getOrderColumns = screenWidth => {
    const { tab } = this.state;
    const { cancelOrder } = this.props;
    const isOpenOrdersTable = tab === OrdersHeader.tabs[0];

    const ordersColumn = [
      {
        Header:
          <div onClick={() => this.onColumnSort('type')} className="table__header-wrapper">
            <FormattedMessage id="terminal.type" defaultMessage="Type"/>
            <span className={classNameForColumnHeader(this.state, 'type')}/>
          </div>,
        minWidth: screenWidth === 'lg' ? 45 : 30,
        className: 'terminal__table-order-type',
        Cell: row =>  (
          <div className={row.original.type}>
            <div className="round-wrapper">
              <span className="round center"/>
            </div>
          </div>
        )
      },
      {
        Header:   <div onClick={() => this.onColumnSort('limit')} className="table__header-wrapper">
          <FormattedMessage id="terminal.priceForTable" defaultMessage="Price"/>
          <span className={classNameForColumnHeader(this.state, 'limit')}/></div>,
        className: 'terminal__table-order-type',
        Cell: row => (
          <div>{row.original.limit}</div>
        ),
        minWidth: screenWidth === 'lg' ? 45 : 20,
      },
      {
        minWidth: screenWidth === 'lg' ? 70 : 50,
        className: 'terminal__table-order-type',
        Header: <div onClick={() => this.onColumnSort('filled')} className="table__header-wrapper">
          <FormattedMessage id="terminal.unitsFilled" defaultMessage="Units Filled"/>
          <span className={classNameForColumnHeader(this.state, 'filled')}/></div>,
        Cell: row => {
          return (
            <div>{row.original.filled}</div>
          );
        },
      },
      {
        Header: <div onClick={() => this.onColumnSort('amount')} className="table__header-wrapper">
          <FormattedMessage id="terminal.unitsTotal" defaultMessage="Units Total"/>
          <span className={classNameForColumnHeader(this.state, 'amount')}/>
        </div>,
        className: 'terminal__table-order-type',
        minWidth: 50,
        Cell: row => {
          return (
            <div>{row.original.amount}</div>
          );
        },
      },
      {
        Header: <div onClick={() => this.onColumnSort('price')} className="table__header-wrapper">
          <span><FormattedMessage id="terminal.est" defaultMessage="Est."/></span>
          <FormattedMessage id="terminal.total" defaultMessage="Total"/>
          <span className={classNameForColumnHeader(this.state, 'price')}/>
        </div>,
        className: 'terminal__table-order-type',
        minWidth: screenWidth === 'lg' ? 40 : 20,
        Cell: row => (
          <div className="ellipsis-cell">{row.original.price}</div>
        )
      },
    ];

    return [
      ...ordersColumn,
      ...(isOpenOrdersTable ?
        [{
          Header: '',
          className: 'terminal__table-order-type',
          minWidth: 20,
          Cell: row =>  (
            <div onClick={() => cancelOrder(row.original)} className="terminal__table-order-remove">
              <span className="remove"/>
            </div>
          )
        }] :
        [])
    ];
  }

  renderOrdersTable = (data, screenWidth) =>
    <ReactTable
      getTrProps={this.onRowClick}
      columns={this.getOrderColumns(screenWidth)}
      data={data}
      scrollBarHeight={140}
      style={{height: 180}}
    />

  render() {
    const { tab } = this.state;
    const { orders } = this.props;
    let data = tab === OrdersHeader.tabs[0] ? orders.open : orders.closed;
    const sortedData = this.sortData(data);
    return (
      <div className="orders-table chart col-sm-12 col-md-12 col-lg-8">
        <OrdersHeader selectedTab={tab} onClick={this.onTabClick} />
        <Screen on={screenWidth => (
          <div className="orders-table-tabs">
            {
              <div className={classNames('orders-table-tab', 'active')}>
                <div className="orders-table-wrapper">
                  {this.renderContent(sortedData)}
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
        return (
          <OpenOrders
            onOrderCancel={this.props.cancelOrder}
            orders={data}
          />
        );
      case OrdersHeader.tabs[1]:
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
