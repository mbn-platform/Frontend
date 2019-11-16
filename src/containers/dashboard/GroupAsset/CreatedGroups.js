import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { getAssetGroups, deleteAssetGroup } from '../../../actions/assetGroup';
import { showConfirmModal } from '../../../actions/modal';
import ReactTable from '../../../components/SelectableReactTable';
import TableHeader from './TableHeader';

class CreatedGroups extends React.Component {
  static propTypes = {
    assetGroups: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    getAssetGroups: PropTypes.func.isRequired,
    selectAssetGroup: PropTypes.func.isRequired,
    deleteAssetGroup: PropTypes.func.isRequired,
  };

  state = { selectedGroup: null };

  columns = [
    {
      Header: <TableHeader header={{ id: 'dashboard.groupName' }} />,
      id: 'name',
      className: 'table_col_value',
      accessor: c => c.name,
    },
    {
      Header: <TableHeader header={{ id: 'dashboard.total' }} />,
      id: 'totalInUSDT',
      className: 'table_col_value',
      accessor: c => c.totalInUSDT,
      Cell: ({ value }) => <div>{value} USDT</div>,
    },
    {
      Header: <TableHeader header={{ id: 'simpleValue', values: { value: '#' } }} />,
      id: 'contractsQuantity',
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

  componentDidMount = () => {
    this.props.getAssetGroups();
  };

  onGroupSelect = group => {
    this.props.selectAssetGroup(group);
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

  onRowClick = (_, { original }) => ({
    onClick: () => {
      this.onGroupSelect(original);
    },
  });

  render = () => (
    <div className="created-groups-table-wrapper table table-wrapper">
      <div className="table_title_wrapper">
        <div className="table_title">
          <FormattedMessage id="dashboard.createdGroups" />
        </div>
      </div>
      <ReactTable
        style={{ height: 310 }}
        columns={this.columns}
        data={this.props.assetGroups}
        selectedItem={this.state.selectedGroup}
        onItemSelected={this.onGroupSelect}
        getTrProps={this.onRowClick}
        scrollBarHeight={310}
      />
    </div>
  );
};

const mapDispatchToProps = {
  getAssetGroups,
  deleteAssetGroup,
  showConfirmModal,
};

export default connect(null, mapDispatchToProps)(CreatedGroups);
