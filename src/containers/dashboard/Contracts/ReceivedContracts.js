import React from 'react';
import { FormattedMessage } from 'react-intl';

import ReactTable from '../../../components/SelectableReactTable';

const ReceivedContracts = ({ contracts, getColumns }) => (
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
      // selectedItem={}
      // onItemSelected={}
      scrollBarHeight={310}
    />
  </div>
);

export default ReceivedContracts;
