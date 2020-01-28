import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from '../../components/SelectableReactTable';
import ExchangeSelect from '../../components/ExchangeSelect';
import SearchHeader from '../../components/SearchHeader';
import classNames from 'classnames';
import { Desktop, Mobile } from '../../generic/MediaQuery';
import Pagination from '../../components/Pagination';
import {FormattedMessage, injectIntl} from 'react-intl';
import {showTwoFactorAuthModal, showConfirmModal} from '../../actions/modal';
import {connect} from 'react-redux';


class Funds extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filtered: [{id: 'name', value: ''}, {id: 'exchange', value: 'All'}],
    };
    this.onFilter = this.onFilter.bind(this);
    this.onExchangeChange = this.onExchangeChange.bind(this);
  }

  onFilter(e) {
    const value = e.target.value;
    this.setState(state => {
      const filtered = state.filtered.map(i => i.id === 'name' ? {id: 'name', value} : i);
      return {filtered};
    });
  }

  onExchangeChange(e) {
    const value = e ? e : 'All';
    this.setState((state) => {
      const filtered = state.filtered.map(i => i.id === 'exchange' ? {id: 'exchange', value} : i);
      return {filtered};
    });
  }

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
      <div className="api_keys_table table api_keys_table_extend">
        <div className="table_title_wrapper clearfix">
          <div className="table_title">
            <FormattedMessage
              id="dashboard.exchangeAccounts"
              defaultMessage="Connected API"
            />
          </div>
        </div>
        {this.renderContent()}
      </div>
    );
  }

  getColumns() {
    const { is2FAEnable } = this.props;
    const nameFilter = this.state.filtered.find(f => f.id === 'name').value;
    const exchangeFilter = this.state.filtered.find(f => f.id === 'exchange').value;
    return [
      {
        Header: SearchHeader('Name', nameFilter, this.onFilter),
        className: 'table_col_value',
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
        minWidth: 100,
        accessor: 'name'
      }, {
        Header: ExchangeHeader(this.props.exchanges, exchangeFilter, this.onExchangeChange),
        accessor: 'exchange',
        minWidth: 100,
        headerClassName: 'filter_align_center',
        className: 'table_col_value upper',
        filterMethod: (filter, row) => {
          if(filter.value === 'All') {
            return true;
          } else {
            return filter.value === row.exchange;
          }
        }
      }, {
        id: 'balance',
        className: 'table_col_value',
        minWidth: 80,
        Header: (<div className="table_header_wrapper">
          <span className="table_header">
            <FormattedMessage
              id="dashboard.balance"
              defaultMessage="Balance"
            />,<br/>BTC</span>
          <div className="sort_icon_wrapper position_down_icon_wrapper">
            <div className="green_arrow green_arrow_bottom" />
          </div>
        </div>),
        accessor: 'totalInBTC',
      }, {
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

const ExchangeHeader = (exchanges, value, onChange) => {
  return (
    <div className="table_header_wrapper">
      <span className="table_header">
        <FormattedMessage
          id="dashboard.exchange"
          defaultMessage="Exchange"
        />
      </span>
      <div className="sort_icon_wrapper">
        <div className="green_arrow green_arrow_bottom"/>
      </div>
      <div className="table_filter_wrapper" onClick={e => e.stopPropagation()}>
        <ExchangeSelect exchanges={exchanges}
          showAllOption
          exchange={value}
          onChange={onChange}
          defaultPlaceholder="Exchange"
        />
      </div>
    </div>
  );
};

Funds.propTypes = {
  userId: PropTypes.string.isRequired,
  onKeySelected: PropTypes.func.isRequired,
  onKeyDeleteClick: PropTypes.func.isRequired,
  apiKeys: PropTypes.array.isRequired,
  selectedApiKey: PropTypes.object
};

const mapStateToProps = state => ({
  is2FAEnable: state.auth.profile.mfaEnabled,
});

const mapDispatchToProps = {
  showConfirmModal,
  showTwoFactorAuthModal,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Funds));
