import React from 'react';
import classNames from 'classnames';
import $ from 'jquery';

const TAB_OPEN_ORDERS = 0;
const TAB_COMPLETED_ORDERS = 1;

class OrdersTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {tab: TAB_OPEN_ORDERS};
    this.onTabClick = this.onTabClick.bind(this);
  }

  onTabClick(tab) {
    if(this.state.tab !== tab) {
      this.setState({tab});
      $('.js-table-wrapper table').floatThead('reflow');
    }
  };

  render() {
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
                      <th>Type <span className="icon-dir icon-down-dir"></span></th>
                      <th>Opened <span className="hide-mobile">Date</span> <span className="icon-dir icon-down-dir"></span></th>
                      <th>Market <span className="icon-dir icon-down-dir"></span></th>
                      <th>Price <span className="icon-dir icon-down-dir"></span></th>
                      <th>Units Filed <span className="icon-dir icon-down-dir"></span></th>
                      <th>Units Total <span className="icon-dir icon-down-dir"></span></th>
                      <th><span className="hide-mobile">Estimated</span><span className="show-mobile">Est.</span> Total <span className="icon-dir icon-down-dir"></span></th>
                      <th className="hide-mobile"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.orders.open.map(o => (
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
                      <th>Type <span className="icon-dir icon-down-dir"></span>
                      </th>
                      <th>Opened <span className="hide-mobile">Date</span>
                        <span className="icon-dir icon-down-dir"></span>
                      </th>
                      <th>Market <span className="icon-dir icon-down-dir"></span>
                      </th>
                      <th>Price <span className="icon-dir icon-down-dir"></span>
                      </th>
                      <th>Units Total <span className="icon-dir icon-down-dir"></span>
                      </th>
                      <th>Units Filed
                        <span className="icon-dir icon-down-dir"></span></th>
                      <th><span className="hide-mobile">Estimated</span><span className="show-mobile">Est.</span> Total <span className="icon-dir icon-down-dir"></span></th>

                    </tr>
                  </thead>
                  <tbody>
                    {this.props.orders.completed.map(o => <CompletedOrder
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
    <td className="ellipsis-cell">{order.price * order.unitsTotal}</td>
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
    <td className="ellipsis-cell">{order.price * order.unitsTotal}</td>
  </tr>
)

function padDate(number) {
  return number < 10 ? '0' + number : number;
};

function formatDate(date) {
    console.log(typeof date);
    console.log(date);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    year = padDate(year);
    month = padDate(month);
    day = padDate(day);
    return day + '.' + month + '.' + year;
}
export default OrdersTable;
