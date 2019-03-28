import BigNumber from 'bignumber.js';
import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from '../../components/SelectableReactTable';

export class Balances extends React.PureComponent {

  columns = [
    {
      Header: 'Asset',
      Cell: (row) => <OpenOrdersCell title={row.value} subtitle={this.props.fund.exchange} />,
      width: 55,
      accessor: 'name',
    },
    {
      Header: 'Total',
      Cell: (row) => <OpenOrdersCell title={BigNumber(row.value).toString(10)} />,
      minWidth: 75,
      accessor: 'total',
      filterMethod : (filter, row) => {
        if (filter.value) {
          return row.total !== 0;
        } else {
          return true;
        }
      }
    },
    {
      Header: 'Available',
      Cell: (row) => <OpenOrdersCell title={BigNumber(row.value).toString(10)} />,
      minWidth: 75,
      accessor: 'available',
    },
    {
      id: 'inorder',
      Header: 'In order',
      Cell: (row) => <OpenOrdersCell title={BigNumber(row.value).toString(10)} />,
      accessor: (row) => {
        const {total, available, trusted } = row;
        let value = BigNumber(total);
        if (available) {
          value = value.minus(available);
        }
        if (trusted) {
          value = value.minus(trusted);
        }
        return value.toNumber();
      },
      minWidth: 75,
    },
  ]

  render() {
    const data = this.props.fund ? this.props.fund.balances : [];
    const filtered = [{id: 'total', value: this.props.hideSmallAssets}];
    return (
      <ReactTable
        filtered={filtered}
        columns={this.columns}
        style={{height: 320}}
        scrollBarHeight={304}
        data={data}
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

Balances.propTypes = {
  fund: PropTypes.object,
  hideSmallAssets: PropTypes.bool.isRequired,
};
