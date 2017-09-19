import React from 'react';
import PropTypes from 'prop-types';
import SegmentedControl from '../generic/SegmentedControl';
import ReactTable from '../generic/SelectableReactTable';
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

  render() {
    return (
      <div className="api_keys_table table">
        <div className="table_title_wrapper clearfix">
          <div className="table_title">API keys</div>
          <SegmentedControl segments={['MINE', 'OTHER']}/>
        </div>
        {this.renderContent()}
      </div>
    );
  }

  renderContent() {
    const { apiKeys, onKeyDeleteClick } = this.props;
    const columns = [
      {
        Header: "Key name",
        filterable: true,
        Filter: SearchFilter,
        accessor: 'name',
        className: 'table_col_value'
      }, {
        Header: 'Exchange',
        accessor: 'exchange',
        className: 'table_col_value',
      }, {
        Header: 'Balance, BTC',
        accessor: 'balance'
      }, {
        Header: '',
        Cell: row => (<button onClick={() => this.props.onKeyDeleteClick(row.original)}>Delete</button>)
      }
    ];
    return (
      <ReactTable
        style={{height: '300px'}}
        columns={columns}
        data={apiKeys}
        selectedItem={this.props.selectedApiKey}
        onItemSelected={key => this.props.onKeySelected(key)}
      />
    );
    if(apiKeys.length === 0) {
      return (<div>You have no keys yet</div>);
    } else {
      const selectedTab = this.state.selectedTab;
      const keys = selectedTab ? this.state.sharedKeys : this.state.ownedKeys;
      return (
        <ul>
          {keys.map(apiKey => (
            <ApiKey key={apiKey._id} apiKey={apiKey}
              owned={this.props.userId === apiKey.owner}
              onKeySelected={this.props.onKeySelected}
              onKeyDeleteClick={onKeyDeleteClick}
              selected={apiKey === this.props.selectedApiKey}/>
          ))}
        </ul>
      );

    }
  }
}

ApiKeys.propTypes = {
  onKeySelected: PropTypes.func.isRequired,
  onKeyDeleteClick: PropTypes.func.isRequired,
  apiKeys: PropTypes.array.isRequired,
  selectedKey: PropTypes.object
};

class ApiKey extends React.Component {
  constructor(props) {
    super(props);
    this.state = {pairsOpened: false};
    this.onKeyDeleteClick = this.onKeyDeleteClick.bind(this);
  }

  onPairsClicked() {
    this.setState(prev => {
      return {pairsOpened: !prev.pairsOpened};
    });
  }
  render() {
    const apiKey = this.props.apiKey;
    return (
      <li style={this.props.selected ? {backgroundColor: 'aqua'} : {}} onClick={() => this.props.onKeySelected(apiKey)}>
        <span>{apiKey.name} </span>
        <span>{apiKey.keyValue} </span>
        <span>{apiKey.exchange} </span>
        <span>{apiKey.inUse ? 'in use' : 'free'} </span>
        <br/>
        {this.props.owned ? <button onClick={this.onKeyDeleteClick}>Delete</button> : null}

      </li>
    );
  }

  onKeyDeleteClick(event) {
    event.stopPropagation();
    this.props.onKeyDeleteClick(this.props.apiKey);
  }

}

class SearchTableColumn extends React.Component {
  render() {
    return (
      <div>
        <div>{this.props.Header}</div>
        <div>
          <input className="add_keys_field" placeholder="Search" />
        </div>
      </div>
    );
  }
}
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


export default ApiKeys;
