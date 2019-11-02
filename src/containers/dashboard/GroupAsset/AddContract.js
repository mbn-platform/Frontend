import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';

import { updateAssetGroup } from '../../../actions/assetGroup';
import ContractsSelect from './ContractSelect';

class AddContract extends React.Component {
  state = {
    selectedContract: null,
  };

  componentDidUpdate = ({ selectedGroup }) => {
    if (selectedGroup !== this.props.selectedGroup) {
      this.setState({ selectedContract: null });
    }
  };

  handleAddContract = (event) => {
    event.preventDefault();
    const { selectedGroup } = this.props;
    const { selectedContract } = this.state;

    if (!selectedContract || !selectedGroup) { return; }

    const contractsToUpdate = selectedGroup.contracts.concat(selectedContract._id);

    this.props.updateAssetGroup(selectedGroup._id, contractsToUpdate);
    this.setState({ selectedContract: null });
  }

  onSelectContract = (contract) => () => {
    this.setState({ selectedContract: contract });
  }

  filterContracts = () => {
    const { selectedGroup, allContracts, user } = this.props;

    if (!selectedGroup) { return []; }

    return allContracts.current.filter(({ to, exchange, _id }) => (
      to.name === user
      && selectedGroup.exchange === exchange
      && !selectedGroup.contracts.includes(_id)
    ));
  };

  render = () => {
    const { selectedGroup } = this.props;
    const { selectedContract } = this.state;

    return (
      <div className="add_contract_form_wrapper">
        <div className="add_contract_form_title">
          <div className="table_title">
            <FormattedMessage id="dashboard.addContract" />
          </div>
        </div>
        <form onSubmit={this.handleAddContract}>
          <div className="create_group_container">
            <div className="create_group_field">
              <ContractsSelect
                contracts={this.filterContracts()}
                showAllOption
                contract={selectedContract}
                onChange={this.onSelectContract}
                defaultPlaceholder="Contracts"
              />
            </div>
            <div className="create_group_submit_wrapper">
              <button
                type="submit"
                className="create_group_submit"
                disabled={!selectedGroup || !selectedContract}
              >
                <FormattedMessage id="dashboard.add" />
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  };
}

const mapStateToProps = ({
  contracts,
  auth: { profile: { name } },
}) => ({
  allContracts: contracts,
  user: name,
});

const mapDispatchToProps = {
  updateAssetGroup,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(AddContract));
