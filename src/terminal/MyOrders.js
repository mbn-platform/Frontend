import React from 'react';
import classNames from 'classnames';
import $ from 'jquery';
import { formatFloat, defaultFormatValue } from '../generic/util';
import { Desktop } from '../generic/MediaQuery';
import {sortData, onColumnSort, classNameForColumnHeader}  from '../generic/terminalSortFunctions';

const TAB_OPEN_ORDERS = 0;
const TAB_COMPLETED_ORDERS = 1;

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

  render() {
    let data = this.state.tab === TAB_OPEN_ORDERS ? this.props.orders.open : this.props.orders.closed;
    data = data.filter(o => o.symbol === this.props.market);
    const sortedData = this.sortData(data);
    return (
      <div className="orders-table chart col-12 col-sm-6 col-md-12 col-lg-6">
        <div className="orders-table__top justify-content-between row col-12">
          <div className="orders-table__switch-wrap ">
            <span
              onClick={() => this.onTabClick(TAB_OPEN_ORDERS)}
              className={classNames('orders-table__switch', 'orders-open', {active: this.state.tab === TAB_OPEN_ORDERS})}>
              Open Orders
            </span>
            <span
              onClick={() => this.onTabClick(TAB_COMPLETED_ORDERS)}
              className={classNames('orders-table__switch', 'orders-completed', {active: this.state.tab === TAB_COMPLETED_ORDERS})}>
              Completed orders
            </span>
          </div>
          <Desktop>
            <div className="chart-controls align-items-center justify-content-between row">
            </div>
          </Desktop>
        </div>
        <div className="orders-table-tabs">
          {this.state.tab === TAB_OPEN_ORDERS ? (
            <div className={classNames('orders-table-tab', 'orders-open', 'active')}>

              <div className="orders-table-wrapper js-table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th onClick={() => this.onColumnSort('type')}>Type <span className={classNameForColumnHeader(this.state, 'type')}></span></th>
                      <th onClick={() => this.onColumnSort('limit')}>Price <span className={classNameForColumnHeader(this.state, 'limit')}></span></th>
                      <th onClick={() => this.onColumnSort('filled')}>Units Filed <span className={classNameForColumnHeader(this.state, 'filled')}></span></th>
                      <th onClick={() => this.onColumnSort('amount')}>Units Total <span className={classNameForColumnHeader(this.state, 'amount')}></span></th>
                      <th onClick={() => this.onColumnSort('price')}><span>Est.</span> Total <span className={classNameForColumnHeader(this.state, 'price')}></span></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map(o => (
                      <OpenOrder
                        onOrderCancel={() => this.props.cancelOrder(o)}
                        key={o._id}
                        order={o}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          ) : (
            <div className={classNames('orders-table-tab', 'orders-completed', 'active')}>

              <div className="orders-table-wrapper js-table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th onClick={() => this.onColumnSort('type')}>Type <span className={classNameForColumnHeader(this.state, 'type')}></span></th>
                      <th onClick={() => this.onColumnSort('limit')}>Price <span className={classNameForColumnHeader(this.state, 'limit')}></span></th>
                      <th onClick={() => this.onColumnSort('filled')}>Units Filed <span className={classNameForColumnHeader(this.state, 'filled')}></span></th>
                      <th onClick={() => this.onColumnSort('amount')}>Units Total <span className={classNameForColumnHeader(this.state, 'amount')}></span></th>
                      <th onClick={() => this.onColumnSort('price')}><span>Est.</span> Total <span className={classNameForColumnHeader(this.state, 'price')}></span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map(o => (
                      <CompletedOrder
                        key={o._id}
                        order={o}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}
        </div>

      </div>
    );
  }
}

const OpenOrder = ({order, onOrderCancel}) => (
  <tr className={order.type}>
    <td>
      <div className="round-wrapper">
        <span className="round center"></span>
      </div>
    </td>
    <td>{order.limit}</td>
    <td>{order.filled}</td>
    <td>{order.amount}</td>
    <td className="ellipsis-cell">{order.price}</td>
    <td onClick={() => onOrderCancel(order)}><span className="remove"></span></td>
  </tr>
);

const CompletedOrder = ({order}) => (
  <tr className={order.type}>
    <td>
      <div className="round-wrapper">
        <span className="round center"></span>
      </div>
    </td>
    <td>{order.price ? (order.price / order.filled).toFixed(8) : order.limit}</td>
    <td>{order.filled}</td>
    <td>{order.amount}</td>
    <td className="ellipsis-cell">{order.price}</td>
  </tr>
)


function padDate(number) {
  return number < 10 ? '0' + number : number;
};

function formatDate(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    year = padDate(year);
    month = padDate(month);
    day = padDate(day);
    return day + '.' + month + '.' + year;
}
export default MyOrders;
