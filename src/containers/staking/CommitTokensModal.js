import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col } from 'reactstrap';
import { FormattedMessage, injectIntl } from 'react-intl';

import ModalWindow from '../../components/Modal';

class CommitTokensModal extends React.Component {
  static propTypes = {
    modal: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    closeCommitTokensModal: PropTypes.func.isRequired,
  };

  state = {
    commits: '',
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log('submit');
    this.props.closeCommitTokensModal();
  };

  render = () => {
    const { modal, closeCommitTokensModal } = this.props;

    return (
      <ModalWindow
        modalIsOpen={modal.isCommitTokensModalOpen}
        onClose={closeCommitTokensModal}
        title={
          <FormattedMessage id="staking.tokenToCommit" />
        }
        content={
          <form className="commit_tokens_form" onSubmit={this.handleSubmit}>
            <Col xs="auto" className="commit_tokens_field">
              <input
                className="commit_tokens_input"
                onChange={this.handleChange}
                name="commits"
                value={this.state.commits}
                type="number"
              />
            </Col>
            <Button type="submit">Confirm</Button>
          </form>
        }
      />
    );
  }
};

export default injectIntl(CommitTokensModal);
