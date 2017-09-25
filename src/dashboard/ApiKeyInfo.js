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
          style={{height: '300px'}}
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

class PairsList extends React.Component {
  constructor(props) {
    super(props);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCancelChangesClick = this.onCancelChangesClick.bind(this);
    this.onCheckAllClicked = this.onCheckAllClicked.bind(this);
    this.onSaveChangesClick = this.onSaveChangesClick.bind(this);
    this.state = {
      filter: '',
      changed: false,
      filteredData: props.availablePairs,
      checkedPairs: props.apiKey ? new Set(props.apiKey.pairs) : null
    }
  }

  onSaveChangesClick() {
    const key = {...this.props.apiKey,
      pairs: Array.from(this.state.checkedPairs)
    };
    this.props.onKeyUpdate(key);
  }

  componentWillReceiveProps(nextProps) {
    if(!nextProps.apiKey) {
      this.setState({changed: false, filteredData: null, checkedPairs: null});
    } else {
      this.setState(state => ({
        changed: false,
        checkedPairs: new Set(nextProps.apiKey.pairs),
        filteredData: nextProps.availablePairs, filter: ''}));
    }
  }

  onChange(e) {
    const checked = e.target.checked;
    const index = e.target.dataset.index;
    const pair = this.state.filteredData[index];
    if(checked) {
      this.state.checkedPairs.add(pair);
    } else {
      this.state.checkedPairs.delete(pair);
    }
    if(!this.state.changed) {
      this.setState({changed: true});
    }
    this.forceUpdate();
  }

  onFilterChange(e) {
    const value = e.target.value;
    this.setState({filter: value});
    if(!this.props.apiKey) {
      return;
    }
    if(!value) {
      this.setState({filteredData: this.props.availablePairs});
    } else {
      const filter = value.toLowerCase();
      const filtered = this.props.availablePairs.filter(pair => pair.toLowerCase().indexOf(filter) !== -1);
      this.setState({filteredData: filtered});
    }
  }

  onCancelChangesClick() {
    this.setState({
      checkedPairs: new Set(this.props.apiKey.pairs),
      changed: false
    });
  }

  onCheckAllClicked() {
    if(!this.props.apiKey) {
      return;
    }
    if(this.state.checkedPairs.size === this.props.availablePairs.length) {
      this.setState({
        checkedPairs: new Set(),
        changed: true
      });
    } else {
      this.setState({
        checkedPairs: new Set(this.props.availablePairs),
        changed: true
      });
    }
  }

  renderPairs() {
    if(this.props.apiKey && this.state.filteredData) {
      return this.state.filteredData.map((pair, i) => (
        <PairRow
          key={pair}
          index={i}
          pair={pair}
          checked={this.state.checkedPairs.has(pair)}
          onChange={this.onChange}
        />
        ));
    } else {
      return null;
    }
  }

  renderSubmit() {
    if(this.state.changed) {
      return (
        <tr>
          <td>
            SAVE CHANGES?
            <button onClick={this.onSaveChangesClick}>YES</button>
            <button onClick={this.onCancelChangesClick}>NO</button>
          </td>
        </tr>
        );
    } else {
      return null;
    }
  }

  render() {
    return (
      <table>
        <th>
          <div>Pairs</div>
          <input placeholder="Search" value={this.state.filter}  onChange={this.onFilterChange} />
        </th>
        <th>Status<button onClick={this.onCheckAllClicked}>check all</button></th>
        {this.renderPairs()}
        {this.renderSubmit()}
      </table>
      );
  }
}

const PairRow = ({ index, pair, checked, onChange }) => (
  <tr>
    <td>{pair}</td>
    <td>
      <input type="checkbox" data-index={index} checked={checked} onChange={onChange}/>
    </td>
  </tr>
);

export default ApiKeyInfo;
const SearchFilter = ({filter, onChange}) => (
  <div>
    <input
      className="add_keys_field add_keys_field_name"
      placeholder="Search"
      onChange={event => onChange(event.target.value)}
      value={filter ? filter.value : ''}
    />
  </div>
);
