import React from 'react';
import PropTypes from 'prop-types';
import SegmentedControl from '../generic/SegmentedControl';
import ReactTable from '../generic/SelectableReactTable';
import ExchangeSelect from './ExchangeSelect';
import SearchHeader from '../generic/SearchHeader';
import classNames from 'classnames';
import { Desktop, Mobile } from '../generic/MediaQuery';
import { calculateKeyBalance } from '../generic/util';
import Pagination from '../generic/Pagination';

const TAB_OWN_KEYS = 0;
const TAB_RECEIVED_KEYS = 1;

class Funds extends React.Component {

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
    const value = e ? e : 'All';
    this.setState((state) => {
      const filtered = state.filtered.map(i => i.id === 'exchange' ? {id: 'exchange', value} : i);
      return {filtered};
    });
  }

  componentWillReceiveProps(nextProps) {
    if(!nextProps.selectedApiKey) {
      return;
    }
    if(this.props.selectedApiKey && this.props.selectedApiKey._id === nextProps.selectedApiKey._id) {
      return;
    }
    const isOwnKey = nextProps.selectedApiKey.owner === nextProps.userId;
    if(isOwnKey) {
      this.setState({selectedTab: TAB_OWN_KEYS});
    } else {
      this.setState({selectedTab: TAB_RECEIVED_KEYS});
    }
  }

  onTabChange(index) {
    this.setState({selectedTab: index});
  }

  render() {
    return (
      <div className="api_keys_table table">
        <div className="table_title_wrapper clearfix">
          <div className="table_title">Funds</div>
        </div>
        {this.renderContent()}
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
        Cell: row => (<div className="key_name_text_td">{row.value || (row.original.from._id === this.props.userId ? `Trusted to ${row.original.to.name}` : `${row.original.from.name} trusted to me`)}</div>),
        minWidth: 100,
        accessor: 'name'
      }, {
        Header: ExchangeHeader(this.props.exchanges, exchangeFilter, this.onExchangeChange),
        accessor: 'exchange',
        minWidth: 100,
        headerClassName: 'filter_align_center',
        className: 'table_col_value upper',
        filterMethod: (filter, row) => {
          if(filter.value === 'All') {
            return true;
          } else {
            return filter.value = row.exchange;
          }
        }
      }, {
        id: 'balance',
        className: 'table_col_value',
        minWidth: 80,
        Header: (<div className="table_header_wrapper">
          <span className="table_header">Balance,<br/>BTC</span>
          <div className="sort_icon_wrapper position_down_icon_wrapper">
            <div className="green_arrow green_arrow_bottom" ></div>
          </div>
        </div>),
        accessor: key => {
          const balance = calculateKeyBalance(key, 'BTC', this.props.rates);
          if(balance === null) {
            return null;
          } else {
            return balance.toFixed(8);
          }
        }
      }, {
        Header: '',
        minWidth: 24,
        className: 'table_col_delete',
        Cell: row => {
          const canDeleteKey = true
          const onClick = canDeleteKey ? e => {
            e.stopPropagation();
            if (window.confirm('You want to delete this key?')) {
              this.props.onKeyDeleteClick(row.original);
            }
          } : null;
          const className = classNames('delete_key_button', {can_delete_key: canDeleteKey});
          return (<div className={className} onClick={onClick}></div>);
        },

      }
    ];
  }
  renderContent() {
    const { funds } = this.props;
    const data = funds;
    return (
      <div>
        <Desktop>
          <ReactTable
            style={{height: 312}}
            columns={this.getColumns()}
            data={data}
            filtered={this.state.filtered}
            selectedItem={this.props.selectedApiKey}
            onItemSelected={key => this.props.onKeySelected(key)}
            scrollBarHeight={217}
          />
        </Desktop>
        <Mobile>
          <ReactTable
            columns={this.getColumns()}
            data={data}
            filtered={this.state.filtered}
            selectedItem={this.props.selectedApiKey}
            onItemSelected={key => this.props.onKeySelected(key)}
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

Funds.propTypes = {
  userId: PropTypes.string.isRequired,
  onKeySelected: PropTypes.func.isRequired,
  onKeyDeleteClick: PropTypes.func.isRequired,
  funds: PropTypes.array.isRequired,
  selectedKey: PropTypes.object
};

export default Funds;
