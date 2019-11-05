import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import ReactTable from '../../../components/SelectableReactTable';
import GroupRow from './GroupRow';

const Contracts = ({ contracts, allContracts, onContractDelete }) => {
  const columns = [
    {
      id: 'name',
      className: 'table_col_value',
      accessor: c => c,
      Cell: ({ value }) => {
        const { from, contractSettings, startDt } = allContracts.current.find(item => item._id === value);
        const startDate = new Date(startDt);
        const endDate = new Date(startDate.getTime() + contractSettings.duration * 86400000);
        const [yyyy, mm, dd] = endDate.toISOString().substr(0,10).split('-');
        const dateString = `${dd}.${mm}.${yyyy}`;

        return (
          <GroupRow
            value={from.name}
            amount={`${contractSettings.sum} ${contractSettings.currency}`}
            expireDate={dateString}
            onDelete={onContractDelete(value)}
          />
        );
      }
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
