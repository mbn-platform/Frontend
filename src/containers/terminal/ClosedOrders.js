import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from '../../components/SelectableReactTable';

export class ClosedOrders extends React.Component {

  constructor(props) {
    super(props);
    this.columns = this.createColumns(this.props.size);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.size !== this.props.size) {
      this.columns = this.createColumns(this.props.size);
      this.forceUpdate();
    }
  }

  createColumns = (size) => {
    let showTime = true;
    let showFilled = true;
    let showTotal = true;
    switch (size) {
      case 'md':
      case 'mobileMd':
        showTime = false;
        break;
      case 'sm':
      case 'mobileSm':
        showTime = false;
        showFilled = false;
        break;
      case  'mobileXs':
        showTime = false;
        showFilled = false;
        showTotal = false;
        break;
      case 'mobileXXs':
        showTime = false;
        showFilled = false;
        showTotal = false;
        break;
      default:
        break;
    }
    return [
      {
        Header: 'Pair/Exchange',
        Cell: (row) => <OpenOrdersCell title={row.original.symbol.split('-').reverse().join('/')} subtitle={row.original.exchange} />,
        width: 80,
      },
      {
        id: 'type',
        Header: 'Side/Type',
        Cell: (row) => <OpenOrdersCell
          className={classNames('openordercell', row.original.type)}
          title={row.original.type} subtitle={row.original.orderType || 'limit'}
        />,
        width: 60,
      },
      {
        id: 'price',
        Header: 'Price',
        Cell: (row) => {
          if (row.original.stopPrice) {
            const subtitle = row.original.condition === 'PRICE_HIGHER' ?
              `>=${row.original.stopPrice}` :
              `<=${row.original.stopPrice}`;
            return <OpenOrdersCell title={row.original.limit} subtitle={subtitle} />;
          } else {
            return <OpenOrdersCell title={row.original.limit} />;
          }
        },
        width: 80,
      },
      {
        id: 'amount',
        Header: 'Amount',
        Cell: (row) => <OpenOrdersCell title={row.original.amount} />,
        width: 80,
      },
      {
        id: 'filled',
        Header: 'Filled',
        Cell: (row) => <OpenOrdersCell title={row.value + '%'} />,
        accessor: (row) => (row.filled / row.amount * 100).toFixed(2),
        show: showFilled,
        width: 50,
      },
      {
        id: 'total',
        Header: 'Total',
        Cell: (row) => <OpenOrdersCell title={row.value} />,
        accessor: 'price',
        width: 80,
        show: showTotal,
      },
      {
        id: 'time',
        Header: 'Time/Date',
        Cell: (row) => <OpenOrdersCell title={row.value.toLocaleTimeString()} subtitle={formatDate(row.value)} />,
        accessor: (info) => new Date(info.dtClose),
        width: 80,
        show: showTime,
      },
    ];
  }

  render() {
    return (
      <ReactTable
        columns={this.columns}
        style={{height: 320}}
        scrollBarHeight={304}
        data={this.props.orders}
      />
    );
  }
}
function OpenOrdersCell(props) {
  const {title, subtitle, className} = props;
  return (
    <div className={className || 'openordercell'}>
      <div className="title">{title}</div>
      <div className="subtitle">{subtitle}</div>
    </div>
  );
}

function formatDate(date) {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

ClosedOrders.propTypes = {
  orders: PropTypes.array.isRequired,
};
