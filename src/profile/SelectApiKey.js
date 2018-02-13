import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from '../generic/SelectableReactTable';
import SearchHeader from '../generic/SearchHeader';
import { Desktop, Mobile } from '../generic/MediaQuery';
import Pagination from '../generic/Pagination';
import ExchangeSelect from '../dashboard/ExchangeSelect';
import { calculateKeyBalance } from '../generic/util';


class SelectApiKey extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filtered: [{id: 'name', value: ''}, {id: 'exchange', value: 'All'}]
    };
    this.onFilter = this.onFilter.bind(this);
    this.onExchangeChange = this.onExchangeChange.bind(this);
  }

  onExchangeChange(e) {
    const value = e ? e.name : 'All';
    this.setState((state) => {
      const filtered = state.filtered.map(i => i.id === 'exchange' ? {id: 'exchange', value} : i);
      return {filtered};
    });
  }
  onFilter(e) {
    const value = e.target.value;
    this.setState(state => {
      const filtered = state.filtered.map(i => i.id === 'name' ? {id: 'name', value} : i);
      return {filtered};
    });
  }
  render() {
    return (
      <div className="row-fluid choose-api-block">
        <div className="row justify-content-center choose-title">
          <div className="col-auto text-center align-middle choose-setting-title title-text">
            choose api keys
          </div>
          <div className="col-md-12 col-lg-12 col-xl-12 separate-second-block">
            <div className="separate-line d-none d-md-block"></div>
          </div>
          {this.renderTable()}
          <div className="col-12 d-flex align-items-center justify-content-between choose-btn-group">
            <button onClick={this.props.onCancelClick} type="button" className="cancel-btn btn btn-secondary">CANCEL</button>
            <button onClick={this.props.onSendOfferClick} type="button" className="send-request-btn btn btn-secondary active">
              SEND REQUEST</button>
          </div>
        </div>
      </div>
    );
  }

  getColumns() {
    const nameFilter = this.state.filtered.find(f => f.id === 'name').value;
    const exchangeFilter = this.state.filtered.find(f => f.id === 'exchange').value;
    return [
      {
        Header: SearchHeader('Key name', nameFilter, this.onFilter),
        className: 'table_col_value',
        accessor: 'name'
      }, {
        Header: ExchangeHeader(this.props.exchanges, exchangeFilter, this.onExchangeChange),
        accessor: 'exchange',
        className: 'table_col_value upper',
        filterMethod: (filter, row) => {
          if(filter.value === 'All') {
            return true;
          } else {
            return filter.value = row.exchange;
          }
        }
      }, {
        id: '_id',
        className: 'table_col_value',
        Header: (<div className="table_header_wrapper">
          <span className="table_header">Balance</span>
          <div className="sort_icon_wrapper">
            <div className="green_arrow green_arrow_bottom" ></div>
          </div>
        </div>),
        accessor: key => {
          const balance = calculateKeyBalance(key, this.props.currency, this.props.rates);
          if(balance === null) {
            return null;
          }
          const format = formatBalance(balance, this.props.currency);
          return format + ' ' + this.props.currency;
        }
      }
    ];    
  }

  renderTable() {
    const data = this.props.apiKeys;
    return (
      <div style={{width: '100%'}}>
        <Desktop>          
          <ReactTable
            style={{height: 245, width: '100%'}}
            columns={this.getColumns()}
            data={data}
            filtered={this.state.filtered}
            selectedItem={this.props.selectedApiKey}
            onItemSelected={key => this.props.onApiKeySelected(key)}
            scrollBarHeight={150}
          />
        </Desktop>
        <Mobile>
          <ReactTable
            columns={this.getColumns()}
            data={data}
            filtered={this.state.filtered}
            selectedItem={this.props.selectedApiKey}
            onItemSelected={key => this.props.onApiKeySelected(key)}
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
function formatBalance(value, name) {
  if(name === 'USDT') {
    return (value || 0).toFixed(2);
  } else {
    return (value || 0).toFixed(8);
  }
}

const ExchangeHeader = (exchanges, value, onChange) => {
  return (
    <div className="table_header_wrapper">
      <span className="table_header">Exchange</span>
      <div className="sort_icon_wrapper">
        <div className="green_arrow green_arrow_bottom" ></div>
      </div>
      <div className="table_filter_wrapper" onClick={e => e.stopPropagation()}>
        <ExchangeSelect exchanges={exchanges}
          showAllOption
          exchange={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};
SelectApiKey.propTypes = {
  onApiKeySelected: PropTypes.func.isRequired,
  onCancelClick: PropTypes.func.isRequired,
  onSendOfferClick: PropTypes.func.isRequired,
  exchanges: PropTypes.array.isRequired,
  apiKeys: PropTypes.array.isRequired,
  selectedApiKey: PropTypes.object
};

export default SelectApiKey;
