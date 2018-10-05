import React from 'react';
import classNames from 'classnames';
import $ from 'jquery';
import { Desktop } from '../../generic/MediaQuery';
import ReactTable from '../../components/SelectableReactTable';
import { OpenOrder, CompletedOrder } from '../../components/OrdersStatements';
import {sortData, onColumnSort, classNameForColumnHeader}  from '../../generic/terminalSortFunctions';
import { FormattedMessage } from 'react-intl';
import {BigNumber} from 'bignumber.js/bignumber';
import createMqProvider, {querySchema} from '../../MediaQuery';

const TAB_OPEN_ORDERS = 0;
const TAB_COMPLETED_ORDERS = 1;

const { Screen} = createMqProvider(querySchema);

class MyOrders extends React.Component {

  constructor(props) {
    super(props);
    this.state = {tab: TAB_OPEN_ORDERS, sort: {}};
    this.onTabClick = this.onTabClick.bind(this);
    this.onColumnSort = onColumnSort.bind(this);
    this.sortData = sortData.bind(this);
    this.sortFunctions = {};
  }

  onTabClick(tab) {
    if(this.state.tab !== tab) {
      this.setState({tab});
      $('.js-table-wrapper table').floatThead('reflow');
    }
  }

  getOrderColumns = screenWidth => {
    const { tab } = this.state;
    const { cancelOrder } = this.props;
    const isOpenOrdersTable = tab === TAB_OPEN_ORDERS;

    const ordersColumn = [
      {
        Header:
          <div onClick={() => this.onColumnSort('type')} className="terminal__header-wrapper">
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
        Header:   <div onClick={() => this.onColumnSort('limit')} className="terminal__header-wrapper">
          <FormattedMessage id="terminal.priceForTable" defaultMessage="Price"/>
          <span className={classNameForColumnHeader(this.state, 'limit')}/></div>,
        Cell: row => (
          <div>{row.original.limit}</div>
        ),
        minWidth: screenWidth === 'lg' ? 45 : 30,
      },
      {
        minWidth: screenWidth === 'lg' ? 70 : 50,
        Header: <div onClick={() => this.onColumnSort('filled')} className="terminal__header-wrapper">
          <FormattedMessage id="terminal.unitsFilled" defaultMessage="Units Filled"/>
          <span className={classNameForColumnHeader(this.state, 'filled')}/></div>,
        Cell: row => {
          return (
            <div>{row.original.filled}</div>
          );
        },
      },
      {
        Header: <div onClick={() => this.onColumnSort('amount')} className="terminal__header-wrapper">
          <FormattedMessage id="terminal.unitsTotal" defaultMessage="Units Total"/>
          <span className={classNameForColumnHeader(this.state, 'amount')}/>
        </div>,
        minWidth: screenWidth === 'lg' ? 70 : 50,
        Cell: row => {
          return (
            <div>{row.original.amount}</div>
          );
        },
      },
      {
        Header: <div onClick={() => this.onColumnSort('price')} className="terminal__header-wrapper">
          <span><FormattedMessage id="terminal.est" defaultMessage="Est."/></span>
          <FormattedMessage id="terminal.total" defaultMessage="Total"/>
          <span className={classNameForColumnHeader(this.state, 'price')}/>
        </div>,
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

  renderOrdersTable = (data, screenWidth) => {
    return  (<ReactTable
      columns={this.getOrderColumns(screenWidth)}
      data={data}
      scrollBarHeight={140}
      style={{height: 180}}
    />);
  }

  render() {
    const { tab } = this.state;
    const { orders, market } = this.props;
    let data = tab === TAB_OPEN_ORDERS ? orders.open : orders.closed;
    data = data.filter(o => o.symbol === market);
    const sortedData = this.sortData(data);
    return (
      <div className="orders-table chart col-12 col-sm-6 col-md-12 col-lg-6">
        <div className="orders-table__top justify-content-between row col-12">
          <div className="orders-table__switch-wrap ">
            <span
              onClick={() => this.onTabClick(TAB_OPEN_ORDERS)}
              className={classNames('orders-table__switch', 'orders-open', {active: tab === TAB_OPEN_ORDERS})}>
              <FormattedMessage id="terminal.openOrders" defaultMessage="Open Orders"/>
            </span>
            <span
              onClick={() => this.onTabClick(TAB_COMPLETED_ORDERS)}
              className={classNames('orders-table__switch', 'orders-completed', {active: tab === TAB_COMPLETED_ORDERS})}>
              <FormattedMessage id="terminal.completedOrders" defaultMessage="Completed orders"/>
            </span>
          </div>
          <Desktop>
            <div className="chart-controls align-items-center justify-content-between row">
            </div>
          </Desktop>
        </div>
        <Screen on={screenWidth => (
          <div className="orders-table-tabs">
            {
              <div className={classNames('orders-table-tab', tab === TAB_OPEN_ORDERS ? 'orders-open' : 'orders-completed' , 'active')}>
                <div className="orders-table-wrapper js-table-wrapper">
                  {this.renderOrdersTable(tab === TAB_OPEN_ORDERS ? sortedData.open : sortedData.closed, screenWidth)}
                </div>
              </div>
            }
          </div>
        )}/>
      </div>
    );
  }
}

export default MyOrders;
