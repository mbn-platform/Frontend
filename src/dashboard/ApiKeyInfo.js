import React from 'react';
import ReactTable from '../generic/SelectableReactTable';
import SearchHeader from '../generic/SearchHeader';
import classNames from 'classnames';
import { UncontrolledTooltip } from 'reactstrap';
import { Desktop, Mobile } from '../generic/MediaQuery';
import Pagination from '../generic/Pagination';
import './ApiKeyInfo.css';

const STATUS_HELP = 'Selected key pairs allowed for trading';

class ApiKeyInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {changed: false, currencies: this.getCurrencies(), filtered: [{id: 'currency', value: ''}, {id: 'selected', value: 'all'}]};
    this.onCurrencyChange = this.onCurrencyChange.bind(this);
    this.onCurrencyStateClicked = this.onCurrencyStateClicked.bind(this);
    this.onSelectAllClicked = this.onSelectAllClicked.bind(this);
    this.onSaveChangesClick = this.onSaveChangesClick.bind(this);
  }

  onSaveChangesClick() {
    const key = {_id: this.props.apiKey._id, key: this.props.apiKey.key,
      name: this.props.apiKey.name, exchange: this.props.apiKey.exchange,
      currencies: this.state.currencies.filter(c => c.selected).map(c => c.name)};
    console.log(key);
    this.props.onKeyUpdateClick(key);
    this.setState({changed: false});
  }

  getCurrencies(apiKey) {
    if(!apiKey) {
      return [];
    } else {
      const exchange = this.props.exchanges.find(ex => ex.name === apiKey.exchange);
      return exchange.currencies.map(c => {
        const inApiKey = apiKey.currencies.find(cur => cur.name === c);
        if(inApiKey) {
          return {name: c, selected: true, amount: inApiKey.amount || 0};
        } else {
          return {name: c, selected: false, amount: 0};
        }
      });
    }
  }

  onSelectAllClicked(e) {
    e.stopPropagation();
    this.setState(state => {
      const filtered = state.filtered.map(f => f.id === 'selected' ? {...f, value: 'all'} : f);
      return {filtered};
    });
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
      return;
    }
    const currency = e.target.dataset.currency;
    console.log(currency);
    if(!this.canChangeCurrency(currency)) {
      return;
    } else {
      this.setState(state => {
        const currencies = state.currencies.map(c => c.name === currency ? {...c, selected: !c.selected} : c);
        return {changed: true, currencies};
      });
    }
  }

  onCurrencyChange(e) {
    this.setState({filtered: [{id: 'currency', value: e.target.value}]});
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.apiKey !== this.props.apiKey) {
      this.setState({changed: false, currencies: this.getCurrencies(nextProps.apiKey)});
    }
  }

  getColumns() {
    const currencyFilter = this.state.filtered.find(f => f.id === 'currency').value;
    return [
      {
        Header: SearchHeader('Currency', currencyFilter, this.onCurrencyChange),
        id: 'currency',
        accessor: 'name',
        headerClassName: "filter_align_center",
        className: 'table_col_value'
      }, {
        id: 'selected',
        Header: StatusHeader(this.onSelectAllClicked),
        Cell: StatusCell(this.onCurrencyStateClicked),
        accessor: 'selected',
        headerClassName: 'selected_header',
        filterMethod: (filter, row) => {
          if(filter.value === 'all') {
            return true;
          } else {
            return filter.value === row.selected;
          }
        }
      }, {
        Header: (<div className="table_header_wrapper last_header_column_currencies">
          <span className="table_header">Balance</span>
          <div className="sort_icon_wrapper position_down_icon_wrapper">
            <div className="green_arrow green_arrow_bottom" ></div>
          </div>
        </div>),
        className: 'table_col_value',
        accessor: 'amount'
      }
    ];
  }
  renderContent() {
    const scrollBarHeight = this.state.changed ? 217 - 44 : 217;
    return (
      <div>
        <Desktop>
          <ReactTable
            style={{height: 312, marginRight: -1}}
            data={this.state.currencies}
            columns={this.getColumns()}
            filtered={this.state.filtered}
            onItemSelected={() => {}}
            scrollBarHeight={scrollBarHeight}
          />
        </Desktop>
        <Mobile>
          <ReactTable
            data={this.state.currencies}
            columns={this.getColumns()}
            filtered={this.state.filtered}
            onItemSelected={() => {}}
            minRows={5}
            showPagination={true}
            defaultPageSize={5}
            PaginationComponent={Pagination}
          />
        </Mobile>
      </div>
    );
  }

  render() {

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
        {this.renderContent()}
        {this.state.changed ? (
          <div className="table_requests_control_wr clearfix">
            <div className="table_requests_control_text">save changes?</div>
            <div className="table_requests_control_btns">
              <div onClick={this.onSaveChangesClick} className="table_requests_yes table_requests_btn"><u>Yes</u></div>
              <div onClick={() => this.setState({changed: false, currencies: this.getCurrencies(this.props.apiKey)})} className="table_requests_no table_requests_btn"><u>No</u></div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

const StatusCell = (onClick, apiKey) => rowInfo => {
  const className = classNames('currency_status_checkbox', {selected: rowInfo.value});
  return (<div data-currency={rowInfo.original.name} onClick={onClick} className={className}/>);
};

const StatusHeader = (onSelectAllClicked) => {
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
        <div className="currency_status_checkbox selected"></div>
      </div>
    </div>
  );

};

export default ApiKeyInfo;
