import React from 'react';
import PropTypes from 'prop-types';
import SegmentedControl from '../generic/SegmentedControl';
import ReactTable from '../generic/SelectableReactTable';
import SearchFilter from '../generic/SearchFilter';
import ExchangeSelect from './ExchangeSelect';
import './ApiKeys.css';

class ApiKeys extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
      ownedKeys: props.apiKeys.filter(k => k.owner === props.userId),
      sharedKeys: props.apiKeys.filter(k => k.owner !== props.userId),
    };
    this.onTabChange = this.onTabChange.bind(this);
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
    const columns = [
      {
        Header: 'Key name',
        filterable: true,
        Filter: SearchFilter,
        accessor: 'name',
        className: 'table_col_value'
      }, {
        Header: 'Exchange',
        accessor: 'exchange',
        className: 'table_col_value',
      }, {
        id: '_id',
        Header: 'Balance, BTC',
        accessor: key => key.balance ? key.balance : '0',
      }, {
        Header: '',
        Cell: row => (<button onClick={() => this.props.onKeyDeleteClick(row.original)}>Delete</button>)
      }
    ];
    return (
      <ReactTable
        style={{height: '300px'}}
        columns={columns}
        data={data}
        selectedItem={this.props.selectedApiKey}
        onItemSelected={key => this.props.onKeySelected(key)}
      />
    );
  }
}

ApiKeys.propTypes = {
  userId: PropTypes.string.isRequired,
  onKeySelected: PropTypes.func.isRequired,
  onKeyDeleteClick: PropTypes.func.isRequired,
  apiKeys: PropTypes.array.isRequired,
  selectedKey: PropTypes.object
};

export default ApiKeys;
