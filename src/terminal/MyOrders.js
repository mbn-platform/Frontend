import React from 'react';
import classNames from 'classnames';
import $ from 'jquery';

const TAB_OPEN_ORDERS = 0;
const TAB_COMPLETED_ORDERS = 1;

class MyOrders extends React.Component {

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
  }

  render() {
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
          <div className="chart-controls align-items-center justify-content-between row">
            <div className="control-resize"></div>
            <div className="control-dash"></div>
          </div>
        </div>
        <div className="orders-table-tabs">
          {this.state.tab === TAB_OPEN_ORDERS ? (
            <div className={classNames('orders-table-tab', 'orders-open', 'active')}>

              <div className="orders-table-wrapper js-table-wrapper">
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
                        onOrderCancel={this.props.cancelOrder}
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
                    {this.props.orders.completed.map(o => (
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
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    year = padDate(year);
    month = padDate(month);
    day = padDate(day);
    return day + '.' + month + '.' + year;
}
export default MyOrders;
