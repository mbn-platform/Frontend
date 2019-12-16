import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { getAssetGroups, deleteAssetGroup } from '../../../actions/assetGroup';
import { showConfirmModal } from '../../../actions/modal';
import { Desktop, Mobile } from '../../../generic/MediaQuery';
import ReactTable from '../../../components/SelectableReactTable';
import Pagination from '../../../components/Pagination';
import TableHeader from './TableHeader';

class CreatedGroups extends React.Component {
  static propTypes = {
    assetGroups: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    getAssetGroups: PropTypes.func.isRequired,
    selectAssetGroup: PropTypes.func.isRequired,
    deleteAssetGroup: PropTypes.func.isRequired,
  };

  state = { selectedGroup: null };

  getTableColumns = (isMobile = false) => {
    const columns = [
      {
        Header: <TableHeader header={{ id: 'dashboard.groupName' }} />,
        id: 'name',
        className: 'table_col_value',
        minWidth: 80,
        accessor: c => c.name,
      },
      {
        Header: <TableHeader header={{ id: 'dashboard.total' }} />,
        id: 'totalInUSDT',
        className: 'table_col_value',
        minWidth: 80,
        accessor: c => c.totalInUSDT,
        Cell: ({ value }) => <div>{value} USDT</div>,
      },
      {
        Header: <TableHeader header={{ id: 'dashboard.profit' }} />,
        id: 'profit',
        className: 'table_col_value',
        minWidth: 80,
        accessor: c => c.profit,
      },
      {
        Header: <TableHeader header={{ id: 'simpleValue', values: { value: '#' } }} />,
        id: 'quantity',
        className: 'table_col_value',
        accessor: c => c.contracts.length,
      },
      {
        Header: '',
        minWidth: 24,
        className: 'table_col_delete',
        Cell: ({ original: { _id, name } }) => (
          <div
            className="delete_key_button can_delete_key"
            onClick={this.confirmDeleteGroup(_id, name)}
          />
        ),
      },
    ];

    return isMobile ? columns.filter(({ id }) => id !== 'quantity') : columns;
  }


  componentDidMount = () => {
    this.props.getAssetGroups();
  };

  onGroupSelect = group => {
    const { selectedGroup } = this.state;

    this.props.selectAssetGroup(group);

    if (selectedGroup && selectedGroup._id === group._id) {
      this.setState({ selectedGroup: null });
      return;
    }

    this.setState({ selectedGroup: group });
  };

  onGroupDelete = (id, name) => () => {
    this.props.deleteAssetGroup(id, name);
  };

  confirmDeleteGroup = (id, name) => event => {
    event.stopPropagation();
    this.props.showConfirmModal(
      'dashboard.deleteGroupConfirm',
      {},
      this.onGroupDelete(id, name)
    );
  };

  render = () => (
    <div className="created-groups-table-wrapper table table-wrapper">
      <div className="table_title_wrapper">
        <div className="table_title">
          <FormattedMessage id="dashboard.createdGroups" />
        </div>
      </div>
      <Desktop>
        <ReactTable
          style={{ height: 310 }}
          columns={this.getTableColumns()}
          data={this.props.assetGroups}
          selectedItem={this.state.selectedGroup}
          onItemSelected={this.onGroupSelect}
          scrollBarHeight={310}
        />
      </Desktop>
      <Mobile>
        <ReactTable
          columns={this.getTableColumns(true)}
          data={this.props.assetGroups}
          selectedItem={this.state.selectedGroup}
          onItemSelected={this.onGroupSelect}
          minRows={5}
          showPagination={true}
          defaultPageSize={5}
          PaginationComponent={Pagination}
        />
      </Mobile>
    </div>
  );
};

const mapDispatchToProps = {
  getAssetGroups,
  deleteAssetGroup,
  showConfirmModal,
};

export default connect(null, mapDispatchToProps)(CreatedGroups);
