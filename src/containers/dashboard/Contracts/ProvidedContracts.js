import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Desktop, Mobile } from '../../../generic/MediaQuery';
import Pagination from '../../../components/Pagination';
import ReactTable from '../../../components/SelectableReactTable';

const ProvidedContracts = ({
  contracts, getColumns, getMobileColumns, selectedItem, onItemSelected,
}) => (
  <div className="provided-contracts-table-wrapper table table-wrapper">
    <div className="table_title_wrapper">
      <div className="table_title">
        <FormattedMessage id="dashboard.providedContracts" />
      </div>
    </div>
    <Desktop>
      <ReactTable
        style={{ height: 310 }}
        columns={getColumns()}
        data={contracts}
        selectedItem={selectedItem}
        onItemSelected={onItemSelected}
        scrollBarHeight={310}
      />
    </Desktop>
    <Mobile>
      <ReactTable
        columns={getMobileColumns()}
        data={contracts}
        selectedItem={selectedItem}
        onItemSelected={onItemSelected}
        minRows={5}
        showPagination={true}
        defaultPageSize={5}
        PaginationComponent={Pagination}
      />
    </Mobile>
  </div>
);

ProvidedContracts.propTypes = {
  contracts: PropTypes.arrayOf(PropTypes.shape()),
  selectedItem: PropTypes.shape(),
  getColumns: PropTypes.func.isRequired,
  onItemSelected: PropTypes.func.isRequired,
};

ProvidedContracts.defaultProps = {
  contracts: [],
  selectedItem: null,
};

export default ProvidedContracts;
