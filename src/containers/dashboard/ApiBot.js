import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {FormattedMessage, injectIntl} from 'react-intl';
import ReactTable from '../../components/SelectableReactTable';
import Pagination from '../../components/Pagination';
import ExchangeSelect from '../../components/ExchangeSelect';
import { Desktop, Mobile } from '../../generic/MediaQuery';
import {showTwoFactorAuthModal, showConfirmModal} from '../../actions/modal';


class BotList extends React.Component {

  state = {
    currentMode: 'Active Keys',
    filtered: [{id: 'name', value: ''}, {id: 'exchange', value: 'All'}],
  };

  componentWillReceiveProps(nextProps) {
    if(!nextProps.selectedApiKey) {
      return;
    }
    if(this.props.selectedApiKey && this.props.selectedApiKey._id === nextProps.selectedApiKey._id) {
      return;
    }
  }

  render() {
    return (
      <div className="api_keys_table table api_keys_table_width_100">
        <div className="table_title_wrapper clearfix">
          <div className="table_title">
            <FormattedMessage
              id="dashboard.apiBotCurrencies"
              defaultMessage="Api Bot Currencies"
            />
          </div>
        </div>
        {this.renderModeDropdown()}
        {this.renderContent()}
      </div>
    );
  }

  getColumns() {
    const { is2FAEnable } = this.props;
    return [
      {
        Header: this.renderHeader(this.props.intl.messages['dashboard.label']),
        Cell: row => (<div className="key_name_text_td">{row.value || (row.original.from._id === this.props.userId ?
          <FormattedMessage
            id="dashboard.trustedTo"
            defaultMessage="Trusted to {name}"
            values={{name: row.original.to.name}}
          /> :
          <FormattedMessage
            id="dashboard.trustedToMe"
            defaultMessage="{name} trusted to me"
            values={{name: row.original.from.name}}
          />)
        }
        </div>),
        minWidth: window.matchMedia('(max-width: 1028px)') ? 15 : 100,
        accessor: 'name',
        headerClassName: 'table_bot_header_value',
        className: 'table_col_value upper table_bot_col_value',
      }, {
        Header: this.renderHeader(this.props.intl.messages['dashboard.exchangeKey']),
        accessor: 'exchange',
        minWidth:  window.matchMedia('(max-width: 1028px)') ? 50 : 100,
        headerClassName: 'table_bot_header_value',
        className: 'table_col_value upper table_bot_col_value',
      }, {
        minWidth:  window.matchMedia('(max-width: 1028px)') ? 30 : 80,
        Header: this.renderHeader(this.props.intl.messages['dashboard.createdAt']),
        accessor: 'createdAt',
        headerClassName: 'table_bot_header_value',
        className: 'table_col_value upper table_bot_col_value',
      },{
        minWidth: window.matchMedia('(max-width: 1028px)') ? 30 : 80,
        Header: this.renderHeader(this.props.intl.messages['dashboard.activeAt']),
        accessor: 'activeAt',
        headerClassName: 'table_bot_header_value',
        className: 'table_col_value upper table_bot_col_value',
      },{
        minWidth: window.matchMedia('(max-width: 1028px)') ? 30 : 80,
        Header: this.renderHeader(this.props.intl.messages['dashboard.deletedAt']),
        accessor: 'deletedAt',
        headerClassName: 'table_bot_header_value',
        className: 'table_col_value upper table_bot_col_value',
      }
      ,{
        Header: '',
        minWidth: window.matchMedia('(max-width: 1028px)') ? 'auto' : 24,
        className: 'table_col_delete table_bot_col_value',
        headerClassName: 'table_bot_header_value',
      }
    ];
  }

  renderHeader = header => (
    <div className="table_header_wrapper contract_header_wrapper">
      <span className="table_header">{header}</span>
    </div>
  );

  renderModeDropdown = () => {
    const { currentMode} = this.state;
    return (
      <div className="mode_select_wrapper">
        <ExchangeSelect exchanges={['Active Keys', 'Deleted Keys']}
          exchange={ currentMode }
          defaultPlaceholder="Current Mode"
          onChange={ e => {
            this.setState({currentMode: e});
          }}
        />
      </div>
    );
  }

  renderContent() {
    const data = this.props.apiKeys;
    return (
      <div>
        <Desktop>
          <ReactTable
            style={{height: 312}}
            columns={this.getColumns()}
            data={data}
            filtered={this.state.filtered}
            selectedItem={this.props.selectedApiKey}
            onItemSelected={key => this.props.onKeySelected(key)}
            scrollBarHeight={217}
          />
        </Desktop>
        <Mobile>
          <ReactTable
            columns={this.getColumns()}
            data={data}
            filtered={this.state.filtered}
            selectedItem={this.props.selectedApiKey}
            onItemSelected={key => this.props.onKeySelected(key)}
            minRows={5}
            showPagination={true}
            defaultPageSize={5}
            PaginationComponent={Pagination}
          />
        </Mobile>
      </div>
    );
  }
}

BotList.propTypes = {
  userId: PropTypes.string.isRequired,
  onKeySelected: PropTypes.func.isRequired,
  onKeyDeleteClick: PropTypes.func.isRequired,
  apiKeys: PropTypes.array.isRequired,
  selectedApiKey: PropTypes.object
};

const mapDispatchToProps = dispatch => {
  return {
    showConfirmModal: (text, values, confirmHandler) => dispatch(showConfirmModal(text, values, confirmHandler)),
    showTwoFactorAuthModal: (mode, authData, onTwoFactorAuthSubmit) => dispatch(showTwoFactorAuthModal(mode, authData, onTwoFactorAuthSubmit)),
  };
};

export default injectIntl(connect(state => ({
  is2FAEnable: state.auth.profile.mfaEnabled,
}), mapDispatchToProps)(BotList));
