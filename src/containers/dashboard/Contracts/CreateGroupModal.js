import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';

import { createAssetGroup } from '../../../actions/assetGroup';
import ModalWindow from '../../../components/Modal';
import ExchangeSelect from '../../../components/ExchangeSelect';

class CreateGroupModal extends React.Component {
  static propTypes = {
    modal: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    closeCreateGroupModal: PropTypes.func.isRequired,
  };

  state = {
    name: '',
    exchange: '',
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { name, exchange } = this.state;
    const { closeCreateGroupModal } = this.props;

    this.props.createAssetGroup(name, exchange);
    closeCreateGroupModal();
  }

  handleExchangeChange = exchange => {
    this.setState({ exchange });
  };

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
          <form className="create_group_form m-h-200" onSubmit={this.handleSubmit}>
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
                <div className="create_group_field_select">
                  <ExchangeSelect
                    defaultPlaceholder={this.props.intl.messages['dashboard.exchange']}
                    exchanges={this.props.exchanges}
                    onChange={this.handleExchangeChange}
                    exchange={this.state.exchange}
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

const mapStateToProps = ({ exchanges }) => ({
  exchanges,
});

const mapDispatchToProps = {
  createAssetGroup,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(CreateGroupModal));
