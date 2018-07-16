import React from 'react';
import classNames from 'classnames';
import $ from 'jquery';
import { defaultFormatValue } from '../generic/util';
import {sortData, onColumnSort, classNameForColumnHeader}  from '../generic/terminalSortFunctions';

const TAB_OPEN_ORDERS = 0;
const TAB_COMPLETED_ORDERS = 1;

class OrdersTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {tab: TAB_OPEN_ORDERS, sort: {}};
    this.onTabClick = this.onTabClick.bind(this);
    this.sortData = sortData.bind(this);
    this.onColumnSort = onColumnSort.bind(this);
    this.sortFunctions = {};
  }

  onTabClick(tab) {
    if(this.state.tab !== tab) {
      this.setState({tab});
      $('.js-table-wrapper table').floatThead('reflow');
    }
  };

  render() {
    const data = this.state.tab === TAB_OPEN_ORDERS ? this.props.orders.open : this.props.orders.closed;
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
                      <th onClick={() => this.onColumnSort('type')}><br className="show-mobile"/><span className={classNameForColumnHeader(this.state, 'type')}></span></th>
                      <th onClick={() => this.onColumnSort('dt')}>Opened <span className="hide-mobile">Date</span> <span className={classNameForColumnHeader(this.state, 'dt')}></span></th>
                      <th onClick={() => this.onColumnSort('market')}>Market <span className={classNameForColumnHeader(this.state, 'market')}></span></th>
                      <th onClick={() => this.onColumnSort('limit')}>Price <span className={classNameForColumnHeader(this.state, 'limit')}></span></th>
                      <th onClick={() => this.onColumnSort('filled')}>Units Filled <span className={classNameForColumnHeader(this.state, 'filled')}></span></th>
                      <th onClick={() => this.onColumnSort('amount')}>Units Total <span className={classNameForColumnHeader(this.state, 'amount')}></span></th>
                      <th onClick={() => this.onColumnSort('price')}><span className="hide-mobile">Estimated</span><span className="show-mobile">Est.</span> Total <span className={classNameForColumnHeader(this.state, 'price')}></span></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map(o => (
                      <OpenOrder
                        key={o._id}
                        onOrderCancel={() => this.props.cancelOrder(o)}
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
                      <th onClick={() => this.onColumnSort('type')}><br className="show-mobile"/><span className={classNameForColumnHeader(this.state, 'type')}></span></th>
                      <th onClick={() => this.onColumnSort('dt')}>Opened <span className="hide-mobile">Date</span> <span className={classNameForColumnHeader(this.state, 'dt')}></span></th>
                      <th onClick={() => this.onColumnSort('market')}>Market <span className={classNameForColumnHeader(this.state, 'market')}></span></th>
                      <th onClick={() => this.onColumnSort('limit')}>Price <span className={classNameForColumnHeader(this.state, 'limit')}></span></th>
                      <th onClick={() => this.onColumnSort('filled')}>Units Filled <span className={classNameForColumnHeader(this.state, 'filled')}></span></th>
                      <th onClick={() => this.onColumnSort('amount')}>Units Total <span className={classNameForColumnHeader(this.state, 'amount')}></span></th>
                      <th onClick={() => this.onColumnSort('price')}><span className="hide-mobile">Estimated</span><span className="show-mobile">Est.</span> Total <span className={classNameForColumnHeader(this.state, 'price')}></span></th>
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

const OpenOrder = ({order, onOrderCancel}) => {
  const [main, secondary] = order.symbol.split('-');
  return (
    <tr className={order.type}>
      <td className="text-capitalize">
        <span className="round"></span>
      </td>
      <td>{formatDate(new Date(order.dt))}</td>
      <td>{secondary + '/' + main}</td>
      <td>{order.limit}</td>
      <td>{order.filled}</td>
      <td>{order.amount}</td>
      <td className="ellipsis-cell">{order.price}</td>
      <td onClick={() => onOrderCancel(order)}><span className="remove"></span></td>
    </tr>
  );
};

const CompletedOrder = ({order}) => {
  const [main, secondary] = order.symbol.split('-');
  return (
    <tr className={order.type}>
      <td className="text-capitalize">
        <span className="round"></span>
      </td>
      <td>{formatDate(new Date(order.dt))}</td>
      <td>{secondary + '/' + main}</td>
      <td>{order.price ? (order.price / order.filled).toFixed(8) : order.limit}</td>
      <td>{order.filled}</td>
      <td>{order.amount}</td>
      <td className="ellipsis-cell">{order.price}</td>
    </tr>
  )
};

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
