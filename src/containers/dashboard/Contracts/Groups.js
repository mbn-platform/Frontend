import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { showCreateGroupModal, showAddContractToGroupModal } from '../../../actions/modal';
import { Desktop, Mobile } from '../../../generic/MediaQuery';
import ReactTable from '../../../components/SelectableReactTable';
import Pagination from '../../../components/Pagination';

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

  state = {
    selectedGroup: null,
  };

  columns = [
    {
      id: 'name',
      className: 'table_col_value',
      accessor: ({ name }) => name,
    },
  ];

  handleCreateGroup = () => {
    this.props.showCreateGroupModal(this.props.selectedContract);
  };

  handleAddContract = () => {
    this.props.showAddContractToGroupModal(
      this.state.selectedGroup,
      this.filterContracts(),
    );
  };

  onGroupSelect = group => {
    this.setState({ selectedGroup: group });
  };

  filterContracts = () => {
    const { allContracts, user, assetGroups } = this.props;
    const { selectedGroup } = this.state;
    const contractsInGroups = assetGroups.map(group => group.contracts).flat();

    if (!selectedGroup) { return []; }

    return allContracts.filter(({ to, exchange, _id, state }) => (
      to.name === user
      && selectedGroup.exchange === exchange
      && !selectedGroup.contracts.includes(_id)
      && state === 'VERIFIED'
      && !contractsInGroups.includes(_id)
    ));
  };

  render = () => (
    <div className="groups-table-wrapper table">
      <div className="table_title_wrapper">
        <div className="table_title">
          <FormattedMessage id="dashboard.groups" />
        </div>
      </div>
      <Desktop>
        <ReactTable
          style={{ height: 280 }}
          columns={this.columns}
          data={this.props.assetGroups}
          scrollBarHeight={280}
          onItemSelected={this.onGroupSelect}
          selectedItem={this.state.selectedGroup}
        />
      </Desktop>
      <Mobile>
        <ReactTable
          columns={this.columns}
          data={this.props.assetGroups}
          selectedItem={this.state.selectedGroup}
          onItemSelected={this.onGroupSelect}
          minRows={5}
          showPagination={true}
          defaultPageSize={5}
          PaginationComponent={Pagination}
        />
      </Mobile>
      <div className="groups_btn_wrapper">
        <button
          type="button"
          className="create_group_btn"
          onClick={this.handleCreateGroup}
        >
          <FormattedMessage id="dashboard.create" />
        </button>
        <button
          type="button"
          className="add_contract_btn"
          disabled={
            !this.state.selectedGroup
            || this.filterContracts().length === 0
            || this.props.assetGroups.length === 0
          }
          onClick={this.handleAddContract}
        >
          <FormattedMessage id="dashboard.add" />
        </button>
      </div>
    </div>
  );
}

const mapStateToProps = ({
  contracts,
  auth: { profile: { name } },
  assetGroups,
}) => ({
  allContracts: contracts.current,
  user: name,
  assetGroups,
});

const mapDispatchToProps = {
  showCreateGroupModal,
  showAddContractToGroupModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
