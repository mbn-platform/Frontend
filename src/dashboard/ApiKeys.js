import React from 'react';
import PropTypes from 'prop-types';
import SegmentedControl from '../generic/SegmentedControl';
import ReactTable from '../generic/SelectableReactTable';
import ExchangeSelect from './ExchangeSelect';
import SearchHeader from '../generic/SearchHeader';
import './ApiKeys.css';

class ApiKeys extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
      ownedKeys: props.apiKeys.filter(k => k.owner === props.userId),
      sharedKeys: props.apiKeys.filter(k => k.owner !== props.userId),
      filtered: [{id: 'name', value: ''}, {id: 'exchange', value: 'All'}]
    };
    this.onTabChange = this.onTabChange.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onExchangeChange = this.onExchangeChange.bind(this);
  }

  onFilter(e) {
    const value = e.target.value;
    this.setState(state => {
      const filtered = state.filtered.map(i => i.id === 'name' ? {id: 'name', value} : i);
      return {filtered}
    });
  }

  onExchangeChange(e) {
    const value = e ? e.name : 'All';
    this.setState((state) => {
      const filtered = state.filtered.map(i => i.id === 'exchange' ? {id: 'exchange', value} : i);
      return {filtered};
    });
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.selectedApiKey && nextProps.selectedApiKey !== this.props.selectedApiKey) {
      const requiredTab = nextProps.selectedApiKey.owner === nextProps.userId ? 0 : 1;
      if(this.state.selectedTab !== requiredTab) {
        this.setState({selectedTab: requiredTab});
      }
    }
    if(nextProps.apiKeys !== this.props.apiKeys) {
      this.setState({
        ownedKeys: nextProps.apiKeys.filter(k => k.owner === nextProps.userId),
        sharedKeys: nextProps.apiKeys.filter(k => k.owner !== nextProps.userId),
      });
    }
  }

  onTabChange(index) {
    this.setState({selectedTab: index});
  }

  render() {
    return (
      <div className="api_keys_table table">
        <div className="table_title_wrapper clearfix">
          <div className="table_title">API keys</div>
          <SegmentedControl selectedIndex={this.state.selectedTab} segments={['MINE', 'OTHER']} onChange={this.onTabChange}/>
        </div>
        {this.renderContent()}
      </div>
    );
  }

  renderContent() {
    const { apiKeys, userId } = this.props;
    const data = this.state.selectedTab ? apiKeys.filter(k => k.owner !== userId)
      : apiKeys.filter(k => k.owner === userId);
    const nameFilter = this.state.filtered.find(f => f.id === 'name').value;
    const exchangeFilter = this.state.filtered.find(f => f.id === 'exchange').value;
    const columns = [
      {
        Header: SearchHeader('Key name', nameFilter, this.onFilter),
        className: 'table_col_value',
        accessor: 'name'
      }, {
        Header: ExchangeHeader(this.props.exchanges, exchangeFilter, this.onExchangeChange),
        accessor: 'exchange',
        className: 'table_col_value',
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
        Header: 'Balance, BTC',
        accessor: key => key.balance ? key.balance : '0',
        headerClassName: 'table_header'
      }, {
        Header: '',
        Cell: row => (<div className="delete_key_button" onClick={() => this.props.onKeyDeleteClick(row.original)}></div>),
        width: 30
      }
    ];
    return (
      <ReactTable
        style={{height: '300px'}}
        columns={columns}
        data={data}
        filtered={this.state.filtered}
        selectedItem={this.props.selectedApiKey}
        onItemSelected={key => this.props.onKeySelected(key)}
      />
    );
  }
}


const ExchangeHeader = (exchanges, value, onChange) => {
  return () => (
    <div>
      <div className="table_header">Exchange</div>
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

ApiKeys.propTypes = {
  userId: PropTypes.string.isRequired,
  onKeySelected: PropTypes.func.isRequired,
  onKeyDeleteClick: PropTypes.func.isRequired,
  apiKeys: PropTypes.array.isRequired,
  selectedKey: PropTypes.object
};

export default ApiKeys;
