import React from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import ReactTable from '../../../components/SelectableReactTable';

class ReceivedDetails extends React.Component {
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
        minWidth: 100,
        accessor: 'available',
      },
    ];
  }

  render = () => (
    <div className="received-balances-table-wrapper table">
      <div className="table_title_wrapper">
        <div className="table_title">
          <FormattedMessage id="dashboard.balances" />
        </div>
      </div>
      {this.props.contract && (
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
      )}
    </div>
  );
}

export default ReceivedDetails;
