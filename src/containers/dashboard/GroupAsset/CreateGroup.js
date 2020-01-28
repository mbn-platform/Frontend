import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';

import { createAssetGroup } from '../../../actions/assetGroup';
import ExchangeSelect from '../../../components/ExchangeSelect';

class CreateGroup extends React.Component {
  state = {
    name: '',
    exchange: '',
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { name, exchange } = this.state;

    this.props.createAssetGroup(name, exchange);
    this.setState({ name: '', exchange: '' });
  }

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  }

  handleExchangeChange = exchange => {
    this.setState({ exchange });
  };

  render = () => (
    <div className="create_group_form_wrapper">
      <div className="create_group_form_title">
        <div className="table_title">
          <FormattedMessage id="dashboard.createNewGroup" />
        </div>
      </div>
      <form onSubmit={this.handleSubmit}>
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
          <div className="create_group_submit_wrapper">
            <button
              type="submit"
              className="create_group_submit"
            >
              <FormattedMessage id="dashboard.create" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const mapStateToProps = ({ exchanges }) => ({
  exchanges,
});

const mapDispatchToProps = {
  createAssetGroup,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(CreateGroup));
