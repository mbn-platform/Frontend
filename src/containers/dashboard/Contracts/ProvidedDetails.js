import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Desktop, Mobile } from '../../../generic/MediaQuery';
import ReactTable from '../../../components/SelectableReactTable';
import Pagination from '../../../components/Pagination';
import { BalanceCell } from './BalanceCell';

class ProvidedDetails extends React.Component {
  static defaultProps = {
    contract: null,
  };

  static propTypes = {
    contract: PropTypes.shape(),
  };

  getColumns = () => {
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
        minWidth: 100,
        Cell: BalanceCell,
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
        Cell: BalanceCell,
        className: 'table_col_value',
        minWidth: 100,
        accessor: 'available',
      },
    ];
  }

  render = () => (
    <div className="provided-balances-table-wrapper table">
      <div className="table_title_wrapper">
        <div className="table_title">
          <FormattedMessage id="dashboard.balances" />
        </div>
      </div>
      {this.props.contract && (
        <React.Fragment>
          <Desktop>
            <ReactTable
              defaultSorted={[{
                id: 'total',
                desc: true,
              }]}
              style={{ height: 310 }}
              data={this.props.contract.balances}
              columns={this.getColumns()}
              scrollBarHeight={310}
            />
          </Desktop>
          <Mobile>
            <ReactTable
              data={this.props.contract.balances}
              columns={this.getColumns()}
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
}

export default ProvidedDetails;
