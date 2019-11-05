import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { getAssetGroups, deleteAssetGroup } from '../../../actions/assetGroup';
import { showConfirmModal } from '../../../actions/modal';
import ReactTable from '../../../components/SelectableReactTable';
import GroupRow from './GroupRow';

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
      id: 'name',
      className: 'table_col_value',
      accessor: c => c.name,
      Cell: ({ value, original }) => (
        <GroupRow
          value={value}
          onSelect={this.onGroupSelect(original)}
          onDelete={this.confirmDeleteGroup(original._id, original.name)}
        />
      ),
    },
  ];

  componentDidMount = () => {
    this.props.getAssetGroups();
  };

  onGroupSelect = (group) => () => {
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
