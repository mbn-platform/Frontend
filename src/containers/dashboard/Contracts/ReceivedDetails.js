import React from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Desktop, Mobile } from 'generic/MediaQuery';
import ReactTable from 'components/SelectableReactTable';
import Pagination from 'components/Pagination';
import { BalanceCell } from './BalanceCell';

const ReceivedDetails = ({ contract }) => {
  const getColumns = () => {
    return [
      {
        Header: (
          <div className="table_header_wrapper">
            <span className="table_header">
              <FormattedMessage id="dashboard.currency" />
            </span>
            <div className="sort_icon_wrapper position_down_icon_wrapper">
              <div className="green_arrow green_arrow_bottom"/>
            </div>
          </div>
        ),
        id: 'currency',
        accessor: 'name',
        headerClassName: 'filter_align_center',
        className: 'table_col_value',
        minWidth: 60,
      },
      {
        Header: (
          <div className="table_header_wrapper">
            <span className="table_header">
              <FormattedMessage id="dashboard.total" />
            </span>
            <div className="sort_icon_wrapper position_down_icon_wrapper">
              <div className="green_arrow green_arrow_bottom"/>
            </div>
          </div>
        ),
        className: 'table_col_value',
        Cell: BalanceCell,
        minWidth: 100,
        accessor: 'total',
      },
      {
        Header: (
          <div className="table_header_wrapper">
            <span className="table_header">
              <FormattedMessage id="dashboard.available" />
            </span>
            <div className="sort_icon_wrapper position_down_icon_wrapper">
              <div className="green_arrow green_arrow_bottom"/>
            </div>
          </div>
        ),
        className: 'table_col_value',
        Cell: BalanceCell,
        minWidth: 100,
        accessor: 'available',
      },
    ];
  };

  return (
    <div className="received-balances-table-wrapper table">
      <div className="table_title_wrapper">
        <div className="table_title">
          <FormattedMessage id="dashboard.balances" />
        </div>
      </div>
      {contract && (
        <React.Fragment>
          <Desktop>
            <ReactTable
              defaultSorted={[{
                id: 'total',
                desc: true,
              }]}
              style={{ height: 310 }}
              data={contract.balances}
              columns={getColumns()}
              scrollBarHeight={310}
            />
          </Desktop>
          <Mobile>
            <ReactTable
              data={contract.balances}
              columns={getColumns()}
              minRows={5}
              showPagination={true}
              defaultPageSize={5}
              PaginationComponent={Pagination}
            />
          </Mobile>
        </React.Fragment>
      )}
    </div>
  );
};

ReceivedDetails.defaultProps = {
  contract: null,
};

ReceivedDetails.propTypes = {
  contract: PropTypes.shape(),
};

export default ReceivedDetails;
