import React from 'react';
import classNames from 'classnames';
import $ from 'jquery';
import { formatFloat } from '../generic/util';
import {sortData, onColumnSort}  from '../generic/terminalSortFunctions';

const TAB_OPEN_ORDERS = 0;
const TAB_COMPLETED_ORDERS = 1;

class OrdersTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {tab: TAB_OPEN_ORDERS, sort: {}};
    this.onTabClick = this.onTabClick.bind(this);
    this.sortData = sortData.bind(this);
    this.onColumnSort = onColumnSort.bind(this);
    this.sortFunctions = {
      estimated: (a, b) => (a.price * a.unitsTotal) - (b.price * b.unitsTotal),
    };   
  }

  onTabClick(tab) {
    if(this.state.tab !== tab) {
      this.setState({tab});
      $('.js-table-wrapper table').floatThead('reflow');
    }
  };

  render() {
    const data = this.state.tab === TAB_OPEN_ORDERS ? this.props.orders.open : this.props.orders.completed;
    const sortedData = this.sortData(data);
    return (
      <div className="orders-main__block">
        <div className="block__top">
          <div className="block__top-switch-wrap">
            <span
              onClick={() => this.onTabClick(TAB_OPEN_ORDERS)}
              className={classNames('block__top-switch', 'orders-open', {active: this.state.tab === TAB_OPEN_ORDERS})}>
              Open Orders
            </span>
            <span
              onClick={() => this.onTabClick(TAB_COMPLETED_ORDERS)}
              className={classNames('block__top-switch', 'orders-completed', {active: this.state.tab === TAB_COMPLETED_ORDERS})}>
              Completed orders
            </span>
          </div>
        </div>
        <div className="orders-tabs">
          {this.state.tab === TAB_OPEN_ORDERS ? (
            <div className="orders-tab orders-open active">
              <div className="orders-table-wrap js-table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th onClick={() => this.onColumnSort('type')}>Type <span className="icon-dir icon-down-dir"></span></th>
                      <th onClick={() => this.onColumnSort('opened')}>Opened <span className="hide-mobile">Date</span> <span className="icon-dir icon-down-dir"></span></th>
                      <th onClick={() => this.onColumnSort('market')}>Market <span className="icon-dir icon-down-dir"></span></th>
                      <th onClick={() => this.onColumnSort('price')}>Price <span className="icon-dir icon-down-dir"></span></th>
                      <th onClick={() => this.onColumnSort('unitsFilled')}>Units Filed <span className="icon-dir icon-down-dir"></span></th>
                      <th onClick={() => this.onColumnSort('unitsTotal')}>Units Total <span className="icon-dir icon-down-dir"></span></th>
                      <th onClick={() => this.onColumnSort('estimated')}><span className="hide-mobile">Estimated</span><span className="show-mobile">Est.</span> Total <span className="icon-dir icon-down-dir"></span></th>
                      <th className="hide-mobile"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map(o => (
                      <OpenOrder
                        key={o._id}
                        onOrderCancel={this.props.cancelOrder}
                        order={o}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="orders-tab orders-completed active">
              <div className="orders-table-wrap js-table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th onClick={() => this.onColumnSort('type')}>Type <span className="icon-dir icon-down-dir"></span></th>
                      <th onClick={() => this.onColumnSort('opened')}>Opened <span className="hide-mobile">Date</span> <span className="icon-dir icon-down-dir"></span></th>
                      <th onClick={() => this.onColumnSort('market')}>Market <span className="icon-dir icon-down-dir"></span></th>
                      <th onClick={() => this.onColumnSort('price')}>Price <span className="icon-dir icon-down-dir"></span></th>
                      <th onClick={() => this.onColumnSort('unitsFilled')}>Units Filed <span className="icon-dir icon-down-dir"></span></th>
                      <th onClick={() => this.onColumnSort('unitsTotal')}>Units Total <span className="icon-dir icon-down-dir"></span></th>
                      <th onClick={() => this.onColumnSort('estimated')}><span className="hide-mobile">Estimated</span><span className="show-mobile">Est.</span> Total <span className="icon-dir icon-down-dir"></span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map(o => <CompletedOrder
                      key={o._id}
                      order={o}
                    />)}
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
      <span className="round"></span> {order.type}
    </td>
    <td>{formatDate(new Date(order.dateOpened))}</td>
    <td>{order.market}</td>
    <td>{order.price}</td>
    <td>{order.unitsFilled}</td>
    <td>{order.unitsTotal}</td>
    <td className="ellipsis-cell">{formatFloat(order.price * order.unitsTotal)}</td>
    <td onClick={() => onOrderCancel(order)} className="hide-mobile"><span className="remove"></span></td>
  </tr>
);

const CompletedOrder = ({order}) => (
  <tr className={order.type}>
    <td>
      <span className="round"></span> {order.type}
    </td>
    <td>{formatDate(new Date(order.dateOpened))}</td>
    <td>{order.market}</td>
    <td>{order.price}</td>
    <td>{order.unitsFilled}</td>
    <td>{order.unitsTotal}</td>
    <td className="ellipsis-cell">{formatFloat(order.price * order.unitsTotal)}</td>
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
export default OrdersTable;
