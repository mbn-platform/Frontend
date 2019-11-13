import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { showCreateGroupModal, showAddContractToGroupModal } from '../../../actions/modal';
import ReactTable from '../../../components/SelectableReactTable';
import GroupRow from '../GroupAsset/GroupRow';

class Groups extends React.Component {
  static propTypes = {
    selectedContract: PropTypes.shape(),
    assetGroups: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    showCreateGroupModal: PropTypes.func.isRequired,
    showAddContractToGroupModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selectedContract: null,
  };

  columns = [
    {
      id: 'name',
      className: 'table_col_value',
      accessor: ({ name }) => name,
      Cell: ({ value }) => <GroupRow value={value} />,
    },
  ];

  handleCreateGroup = () => {
    this.props.showCreateGroupModal(this.props.selectedContract);
  };

  handleAddContract = () => {
    this.props.showAddContractToGroupModal(this.props.selectedContract);
  };

  filterGroups = () => {
    const { selectedContract, assetGroups } = this.props;

    return selectedContract
      ? assetGroups.filter(({ exchange }) => exchange === selectedContract.exchange)
      : assetGroups;
  };

  render = () => (
    <div className="groups-table-wrapper table">
      <div className="table_title_wrapper">
        <div className="table_title">
          <FormattedMessage id="dashboard.groups" />
        </div>
      </div>
      <ReactTable
        style={{ height: 280 }}
        columns={this.columns}
        data={this.filterGroups()}
        scrollBarHeight={280}
      />
      <div className="groups_btn_wrapper">
        <button
          type="button"
          className="create_group_btn"
          disabled={!this.props.selectedContract}
          onClick={this.handleCreateGroup}
        >
          <FormattedMessage id="dashboard.create" />
        </button>
        <button
          type="button"
          className="add_contract_btn"
          disabled={!this.props.selectedContract || this.filterGroups().length === 0}
          onClick={this.handleAddContract}
        >
          <FormattedMessage id="dashboard.add" />
        </button>
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  showCreateGroupModal,
  showAddContractToGroupModal,
};

export default connect(null, mapDispatchToProps)(Groups);
