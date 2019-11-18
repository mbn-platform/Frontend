import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';

import { updateAssetGroup } from '../../../actions/assetGroup';
import ModalWindow from '../../../components/Modal';
import ContractSelect from '../GroupAsset/ContractSelect';

class AddContractModal extends React.Component {
  static propTypes = {
    modal: PropTypes.shape({
      group: PropTypes.shape().isRequired,
    }).isRequired,
    intl: PropTypes.shape().isRequired,
    closeAddContractToGroupModal: PropTypes.func.isRequired,
  };

  state = {
    selectedContract: null,
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleAddContract = (event) => {
    event.preventDefault();
    const { modal: { group }, closeAddContractToGroupModal } = this.props;
    const { selectedContract } = this.state;

    if (!selectedContract) { return; }

    const contractsToUpdate = group.contracts.concat(selectedContract._id);

    this.props.updateAssetGroup(group._id, contractsToUpdate);
    closeAddContractToGroupModal();
  }

  onSelectContract = contract => () => {
    this.setState({ selectedContract: contract });
  }

  render = () => {
    const { modal, closeAddContractToGroupModal } = this.props;
    const { selectedContract } = this.state;

    return (
      <ModalWindow
        modalIsOpen={modal.isAddContractModalOpen}
        onClose={closeAddContractToGroupModal}
        title={
          <FormattedMessage id="dashboard.addContractToGroup" />
        }
        content={
          <form className="create_group_form" onSubmit={this.handleAddContract}>
            <div className="create_group_container">
              <div className="create_group_fields_wrapper">
                <div className="create_group_field">
                  <ContractSelect
                    contracts={modal.contracts}
                    contract={selectedContract}
                    onChange={this.onSelectContract}
                    defaultPlaceholder="Contracts"
                    className="group_select_wr"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="modal__button btn"
            >
              {this.props.intl.messages['ok']}
            </button>
          </form>
        }
      />
    );
  }
};

const mapDispatchToProps = {
  updateAssetGroup,
};

export default injectIntl(connect(null, mapDispatchToProps)(AddContractModal));
