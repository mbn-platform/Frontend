import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {FormattedMessage, FormattedDate, injectIntl, Intl} from 'react-intl';
import ReactTable from '../../components/SelectableReactTable';
import Pagination from '../../components/Pagination';
import ExchangeSelect from '../../components/ExchangeSelect';
import { Desktop, Mobile } from '../../generic/MediaQuery';
import {showTwoFactorAuthModal, showConfirmModal} from '../../actions/modal';
import {fetchBotKeys, deleteBotKeys} from '../../actions/apiKeys';
import classNames from 'classnames';


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
    const { is2FAEnable, apiKeys } = this.props;
    return [
      {
        Header: this.renderHeader(this.props.intl.messages['dashboard.label']),
        // Cell: row => (<div className="key_name_text_td">{row.value || (row.original.from._id === this.props.userId ?
        //   <FormattedMessage
        //     id="dashboard.trustedTo"
        //     defaultMessage="Trusted to {name}"
        //     values={{name: row.original.to.name}}
        //   /> :
        //   <FormattedMessage
        //     id="dashboard.trustedToMe"
        //     defaultMessage="{name} trusted to me"
        //     values={{name: row.original.from.name}}
        //   />)
        // }
        // </div>),
        minWidth: window.matchMedia('(max-width: 1028px)') ? 25 : 100,
        accessor: 'label',
        headerClassName: 'table_bot_header_value',
        className: 'table_col_value upper table_bot_col_value',
      }, {
        Header: this.renderHeader(this.props.intl.messages['dashboard.exchangeKey']),
        accessor: 'exchange',
        Cell: row => {
          const concomitantApiKey = apiKeys.find(key => key._id = row.original.keyId);
          return (<div className="table_col_value table_col_text-transform_initial table_bot_col_value">{concomitantApiKey.name}</div>);
        },
        minWidth:  window.matchMedia('(max-width: 1028px)') ? 60 : 100,
        headerClassName: 'table_bot_header_value',
      }, {
        minWidth:  window.matchMedia('(max-width: 1028px)') ? 40 : 80,
        Header: this.renderHeader(this.props.intl.messages['dashboard.createdAt']),
        accessor: 'createdAt',
        headerClassName: 'table_bot_header_value',
        Cell: row => {
          return (<FormattedDate
            value={row.original.createdAt}
            day='2-digit'
            year='2-digit'
            month='short'
            className="table_col_value table_bot_col_value"/>);
        },
      },{
        minWidth: window.matchMedia('(max-width: 1028px)') ? 40 : 80,
        Header: this.renderHeader(this.props.intl.messages['dashboard.activeAt']),
        accessor: 'activeAt',
        headerClassName: 'table_bot_header_value',
        className: 'table_col_value upper table_bot_col_value',
      },{
        minWidth: window.matchMedia('(max-width: 1028px)') ? 40 : 80,
        Header: this.renderHeader(this.props.intl.messages['dashboard.deletedAt']),
        accessor: 'deletedAt',
        headerClassName: 'table_bot_header_value',
        className: 'table_col_value upper table_bot_col_value',
      }
      ,{
        Header: '',
        minWidth: 24,
        className: 'table_col_delete',
        Cell: row => {
          const canDeleteKey = true;
          const onClick =  e => {
            e.stopPropagation();
            if (is2FAEnable) {
              this.props.showConfirmModal('dashboard.deleteConfirm', {},
                () =>
                  this.props.showTwoFactorAuthModal('', {}, async data => await(this.props.onKeyDeleteClick(row.original, data)))
              );
            } else {
              this.props.showConfirmModal('dashboard.deleteConfirm', {}, () => this.props.onKeyDeleteClick(row.original));
            }
          };
          const className = classNames('delete_key_button', {can_delete_key: canDeleteKey});
          return (<div className={className} onClick={onClick}/>);
        },
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
    const { botKeysList } = this.props;
    return (
      <div>
        <Desktop>
          <ReactTable
            style={{height: 312}}
            columns={this.getColumns()}
            data={botKeysList}
            filtered={this.state.filtered}
            selectedItem={this.props.selectedApiKey}
            onItemSelected={key => this.props.onKeySelected(key)}
            scrollBarHeight={217}
          />
        </Desktop>
        <Mobile>
          <ReactTable
            columns={this.getColumns()}
            data={botKeysList}
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
    getKeys: () => dispatch(fetchBotKeys()),
    deleteKey: () => dispatch(deleteBotKeys()),
    showConfirmModal: (text, values, confirmHandler) => dispatch(showConfirmModal(text, values, confirmHandler)),
    showTwoFactorAuthModal: (mode, authData, onTwoFactorAuthSubmit) => dispatch(showTwoFactorAuthModal(mode, authData, onTwoFactorAuthSubmit)),
  };
};

export default injectIntl(connect(state => ({
  is2FAEnable: state.auth.profile.mfaEnabled,
  botKeysList: state.apiKeys.botKeys,
}), mapDispatchToProps)(BotList));
