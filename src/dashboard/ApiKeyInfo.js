import React from 'react';
import ReactTable from '../generic/SelectableReactTable';
import SearchHeader from '../generic/SearchHeader';
import classNames from 'classnames';
import { UncontrolledTooltip } from 'reactstrap';
import { Desktop, Mobile } from '../generic/MediaQuery';
import Pagination from '../generic/Pagination';
import {CONTRACT_STATE_ACCEPTED, CONTRACT_STATE_INIT} from '../constants';

const STATUS_HELP = 'Selected key pairs allowed for trading';

class ApiKeyInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filtered: [{id: 'currency', value: ''},],
    };
    this.onCurrencyChange = this.onCurrencyChange.bind(this);
  }

  onCurrencyChange(e) {
    this.setState({filtered: [{id: 'currency', value: e.target.value}]});
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.fund !== this.props.fund ||
      nextState !== this.state;
  }

  isFundInInitOrAcceptedState() {
    return this.props.fund && (this.props.fund.state === CONTRACT_STATE_INIT || this.props.fund.state === CONTRACT_STATE_ACCEPTED);
  }

  showCell(currency) {
    return !this.isFundInInitOrAcceptedState() || this.props.fund.contractSettings.currency === currency;
  }

  isContractOrOffer() {
    return this.props.fund && this.props.fund.from;
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
      },
      {
        Header: (<div className="table_header_wrapper">
          <span className="table_header">Total</span>
          <div className="sort_icon_wrapper position_down_icon_wrapper">
            <div className="green_arrow green_arrow_bottom" ></div>
          </div>
        </div>),
        Cell: rowInfo => rowInfo.value >= 0 && this.showCell(rowInfo.original.name) ? rowInfo.value : '  ',
        className: 'table_col_value',
        minWidth: 110,
        accessor: 'total'
      },
      {
        Header: (<div className="table_header_wrapper">
          <span className="table_header">Available</span>
          <div className="sort_icon_wrapper position_down_icon_wrapper">
            <div className="green_arrow green_arrow_bottom" ></div>
          </div>
        </div>),
        Cell: rowInfo => rowInfo.value >= 0 && !this.isContractOrOffer()  ? rowInfo.value : '  ',
        className: 'table_col_value',
        minWidth: 110,
        accessor: 'available'
      },
      {
        Header: (<div className="table_header_wrapper">
          <span className="table_header">Trusted</span>
          <div className="sort_icon_wrapper position_down_icon_wrapper">
            <div className="green_arrow green_arrow_bottom" ></div>
          </div>
        </div>),
        Cell: rowInfo => rowInfo.value >= 0 && !this.isContractOrOffer() ? rowInfo.value : ' ',
        className: 'table_col_value',
        minWidth: 110,
        accessor: 'trusted'
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
    let isContract = false;
    if(this.props.fund) {
      data = this.props.fund.balances;
      isContract = !!this.props.fund.contractSettings;
    } else {
      data = [];
    }
    return (
      <div className="api_key_currencies_table table">
        <div className="table_title_wrapper clearfix">
          <div className="table_title">{this.getTitle(this.props.fund)}</div>
        </div>
        {this.renderContent(data)}
      </div>
    );
  }

  getTitle(fund) {
    if(!fund || !fund.contractSettings) {
      return 'Api Key currencies';
    } else {
      if(fund.state === CONTRACT_STATE_ACCEPTED || fund.state === CONTRACT_STATE_INIT) {
        return 'Available currencies';
      } else {
        return 'Contract currencies';
      }
    }
  
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
