import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';

import { updateAssetGroup } from '../../../actions/assetGroup';
import ModalWindow from '../../../components/Modal';
import GroupsSelect from './GroupsSelect';

class AddContractModal extends React.Component {
  static propTypes = {
    modal: PropTypes.shape({
      contract: PropTypes.shape().isRequired,
    }).isRequired,
    assetGroups: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    intl: PropTypes.shape().isRequired,
    closeAddContractToGroupModal: PropTypes.func.isRequired,
  };

  state = {
    selectedGroup: null,
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { selectedGroup } = this.state;
    const { modal, closeAddContractToGroupModal } = this.props;
    const contractsToUpdate = selectedGroup.contracts.concat(modal.contract._id);

    this.props.updateAssetGroup(selectedGroup._id, contractsToUpdate);
    closeAddContractToGroupModal();
  }

  onSelectGroup = group => () => {
    this.setState({ selectedGroup: group });
  }

  filterGroups = () => {
    const { modal: { contract }, assetGroups } = this.props;

    return assetGroups.filter(({ exchange }) => exchange === contract.exchange);
  };

  render = () => {
    const { modal, closeAddContractToGroupModal } = this.props;
    const { selectedGroup } = this.state;

    return (
      <ModalWindow
        modalIsOpen={modal.isAddContractModalOpen}
        onClose={closeAddContractToGroupModal}
        title={
          <FormattedMessage id="dashboard.addContractToGroup" />
        }
        content={
          <form className="create_group_form" onSubmit={this.handleSubmit}>
            <div className="create_group_container">
              <div className="create_group_fields_wrapper">
                <div className="create_group_field">
                  <GroupsSelect
                    groups={this.filterGroups()}
                    group={selectedGroup}
                    onChange={this.onSelectGroup}
                    defaultPlaceholder="Groups"
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

const mapStateToProps = ({ assetGroups }) => ({
  assetGroups,
});

const mapDispatchToProps = {
  updateAssetGroup,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(AddContractModal));
