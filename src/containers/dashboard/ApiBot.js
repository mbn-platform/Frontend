import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {FormattedMessage, FormattedDate, FormattedTime, injectIntl } from 'react-intl';
import ReactTable from '../../components/SelectableReactTable';
import Pagination from '../../components/Pagination';
import ExchangeSelect from '../../components/ExchangeSelect';
import {showTwoFactorAuthModal, showConfirmModal} from '../../actions/modal';
import createMqProvider, {querySchema} from '../../MediaQuery';
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

const { Screen} = createMqProvider(querySchema);

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
    const commonHeaders = [
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
        minWidth:  window.matchMedia('(max-width: 1028px)') ? 55 : 100,
        headerClassName: 'table_bot_header_value',
      }, {
        minWidth:  window.matchMedia('(max-width: 1028px)') ? 40 :
          currentMode === ACTIVE_KEYS.value ? 60 : 150,
        Header: this.renderHeader(this.props.intl.messages['dashboard.createdAt']),
        accessor: 'createdAt',
        headerClassName: 'table_bot_header_value',
        Cell: row => {
          return (
            <div className="table_bot_data_wrapper">
              <FormattedTime value={row.original.createdAt}/>
              &nbsp;
              <FormattedDate
                value={row.original.createdAt}
                day='2-digit'
                year='2-digit'
                month='2-digit'
              />

            </div>
          );
        },
        className: 'table_col_value table_bot_col_value',
      },
      {
        minWidth: window.matchMedia('(max-width: 1028px)') ? 40 :
          currentMode === ACTIVE_KEYS.value ? 60 : 150,
        Header: this.renderHeader(this.props.intl.messages['dashboard.activeAt']),
        accessor: 'lastUsedAt',
        headerClassName: 'table_bot_header_value',
        className: 'table_col_value upper table_bot_col_value',
        Cell: row => {
          return (
            <div className="table_bot_data_wrapper">
              <FormattedTime value={row.original.lastUsedAt}/>
              &nbsp;
              <FormattedDate
                value={row.original.lastUsedAt}
                day='2-digit'
                year='2-digit'
                month='2-digit'
              />
            </div>
          );
        },
      }];
    if (currentMode !== ACTIVE_KEYS.value) {
      return [...commonHeaders,
        {
          minWidth: window.matchMedia('(max-width: 1028px)') ? 40 : 60,
          Header: this.renderHeader(this.props.intl.messages['dashboard.deletedAt']),
          accessor: 'deletedAt',
          headerClassName: 'table_bot_header_value',
          className: 'table_col_value upper table_bot_col_value',
          Cell: row => {
            return (
              <div className="table_bot_data_wrapper">
                <FormattedTime value={row.original.deletedAt}/>
                &nbsp;
                <FormattedDate
                  value={row.original.deletedAt}
                  day='2-digit'
                  year='2-digit'
                  month='2-digit'
                />
              </div>
            );
          },
        }
      ];
    } else {
      return [
        ...commonHeaders,
        {
          Header: '',
          minWidth: 24,
          className: 'table_col_delete',
          Cell: row => {
            const canDeleteKey = true;
            const onClick = e => {
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
                this.props.showConfirmModal('dashboard.deleteConfirm', {}, async () => {
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
  }

  renderHeader = header => (
    <div className="table_header_wrapper contract_header_wrapper">
      <span className="table_header">{header}</span>
      <div className="sort_icon_wrapper table_bot_header_icon">
        <div className="green_arrow green_arrow_bottom"/>
      </div>
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
      listItem.hasOwnProperty('deletedAt') :
      !listItem.hasOwnProperty('deletedAt'));
    return (
      <div>
        <Screen on={(size) => {
          switch(size) {
            case 'lg': return (
              <ReactTable
                style={{height: 312}}
                columns={this.getColumns()}
                data={currentData}
                selectedItem={this.props.selectedApiKey}
                onItemSelected={key => this.props.onKeySelected(key)}
                scrollBarHeight={217}
              />);
            case 'sm': return (
              <ReactTable
                columns={this.getColumns()}
                data={currentData}
                selectedItem={this.props.selectedApiKey}
                onItemSelected={key => this.props.onKeySelected(key)}
                minRows={5}
                showPagination={true}
                defaultPageSize={5}
                PaginationComponent={Pagination}
              /> );
            default: return null;
          }
        }} />
      </div>
    );
  }
}

BotList.propTypes = {
  onKeySelected: PropTypes.func.isRequired,
  apiKeys: PropTypes.array.isRequired,
  selectedApiKey: PropTypes.object,
};

const mapStateToProps = state => ({
  is2FAEnable: state.auth.profile.mfaEnabled,
  botKeysList: state.apiKeys.botKeys,
});

const mapDispatchToProps = {
  getKeys: fetchBotKeys,
  deleteKey: deleteBotKeys,
  showConfirmModal,
  showTwoFactorAuthModal,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(BotList));
