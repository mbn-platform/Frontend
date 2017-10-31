import React from 'react';
import PropTypes from 'prop-types';
import SegmentedControl from '../generic/SegmentedControl';
import ReactTable from '../generic/SelectableReactTable';
import ExchangeSelect from './ExchangeSelect';
import SearchHeader from '../generic/SearchHeader';
import classNames from 'classnames';
import './ApiKeys.css';

class ApiKeys extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
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
      return {filtered};
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
        <div className="table_rewind_page">
          <div className="table_rewind_page_wrapper">
            <div className="table_prev_page">
              <div className="table_prev_page--button"></div>
            </div>
            <div className="table_next_page">
              <div className="table_next_page--button"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderContent() {
    const { apiKeys } = this.props;
    const data = this.state.selectedTab ? apiKeys.receivedKeys : apiKeys.ownKeys;
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
        Header: (<div className="table_header_wrapper">
          <span className="table_header">Balance,<br/>BTC</span>
          <div className="sort_icon_wrapper" style={{display: 'block', margin: 0}}>
            <div className="green_arrow green_arrow_bottom" ></div>
          </div>
        </div>),
        accessor: key => key.currencies ? key.currencies.reduce((sum, c) => sum + (c.amount || 0), 0) : 0
      }, {
        Header: '',
        Cell: row => {
          const canDeleteKey = row.original.state === 'FREE';
          const onClick = canDeleteKey ? e => {
            e.stopPropagation();
            this.props.onKeyDeleteClick(row.original);
          } : null;
          const className = classNames('delete_key_button', {can_delete_key: canDeleteKey});
          return (<div className={className} onClick={onClick}></div>);
        },
        width: 30
      }
    ];
    return (
      <ReactTable
        style={{height: 312}}
        columns={columns}
        data={data}
        filtered={this.state.filtered}
        selectedItem={this.props.selectedApiKey}
        onItemSelected={key => this.props.onKeySelected(key)}
        scrollBarHeight={217}
      />
    );
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

ApiKeys.propTypes = {
  userId: PropTypes.string.isRequired,
  onKeySelected: PropTypes.func.isRequired,
  onKeyDeleteClick: PropTypes.func.isRequired,
  apiKeys: PropTypes.object.isRequired,
  selectedKey: PropTypes.object
};

export default ApiKeys;
