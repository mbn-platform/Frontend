import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { closeCommitTokensModal } from '../../actions/modal';
import { commitToEarlyPool } from '../../actions/profile';

import ModalWindow from '../../components/Modal';

class CommitTokensModal extends React.Component {
  static propTypes = {
    modal: PropTypes.shape().isRequired,
    close: PropTypes.func.isRequired,
    commit: PropTypes.func.isRequired,
  };

  state = {
    commits: '100000',
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const amount = parseInt(this.state.commits, 10);
    if (Number.isFinite(amount)) {
      if (amount < 100000) {
        alert('min is 100000');
      } else {
        await this.props.commit(amount);
        await this.props.close();
      }
    }
  };

  render = () => {
    const { modal, close } = this.props;

    return (
      <ModalWindow
        modalIsOpen={modal.isCommitTokensModalOpen}
        onClose={close}
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

const mapDispatchToProps = {
  close: closeCommitTokensModal,
  commit: commitToEarlyPool,
};

export default connect(null, mapDispatchToProps)(CommitTokensModal);
