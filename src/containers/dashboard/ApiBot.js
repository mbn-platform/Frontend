import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {FormattedMessage, FormattedDate, injectIntl } from 'react-intl';
import ReactTable from '../../components/SelectableReactTable';
import Pagination from '../../components/Pagination';
import ExchangeSelect from '../../components/ExchangeSelect';
import { Desktop, Mobile } from '../../generic/MediaQuery';
import {showTwoFactorAuthModal, showConfirmModal} from '../../actions/modal';
import {fetchBotKeys, deleteBotKeys} from '../../actions/apiKeys';
import classNames from 'classnames';

const ACTIVE_KEYS =  {
  value: 'active',
  label : <FormattedMessage
    id="dashboard.activeKeys"
    defaultMessage="Active Keys"
  />
};

const DELETED_KEYS = {
  value: 'delete',
  label: <FormattedMessage
    id="dashboard.deletedKeys"
    defaultMessage="Deleted Keys"
  />
};

class BotList extends React.Component {

  state = {
    currentMode: ACTIVE_KEYS.value,
    keysList: this.props.botKeysList,
  };

  static getDerivedStateFromProps(nextProps, ) {
    return {
      keysList: nextProps.botKeysList,
    };
  }

  componentDidMount() {
    const {getKeys} = this.props;
    getKeys();
  }

  render() {
    return (
      <div className="api_keys_table table api_keys_table_width_100">
        <div className="table_title_wrapper clearfix">
          <div className="table_title">
            <FormattedMessage
              id="dashboard.apiBotKeys"
              defaultMessage="Api Bot Keys"
            />
          </div>
        </div>
        {this.renderModeDropdown()}
        {this.renderContent()}
      </div>
    );
  }

  getColumns() {
    const { is2FAEnable, apiKeys, getKeys } = this.props;
    const { currentMode } = this.state;
    return [
      {
        Header: this.renderHeader(this.props.intl.messages['dashboard.label']),
        minWidth: window.matchMedia('(max-width: 1028px)') ? 25 : 100,
        accessor: 'label',
        headerClassName: 'table_bot_header_value',
        className: 'table_col_value upper table_bot_col_value',
      }, {
        Header: this.renderHeader(this.props.intl.messages['dashboard.exchangeKey']),
        accessor: 'exchange',
        Cell: row => {
          const concomitantApiKey = apiKeys.find(key => key._id === row.original.keyId);
          return (<div className="table_col_value table_col_text-transform_initial table_bot_col_value">
            {
              concomitantApiKey ? concomitantApiKey.name : ''
            }
          </div>);
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
          />);
        },
        className: 'table_col_value table_bot_col_value',
      },
      {
        minWidth: window.matchMedia('(max-width: 1028px)') ? 40 : 80,
        Header: this.renderHeader(currentMode === ACTIVE_KEYS.value  ?
          this.props.intl.messages['dashboard.activeAt'] :
          this.props.intl.messages['dashboard.deletedAt']),
        accessor: currentMode === ACTIVE_KEYS.value ?
          'lastUsedAt' : 'deletedAt',
        headerClassName: 'table_bot_header_value',
        className: 'table_col_value upper table_bot_col_value',
        Cell: row => {
          return (<FormattedDate
            value={currentMode === ACTIVE_KEYS.value ?
              row.original.lastUsedAt :
              row.original.deletedAt
            }
            day='2-digit'
            year='2-digit'
            month='short'
          />);
        },
      },
      {
        Header: '',
        minWidth: 24,
        className: 'table_col_delete',
        Cell: row => {
          const canDeleteKey = true;
          const onClick =  e => {
            e.stopPropagation();
            const currentRowKeyId = row.original._id;
            if (is2FAEnable) {
              this.props.showConfirmModal('dashboard.deleteConfirm', {},
                () => {
                  this.props.showTwoFactorAuthModal('', {}, async () => {
                    await this.props.deleteKey(currentRowKeyId);
                    getKeys();
                  }
                  );
                });
            } else {
              this.props.showConfirmModal('dashboard.deleteConfirm', {}, async  () => {
                await this.props.deleteKey(currentRowKeyId);
                getKeys();
              });
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
    const { currentMode } = this.state;
    const modeList = [
      ACTIVE_KEYS,
      DELETED_KEYS
    ];
    return (
      <div className="mode_select_wrapper">
        <ExchangeSelect exchanges={ modeList }
          exchange={ currentMode }
          exchangesTitleClasses="mode_select_container"
          defaultPlaceholder="Current Mode"
          onChange={ mode => {
            this.setState({currentMode: mode});
          }}
        />
      </div>
    );
  }

  renderContent() {
    const { keysList, currentMode } = this.state;
    const currentData = keysList.filter(listItem => currentMode === DELETED_KEYS.value ?
      Object.prototype.hasOwnProperty.call(listItem, 'deletedAt') :
      !Object.prototype.hasOwnProperty.call(listItem, 'deletedAt'));
    return (
      <div>
        <Desktop>
          <ReactTable
            style={{height: 312}}
            columns={this.getColumns()}
            data={currentData}
            selectedItem={this.props.selectedApiKey}
            onItemSelected={key => this.props.onKeySelected(key)}
            scrollBarHeight={217}
          />
        </Desktop>
        <Mobile>
          <ReactTable
            columns={this.getColumns()}
            data={currentData}
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
  onKeySelected: PropTypes.func.isRequired,
  apiKeys: PropTypes.array.isRequired,
  selectedApiKey: PropTypes.object
};

const mapDispatchToProps = dispatch => {
  return {
    getKeys: () => dispatch(fetchBotKeys()),
    deleteKey: keyId => dispatch(deleteBotKeys(keyId)),
    showConfirmModal: (text, values, confirmHandler) => dispatch(showConfirmModal(text, values, confirmHandler)),
    showTwoFactorAuthModal: (mode, authData, onTwoFactorAuthSubmit) => dispatch(showTwoFactorAuthModal(mode, authData, onTwoFactorAuthSubmit)),
  };
};

export default injectIntl(connect(state => ({
  is2FAEnable: state.auth.profile.mfaEnabled,
  botKeysList: state.apiKeys.botKeys,
}), mapDispatchToProps)(BotList));
