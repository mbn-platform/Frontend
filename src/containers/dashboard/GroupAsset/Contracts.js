import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import ReactTable from '../../../components/SelectableReactTable';
import TableHeader from './TableHeader';

const Contracts = ({ contracts, allContracts, onContractDelete }) => {
  const columns = [
    {
      Header: TableHeader({ id: 'dashboard.contractor' }),
      id: 'name',
      className: 'table_col_value',
      accessor: c => c,
      Cell: ({ value }) => {
        const { from } = allContracts.current.find(item => item._id === value);

        return from.name;
      },
    },
    {
      Header:  TableHeader({ id: 'dashboard.total' }),
      id: 'total',
      className: 'table_col_value',
      accessor: c => c,
      Cell: ({ value }) => {
        const { contractSettings } = allContracts.current.find(item => item._id === value);

        return `${contractSettings.sum} ${contractSettings.currency}`;
      },
    },
    {
      Header: TableHeader({ id: 'dashboard.expireDate' }),
      id: 'contractsQuantity',
      className: 'table_col_value',
      accessor: c => c,
      Cell: ({ value }) => {
        const { contractSettings, startDt } = allContracts.current.find(item => item._id === value);
        const startDate = new Date(startDt);
        const endDate = new Date(startDate.getTime() + contractSettings.duration * 86400000);
        const [yyyy, mm, dd] = endDate.toISOString().substr(0,10).split('-');

        return `${dd}.${mm}.${yyyy}`;
      },
    },
    {
      Header: '',
      minWidth: 24,
      className: 'table_col_delete',
      Cell: ({ original }) => (
        <div
          className="delete_key_button can_delete_key"
          onClick={onContractDelete(original)}
        />
      ),
    },
  ];

  return (
    <div className="details-contracts-table-wrapper table">
      <div className="table_title_wrapper">
        <div className="table_title">
          <FormattedMessage id="dashboard.detailsContracts" />
        </div>
      </div>
      {!contracts && (
        <div className="details-contracts-empty">
          <FormattedMessage id="dashboard.selectGroup" />
        </div>
      )}
      {contracts && contracts.length > 0 && (
        <ReactTable
          style={{ height: 310 }}
          columns={columns}
          data={contracts}
          scrollBarHeight={310}
        />)}
      {contracts && contracts.length === 0 && (
        <div className="details-contracts-empty">
          <FormattedMessage id="dashboard.groupHasNoContracts" />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = ({ contracts }) => ({
  allContracts: contracts,
});

export default connect(mapStateToProps)(Contracts);
