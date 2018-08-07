import React from 'react';
import classNames from 'classnames';
import $ from 'jquery';
import { OpenOrder, CompletedOrder } from '../../components/OrdersStatements';
import {sortData, onColumnSort, classNameForColumnHeader}  from '../../generic/terminalSortFunctions';
import { FormattedMessage } from 'react-intl';

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
              <FormattedMessage
                id="orders.openOrders"
                defaultMessage="Open Orders"
              />
            </span>
            <span
              onClick={() => this.onTabClick(TAB_COMPLETED_ORDERS)}
              className={classNames('block__top-switch', 'orders-completed', {active: this.state.tab === TAB_COMPLETED_ORDERS})}>
              <FormattedMessage
                id="orders.completedOrders"
                defaultMessage="Completed orders"
              />
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
                      <th onClick={() => this.onColumnSort('dt')}>
                        <FormattedMessage
                          id="orders.opened"
                          defaultMessage="Opened"
                        />
                        <span className="hide-mobile">
                          <FormattedMessage
                            id="orders.date"
                            defaultMessage="Date"
                          />
                        </span> <span className={classNameForColumnHeader(this.state, 'dt')}/></th>
                      <th onClick={() => this.onColumnSort('market')}>
                        <FormattedMessage
                          id="orders.market"
                          defaultMessage="Market"
                        />
                        <span className={classNameForColumnHeader(this.state, 'market')}/></th>
                      <th onClick={() => this.onColumnSort('limit')}>
                        <FormattedMessage
                          id="orders.price"
                          defaultMessage="Price"
                        />
                        <span className={classNameForColumnHeader(this.state, 'limit')}/></th>
                      <th onClick={() => this.onColumnSort('filled')}>
                        <FormattedMessage
                          id="orders.unitsFilled"
                          defaultMessage="Units Filled"
                        /> <span className={classNameForColumnHeader(this.state, 'filled')}/></th>
                      <th onClick={() => this.onColumnSort('amount')}>
                        <FormattedMessage
                          id="orders.unitsTotal"
                          defaultMessage="Units Total"
                        /> <span className={classNameForColumnHeader(this.state, 'amount')}/></th>
                      <th onClick={() => this.onColumnSort('price')}><span className="hide-mobile">
                        <FormattedMessage
                          id="orders.estimated"
                          defaultMessage="Estimated"
                        />
                      </span><span className="show-mobile">
                        <FormattedMessage
                          id="orders.est"
                          defaultMessage="Est."
                        />
                      </span>
                      <FormattedMessage
                        id="orders.total"
                        defaultMessage="Total"
                      />
                      <span className={classNameForColumnHeader(this.state, 'price')}/></th>
                      <th/>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map(o => (
                      <OpenOrder
                        key={o._id}
                        onOrderCancel={() => this.props.cancelOrder(o)}
                        isFullScreen
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
                      <th onClick={() => this.onColumnSort('type')}><br className="show-mobile"/><span className={classNameForColumnHeader(this.state, 'type')}/></th>
                      <th onClick={() => this.onColumnSort('dt')}>
                        <FormattedMessage
                          id="orders.opened"
                          defaultMessage="Opened"
                        />
                        <span className="hide-mobile">
                          <FormattedMessage
                            id="orders.date"
                            defaultMessage="Date"
                          /></span> <span className={classNameForColumnHeader(this.state, 'dt')}/></th>
                      <th onClick={() => this.onColumnSort('market')}>
                        <FormattedMessage
                          id="orders.market"
                          defaultMessage="Market"
                        />
                        <span className={classNameForColumnHeader(this.state, 'market')}/></th>
                      <th onClick={() => this.onColumnSort('limit')}>
                        <FormattedMessage
                          id="orders.price"
                          defaultMessage="Price"
                        />
                        <span className={classNameForColumnHeader(this.state, 'limit')}/></th>
                      <th onClick={() => this.onColumnSort('filled')}>
                        <FormattedMessage
                          id="orders.unitsFilled"
                          defaultMessage="Units Filled"
                        />
                        <span className={classNameForColumnHeader(this.state, 'filled')}/></th>
                      <th onClick={() => this.onColumnSort('amount')}>
                        <FormattedMessage
                          id="orders.unitsTotal"
                          defaultMessage="Units Total"
                        /><span className={classNameForColumnHeader(this.state, 'amount')}/></th>
                      <th onClick={() => this.onColumnSort('price')}><span className="hide-mobile"><FormattedMessage
                        id="orders.estimated"
                        defaultMessage="Estimated"
                      /></span><span className="show-mobile">
                        <FormattedMessage
                          id="orders.est"
                          defaultMessage="Est."
                        /></span> 
                      <FormattedMessage
                        id="orders.total"
                        defaultMessage="Total"
                      /> <span className={classNameForColumnHeader(this.state, 'price')}/></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map(o => <CompletedOrder
                      key={o._id}
                      isFullScreen
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

export default OrdersTable;
