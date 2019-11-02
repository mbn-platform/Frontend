import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import ReactTable from 'react-table';

import GroupRow from './GroupRow';

const Contracts = ({ contracts, allContracts, onContractDelete }) => {
  const columns = [
    {
      id: 'name',
      className: 'table_col_value',
      accessor: c => c,
      Cell: ({ value }) => {
        const { from, contractSettings } = allContracts.current.find(item => item._id === value);

        return (
          <GroupRow
            value={from.name}
            amount={`${contractSettings.sum} ${contractSettings.currency}`}
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
