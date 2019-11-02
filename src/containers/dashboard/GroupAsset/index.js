import React from 'react';
import { connect } from 'react-redux';

import CreatedGroups from './CreatedGroups';
import Contracts from './Contracts';
import CreateGroup from './CreateGroup';
import AddContract from './AddContract';
import { updateAssetGroup } from '../../../actions/assetGroup';

class GroupAsset extends React.Component {
  state = {
    contracts: null,
    selectedGroup: undefined,
  };

  componentDidUpdate = () => {
    const { assetGroups } = this.props;
    const { selectedGroup } = this.state;

    if (selectedGroup) {
      const group = assetGroups.find(item => item._id === selectedGroup._id);

      if (group && group.contracts && group.contracts.length !== selectedGroup.contracts.length) {
        this.setState({ contracts: group.contracts, selectedGroup: group });
      }

      if (!group) {
        this.setState({ contracts: null, selectedGroup: undefined });
      }
    }
  };

  handleGroupSelect = (group) => {
    this.setState({ contracts: group.contracts, selectedGroup: group });
  };

  onContractDelete = (id) => (event) => {
    event.stopPropagation();
    const { selectedGroup: { _id, contracts } } = this.state;
    const contractsToUpdate = contracts.filter(contract => contract !== id);

    this.props.updateAssetGroup(_id, contractsToUpdate);
  };

  render = () => (
    <div className="group-asset-block-wrapper">
      <div className="group-asset-table-wrapper">
        <CreatedGroups
          assetGroups={this.props.assetGroups}
          selectAssetGroup={this.handleGroupSelect}
        />
        <Contracts
          contracts={this.state.contracts}
          onContractDelete={this.onContractDelete}
        />
      </div>
      <div className="group-asset-form-wrapper">
        <CreateGroup />
        <AddContract
          selectedGroup={this.state.selectedGroup}
          selectedContracts={this.state.contracts}
          isActive={this.state.contracts !== null}
        />
      </div>
    </div>
  );
}

const mapStateToProps = ({ assetGroups, contracts }) => ({
  assetGroups,
  allContracts: contracts,
});

const mapDispatchToProps = {
  updateAssetGroup,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupAsset);
