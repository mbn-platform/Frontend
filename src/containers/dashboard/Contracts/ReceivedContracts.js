import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import ReactTable from '../../../components/SelectableReactTable';

const ReceivedContracts = ({
  contracts, getColumns, selectedItem, onItemSelected,
}) => (
  <div className="received-contracts-table-wrapper table table-wrapper">
    <div className="table_title_wrapper">
      <div className="table_title">
        <FormattedMessage id="dashboard.receivedContracts" />
      </div>
    </div>
    <ReactTable
      style={{ height: 310 }}
      columns={getColumns()}
      data={contracts}
      selectedItem={selectedItem}
      onItemSelected={onItemSelected}
      scrollBarHeight={310}
    />
  </div>
);

ReceivedContracts.propTypes = {
  contracts: PropTypes.arrayOf(PropTypes.shape()),
  selectedItem: PropTypes.shape(),
  getColumns: PropTypes.func.isRequired,
  onItemSelected: PropTypes.func.isRequired,
};

ReceivedContracts.defaultProps = {
  contracts: [],
  selectedItem: null,
};

export default ReceivedContracts;
