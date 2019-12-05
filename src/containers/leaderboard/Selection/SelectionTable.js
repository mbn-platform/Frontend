import React from 'react';
import { FormattedMessage } from 'react-intl';
import ReactTable from 'react-table';

import { PaginationWithPageRight } from '../../../components/PaginationWithPage';

class SelectionTable extends React.PureComponent {
  state = {
    page: 0,
    pageSize: 20,
  }

  columns = [
    {
      Header:(
        <div className="table__header-wrapper">
          <FormattedMessage id="selection.name" />
        </div>
      ),
      className: 'ratings__table-cell selection',
      Cell: ({ value }) => (
        <div className="name nickname">
          @{value}
        </div>
      ),
      accessor: 'name',
    }, {
      Header: (
        <div className="table__header-wrapper">
          <FormattedMessage id="selection.profitPercent" />
        </div>
      ),
      className: 'ratings__table-cell selection',
      accessor: 'profit',
    }, {
      Header: (
        <div className="table__header-wrapper">
          <FormattedMessage id="selection.confirmationStatus" />
        </div>
      ),
      Cell: ({value}) => value ? 'Yes' : 'No',
      className: 'ratings__table-cell selection',
      accessor: 'confirmed',
    },
  ];

  render = () => (
    <ReactTable
      className='rating-table'
      columns={this.columns}
      data={this.props.data}
      minRows={this.state.pageSize}
      page={this.state.page}
      resizable={false}
      pageSize={this.state.pageSize}
      showPagination={true}
      noDataText=""
      PaginationComponent={PaginationWithPageRight}
      paginationPageDispatcher={(page, pageSize) => {
        this.setState({ pageSize, page });
      }}
      paginationPageSizeDispatcher={pageSize => {
        this.setState({ pageSize });
      }}
    />
  );
}

export default SelectionTable;
