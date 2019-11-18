import React from 'react';
import classNames from 'classnames';
import ReactTable from '../../components/SelectableReactTable';
import {sortData, onColumnSort, classNameForColumnHeader}  from '../../generic/terminalSortFunctions';
import { FormattedMessage } from 'react-intl';
import createMqProvider, {querySchema} from '../../MediaQuery';

const { Screen } = createMqProvider(querySchema);

const TAB_OPEN_ORDERS = 0;
const TAB_COMPLETED_ORDERS = 1;

class OrdersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: TAB_OPEN_ORDERS,
      sort: {},
      expanded: {},
    };
    this.sortData = sortData.bind(this);
    this.onColumnSort = onColumnSort.bind(this);
    this.sortFunctions = {};
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.assetGroup !== this.props.assetGroup) {
      this.setState({ expanded: {} });
    }
  }

  onTabClick = tab => () => {
    if (this.state.tab !== tab) {
      this.setState({ tab, expanded: {} });
    }
  };

  onRowClick = (_, { original, index }) => ({
    onClick: () => {
      const { assetGroup, fund } = this.props;

      if (!assetGroup || (assetGroup && fund)) { return; }

      this.expandRow(index);
      this.props.getGroupOrder(original._id);
    },
  });

  expandRow = index => {
    let expanded = { ...this.state.expanded };

    if (expanded[index]) {
      expanded[index] = !expanded[index];
    } else {
      expanded[index] = true;
    }

    this.setState({ expanded });
  };

  getColumns = (isOpenOrder, screenWidth, isNested = false) => {
    const ordersColumn = [
      {
        Header: isNested ? '' : <div onClick={() => this.onColumnSort('type')}
          className="table__header-wrapper orders__table-header-wrapper">
          <span className={classNameForColumnHeader(this.state, 'type')}/>
        </div>,
        minWidth: screenWidth === 'lg' ? 40 : 8,
        className: ' orders__table_cell',
        Cell: row => (
          isNested ? null : (
            <div>
              <span className={`orders__table_round ${row.original.type}`}/>
            </div>
          )
        ),
      }, {
        Header: isNested ? '' : <div onClick={() => this.onColumnSort('dt')}
          className="table__header-wrapper orders__table-header-wrapper">
          <FormattedMessage
            id="orders.openDate"
            defaultMessage="Opened Date"
          /> <span className={classNameForColumnHeader(this.state, 'dt')}/>
        </div>,
        minWidth: 60,
        className: ' orders__table_cell',
        Cell: row => {
          return this.formatDate(new Date(row.original.dt));
        },
      }, {
        Header: isNested ? '' : <div onClick={() => this.onColumnSort('market')}
          className="table__header-wrapper orders__table-header-wrapper">
          <FormattedMessage
            id="orders.market"
            defaultMessage="Market"
          /> <span className={classNameForColumnHeader(this.state, 'market')}/>
        </div>,
        minWidth: screenWidth === 'lg' ? 80 : 30,
        Cell: row => {
          const [main, secondary] = row.original.symbol.split('-');

          return secondary + '/' + main;
        },
        className: ' orders__table_cell',
      },
      {
        Header: isNested ? '' : <div onClick={() => this.onColumnSort('limit')}
          className="table__header-wrapper orders__table-header-wrapper">
          <FormattedMessage
            id="orders.price"
            defaultMessage="Price"
          /> <span className={classNameForColumnHeader(this.state, 'limit')}/>
        </div>,
        minWidth: screenWidth === 'lg' ? 80 : 30,
        Cell: row => row.original.limit,
        className: ' orders__table_cell',
      },
      {
        Header: isNested ? '' : <div onClick={() => this.onColumnSort('filled')}
          className="table__header-wrapper orders__table-header-wrapper">
          <FormattedMessage
            id="orders.unitsFilled"
            defaultMessage="Units Filled"
          /> <span className={classNameForColumnHeader(this.state, 'filled')}/>
        </div>,
        minWidth: screenWidth === 'lg' ? 80 : 50,
        Cell: row => row.original.filled,
        className: ' orders__table_cell',
      },
      {
        Header: isNested ? '' : <div onClick={() => this.onColumnSort('amount')}
          className="table__header-wrapper orders__table-header-wrapper">
          <FormattedMessage
            id="orders.unitsTotal"
            defaultMessage="Units Total"
          /> <span className={classNameForColumnHeader(this.state, 'amount')}/>
        </div>,
        minWidth: screenWidth === 'lg' ? 80 : 50,
        Cell: row => row.original.amount,
        className: ' orders__table_cell',
      },
      {
        Header: isNested ? '' : <div onClick={() => this.onColumnSort('price')}
          className="table__header-wrapper orders__table-header-wrapper">
          <span className="hide-mobile">
            <FormattedMessage
              id="orders.estimated"
              defaultMessage="Estimated "
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
          /> <span className={classNameForColumnHeader(this.state, 'price')}/>
        </div>,
        minWidth: screenWidth === 'lg' ? 80 : 40,
        Cell: row => row.original.price,
        className: 'ellipsis-cell orders__table_cell',
      }, {
        expander: true,
        show: false,
      }];

    return [...ordersColumn,
      ...(isOpenOrder ?
        [{
          Header: '',
          minWidth: screenWidth === 'lg' ? 80 : 10,
          Cell: ({ original }) =>
            original.state === 'NEW' || original.state === 'CANCELING'
              ? (
                <div className="orders__table-spinner" />
              ) : (
                <div onClick={() => this.props.cancelOrder(original)}>
                  <span className="orders__table-remove" />
                </div>
              ),
          className: ' orders__table_cell',
        }] : [])
    ];
  };

  formatDate = date => {
    const padDate = number => number < 10 ? '0' + number : number;
    const year = padDate(date.getFullYear()),
      month = padDate(date.getMonth() + 1),
      day = padDate(date.getDate());

    return day + '.' + month + '.' + year;
  }

  renderOrderTable = (sortedData, screenWidth, isOpenOrder) => (
    <ReactTable
      columns={this.getColumns(isOpenOrder, screenWidth)}
      getTrProps={this.onRowClick}
      data={sortedData}
      scrollBarHeight={300}
      expanded={this.state.expanded}
      SubComponent={({ original }) => (
        this.props.assetGroup && original.orders && original.orders.length > 0 ? (
          this.renderNestedOrdersTable(original.orders, isOpenOrder, screenWidth)
        ) : null
      )}
    />
  )

  renderNestedOrdersTable = (orders, isOpenOrder, screenWidth) => (
    <ReactTable
      columns={this.getColumns(isOpenOrder, screenWidth, true)}
      data={this.sortData(orders)}
      scrollBarHeight={100}
      sortable={false}
    />
  )

  render() {
    const isOpenOrder = this.state.tab === TAB_OPEN_ORDERS;
    const data = isOpenOrder ? this.props.orders.open : this.props.orders.closed;
    const sortedData = this.sortData(data);

    return (
      <div className="orders-main__block">
        <Screen on={screenWidth => (
          <React.Fragment>
            <div className="block__top">
              <div className="block__top-switch-wrap">
                <span
                  onClick={this.onTabClick(TAB_OPEN_ORDERS)}
                  className={classNames('block__top-switch', 'orders-open', {active: isOpenOrder})}>
                  <FormattedMessage
                    id="orders.openOrders"
                    defaultMessage="Open Orders"
                  />
                </span>
                <span
                  onClick={this.onTabClick(TAB_COMPLETED_ORDERS)}
                  className={classNames('block__top-switch', 'orders-completed', {active: !isOpenOrder})}>
                  <FormattedMessage
                    id="orders.completedOrders"
                    defaultMessage="Completed orders"
                  />
                </span>
              </div>
            </div>
            <div className="orders-tabs">
              <div className="orders-tab orders-open active">
                <div className="orders__table-wraper">
                  {this.renderOrderTable(sortedData, screenWidth, isOpenOrder)}
                </div>
              </div>
            </div>
          </React.Fragment>
        )} />
      </div>
    );
  }
}

export default OrdersTable;
