import React from 'react';
import ReactTable from '../generic/SelectableReactTable';
import SearchHeader from '../generic/SearchHeader';
import './ApiKeyInfo.css';


class ApiKeyInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {changed: false, filtered: [{id: 'currency', value: ''}]};
    this.onCurrencyChange = this.onCurrencyChange.bind(this);
  }

  onCurrencyChange(e) {
    this.setState({filtered: [{id: 'currency', value: e.target.value}]});
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.apiKey !== this.props.apiKey) {
      this.setState({changed: false});
    }
  }

  getAvailableCurrencies() {
    if(!this.props.apiKey) {
      return [];
    }
    const exchange = this.props.exchanges.find(ex => ex.name === this.props.apiKey.exchange);
    return [...new Set([].concat.apply([], exchange.pairs.map(p => p.split('-'))))];
  }

  render() {
    const currencyFilter = this.state.filtered.find(f => f.id === 'currency').value;
    const columns = [
      {
        Header: SearchHeader('Currency', currencyFilter, this.onCurrencyChange),
        id: 'currency',
        accessor: '',
        className: 'table_col_value'
      }, {
        Header: 'Status'
      }, {
        Header: 'Balance'
      }
    ];
    const data = this.getAvailableCurrencies();

    return (
      <div className="api_key_currencies_table table">
        <div className="table_title_wrapper clearfix">
          <div className="table_title">Currencies</div>
        </div>
        <ReactTable
          style={{height: 312}}
          data={data}
          columns={columns}
          filtered={this.state.filtered}
          onItemSelected={() => this.setState({changed: true})}
        />
        {this.state.changed ? (
          <div className="table_requests_control_wr clearfix">
            <div className="table_requests_control_text">save changes?</div>
            <div className="table_requests_control_btns">
              <div className="table_requests_yes table_requests_btn"><u>Yes</u></div>
              <div className="table_requests_no table_requests_btn"><u>No</u></div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default ApiKeyInfo;
