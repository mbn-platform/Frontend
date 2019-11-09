import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';

import { createAssetGroup } from '../../../actions/assetGroup';
import ModalWindow from '../../../components/Modal';

class CreateGroupModal extends React.Component {
  static propTypes = {
    modal: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    closeCreateGroupModal: PropTypes.func.isRequired,
  };

  state = { name: '' };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { name } = this.state;
    const { modal, closeCreateGroupModal } = this.props;

    this.props.createAssetGroup(
      name,
      modal.contract.exchange,
      [modal.contract._id],
    );
    closeCreateGroupModal();
  }

  render = () => {
    const { modal, closeCreateGroupModal } = this.props;
    return (
      <ModalWindow
        modalIsOpen={modal.isCreateGroupModalOpen}
        onClose={closeCreateGroupModal}
        title={
          <FormattedMessage id="dashboard.createNewGroup" />
        }
        content={
          <form className="create_group_form" onSubmit={this.handleSubmit}>
            <div className="create_group_container">
              <div className="create_group_fields_wrapper">
                <div className="create_group_field">
                  <input
                    className="create_group_input"
                    name="name"
                    type="text"
                    value={this.state.name}
                    onChange={this.handleChange}
                    placeholder={this.props.intl.messages['dashboard.namePlaceholder']}
                    autoCorrect="off"
                    autoComplete="off"
                    spellCheck="false"
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
  createAssetGroup,
};

export default injectIntl(connect(null, mapDispatchToProps)(CreateGroupModal));
