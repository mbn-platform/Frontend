import React from 'react';
import ReactTable from '../generic/SelectableReactTable';
import SearchHeader from '../generic/SearchHeader';
import classNames from 'classnames';
import { UncontrolledTooltip } from 'reactstrap';
import { Desktop, Mobile } from '../generic/MediaQuery';
import Pagination from '../generic/Pagination';

const STATUS_HELP = 'Selected key pairs allowed for trading';

class ApiKeyInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      changed: false,
      changedCurrencies: {},
      filtered: [{id: 'currency', value: ''},],
      allSelected: this.isAllSelected(props.apiKey, {}),
    };
    this.onCurrencyChange = this.onCurrencyChange.bind(this);
    this.onCurrencyStateClicked = this.onCurrencyStateClicked.bind(this);
    this.onSelectAllClicked = this.onSelectAllClicked.bind(this);
    this.onSaveChangesClick = this.onSaveChangesClick.bind(this);
  }

  onSaveChangesClick() {
    const currencies = this.props.apiKey.currencies.map(c => {
      if(this.state.changedCurrencies[c.name]) {
        return {...c, enabled: !c.enabled};
      } else {
        return c;
      }
    });
    const key = {...this.props.apiKey, currencies};
    this.props.onKeyUpdateClick(key);
    this.setState({changed: false, changedCurrencies: {}});
  }

  isAllSelected(key, changed) {
    if(!key) {
      return false;
    }
    for(let c of key.currencies) {
      if(!c.enabled && !changed[c.name]) {
        return false;
      }
    }
    return true;
  }

  getCurrencies(apiKey) {
    if(!apiKey) {
      return [];
    } else {
    }
  }

  onSelectAllClicked(e) {
    e.stopPropagation();
    if(!this.props.apiKey) {
      return;
    } else if(this.props.apiKey.state === 'USED') {
      alert('This api key is in use, you cannot change it\'s settings');
      return;
    } else {
      const change = {};
      if(!this.state.allSelected) {
        this.props.apiKey.currencies.reduce((changed, c) => {
          if(!c.enabled) {
            changed[c.name] = true;
          }
          return changed;
        }, change);
      } else {
        this.props.apiKey.currencies.reduce((changed, c) => {
          if(c.enabled && c.name !== 'USDT' && c.name !== 'ETH' && c.name !== 'BTC') {
            changed[c.name] = true;
          }
          return changed;
        }, change);
      }
      this.setState({changed: Object.keys(change).length > 0, changedCurrencies: change, allSelected: !this.state.allSelected});
    }
  }


  canChangeCurrency(currency) {
    if(currency === 'USDT' || currency === 'BTC' || currency === 'ETH') {
      return false;
    } else {
      return true;
    }
  }

  onCurrencyStateClicked(e) {
    e.stopPropagation();
    if(this.props.apiKey.state === 'USED') {
      alert('This api key is in use, you cannot change it\'s settings');
      return;
    }
    const currency = e.target.dataset.currency;
    if(currency === 'USDT' || currency === 'BTC' || currency === 'ETH') {
      alert('BTC/ETH/USDT should be always available for trading');
      return;
    }
    if(!this.canChangeCurrency(currency)) {
      return;
    } else {
      const changedCurrencies = this.state.changedCurrencies;
      if(changedCurrencies[currency]) {
        delete changedCurrencies[currency];
      } else {
        changedCurrencies[currency] = true;
      }
      const allSelected = this.isAllSelected(this.props.apiKey, changedCurrencies);
      if(Object.keys(changedCurrencies).length) {
        this.setState({
          changed: true,
          changedCurrencies,
          allSelected,
        });
      } else {
        this.setState({
          changed: false,
          changedCurrencies,
          allSelected,
        });
      }
    }
  }

  onCurrencyChange(e) {
    this.setState({filtered: [{id: 'currency', value: e.target.value}]});
  }

  componentWillReceiveProps(nextProps) {
    if(
      !nextProps.apiKey || !this.props.apiKey ||
      nextProps.apiKey._id !== this.props.apiKey._id
    ) {
      this.setState({changed: false, allSelected: this.isAllSelected(nextProps.apiKey, {}), changedCurrencies: {}});
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.apiKey !== this.props.apiKey ||
      nextState !== this.state;
  }

  getColumns() {
    const currencyFilter = this.state.filtered.find(f => f.id === 'currency').value;
    return [
      {
        Header: SearchHeader('Currency', currencyFilter, this.onCurrencyChange),
        id: 'currency',
        accessor: 'name',
        headerClassName: 'filter_align_center',
        className: 'table_col_value'
      }, {
        id: 'selected',
        Header: StatusHeader(this.onSelectAllClicked, this.state.allSelected),
        Cell: StatusCell(this.onCurrencyStateClicked, this.state.changedCurrencies),
        accessor: 'enabled',
        headerClassName: 'selected_header',
        maxWidth: 50,
        filterMethod: (filter, row) => {
          if(filter.value === 'all') {
            return true;
          } else {
            return filter.value === row.enabled;
          }
        }
      }, {
        Header: (<div className="table_header_wrapper last_header_column_currencies">
          <span className="table_header">Balance</span>
          <div className="sort_icon_wrapper position_down_icon_wrapper">
            <div className="green_arrow green_arrow_bottom" ></div>
          </div>
        </div>),
        Cell: rowInfo => rowInfo.original.enabled || this.props.isOwnKey ? rowInfo.value || 0 : '',
        className: 'table_col_value',
        minWidth: 110,
        accessor: 'totalBalance'
      }
    ];
  }
  renderContent(data) {
    const scrollBarHeight = this.state.changed ? 217 - 44 : 217;
    return (
      <div>
        <Desktop>
          <ReactTable
            style={{height: 312, marginRight: -1}}
            data={data}
            columns={this.getColumns()}
            filtered={this.state.filtered}
            onItemSelected={() => {}}
            scrollBarHeight={scrollBarHeight}
          />
        </Desktop>
        <Mobile>
          <ReactTable
            data={data}
            columns={this.getColumns()}
            filtered={this.state.filtered}
            onItemSelected={() => {}}
            minRows={5}
            showPagination={true}
            defaultPageSize={15}
            PaginationComponent={Pagination}
          />
        </Mobile>
      </div>
    );
  }

  render() {
    let data;
    if(this.props.apiKey) {
      data = this.props.apiKey.currencies;
    } else {
      data = [];
    }
    return (
      <div className="api_key_currencies_table table">
        <div className="table_title_wrapper clearfix">
          <div className="table_title">Currencies</div>
        </div>
        <Mobile>
          <div className="tooltip-mobile-box">
            {STATUS_HELP}
          </div>
        </Mobile>
        {this.renderContent(data)}
        {this.state.changed ? (
          <div className="table_requests_control_wr clearfix">
            <div className="table_requests_control_text">save changes?</div>
            <div className="table_requests_control_btns">
              <div onClick={this.onSaveChangesClick} className="table_requests_yes table_requests_btn"><u>Yes</u></div>
              <div
                className="table_requests_no table_requests_btn"
                onClick={() => this.setState({changed: false,
                  changedCurrencies: {},
                  allSelected: this.isAllSelected(this.props.apiKey, {})})}
                ><u>No</u></div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export const StatusCell = (onClick, changedCurrencies) => rowInfo => {
  let selected;
  if(changedCurrencies[rowInfo.original.name]) {
    selected = !rowInfo.value;
  } else {
    selected = rowInfo.value;
  }
  const className = classNames('currency_status_checkbox', {selected});
  return (<div data-currency={rowInfo.original.name} data-selected={rowInfo.value} onClick={onClick} className={className}/>);
};

export const StatusHeader = (onSelectAllClicked, selectedAll) => {
  return (
    <div className="table_header_wrapper">
      <span className="table_header">Status</span>
      <div id="help-icon-enabled-currencies" className="table_header_help_wrapper" style={{marginLeft: 0}}></div>
      <UncontrolledTooltip target="help-icon-enabled-currencies" placement="right">
        {STATUS_HELP}
      </UncontrolledTooltip>
      <div className="sort_icon_wrapper">
        <div className="green_arrow green_arrow_bottom" ></div>
      </div>
      <div className="title_green_arrows_wrapper">
        <div onClick={onSelectAllClicked} className="currency_select_all">All</div>
        <div onClick={onSelectAllClicked} className={classNames('currency_status_checkbox', {selected: selectedAll})}></div>
      </div>

    </div>
  );

};

export default ApiKeyInfo;
