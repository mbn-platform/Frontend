import React from 'react';
import ReactTable from '../../components/SelectableReactTable';
import SearchHeader from '../../components/SearchHeader';
import { Desktop, Mobile } from '../../generic/MediaQuery';
import Pagination from '../../components/Pagination';
import {CONTRACT_STATE_ACCEPTED, CONTRACT_STATE_INIT} from '../../constants';
import {FormattedMessage, injectIntl} from 'react-intl';


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
        Header: SearchHeader(this.props.intl.messages['dashboard.currency'], currencyFilter, this.onCurrencyChange),
        id: 'currency',
        accessor: 'name',
        headerClassName: 'filter_align_center',
        className: 'table_col_value',
        minWidth: 60,
      },
      {
        Header: (<div className="table_header_wrapper">
          <span className="table_header">
            <FormattedMessage
              id="dashboard.total"
              defaultMessage="Total"
            />
          </span>
          <div className="sort_icon_wrapper position_down_icon_wrapper">
            <div className="green_arrow green_arrow_bottom"/>
          </div>
        </div>),
        Cell: rowInfo => rowInfo.value >= 0 && this.showCell(rowInfo.original.name) ? rowInfo.value.toFixed(8).replace(/\.0+$/, '') : '  ',
        className: 'table_col_value',
        minWidth: 100,
        accessor: 'total'
      },
      {
        Header: (<div className="table_header_wrapper">
          <span className="table_header">
            <FormattedMessage
              id="dashboard.available"
              defaultMessage="Available"
            />
          </span>
          <div className="sort_icon_wrapper position_down_icon_wrapper">
            <div className="green_arrow green_arrow_bottom"/>
          </div>
        </div>),
        Cell: rowInfo => rowInfo.value >= 0 && !this.isContractOrOffer()  ? rowInfo.value.toFixed(8).replace(/\.0+$/, '') : '  ',
        className: 'table_col_value',
        minWidth: 100,
        accessor: 'available'
      },
      {
        Header: (<div className="table_header_wrapper">
          <span className="table_header">
            <FormattedMessage
              id="dashboard.trusted"
              defaultMessage="Trusted"
            />
          </span>
          <div className="sort_icon_wrapper position_down_icon_wrapper">
            <div className="green_arrow green_arrow_bottom"/>
          </div>
        </div>),
        Cell: rowInfo => rowInfo.value >= 0 && !this.isContractOrOffer() ? rowInfo.value.toFixed(8).replace(/\.0+$/, '') : ' ',
        className: 'table_col_value',
        minWidth: 100,
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
    if(this.props.fund) {
      data = this.props.fund.balances;
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
      return this.props.intl.messages['dashboard.apiKeyCurrencies'];
    } else {
      if(fund.state === CONTRACT_STATE_ACCEPTED || fund.state === CONTRACT_STATE_INIT) {
        return this.props.intl.messages['dashboard.availableCurrencies'];
      } else {
        return this.props.intl.messages['dashboard.contractCurrencies'];
      }
    }
  
  }
}

export default injectIntl(ApiKeyInfo);
