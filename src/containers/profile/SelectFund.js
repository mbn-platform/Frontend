import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import isEmpty from 'lodash/isEmpty';

import ReactTable from '../../components/SelectableReactTable';
import SearchHeader from '../../components/SearchHeader';
import { Desktop, Mobile } from '../../generic/MediaQuery';
import Pagination from '../../components/Pagination';
import ExchangeSelect from '../../components/ExchangeSelect';
import ApiKeysEmpty from './ApiKeysEmpty';

class SelectFund extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filtered: [{id: 'name', value: ''}, {id: 'exchange', value: 'All'}]
    };
    this.onFilter = this.onFilter.bind(this);
    this.onExchangeChange = this.onExchangeChange.bind(this);
  }

  onExchangeChange(e) {
    const value = e ? e : 'All';
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
    const { apiKeys } = this.props;
    return (
      <div className="row-fluid choose-api-block">
        <div className="row justify-content-center choose-title">
          <div className="col-auto text-center align-middle choose-setting-title title-text">
            <FormattedMessage
              id="profile.chooseFunds"
              defaultMessage="choose funds"
            />
          </div>
          <div className="col-md-12 col-lg-12 col-xl-12 separate-second-block">
            <div className="separate-line d-none d-md-block"/>
          </div>
          {!isEmpty(apiKeys) ? (
            <React.Fragment>
              {this.renderTable()}
              <div className="col-12 d-flex align-items-center justify-content-between choose-btn-group">
                <button onClick={this.props.onCancelClick} type="button" className="cancel-btn btn btn-secondary">
                  <FormattedMessage
                    id="profile.cancel"
                    defaultMessage="CANCEL"
                  />
                </button>
                <button onClick={this.props.onNextClick} type="button" disabled={!this.props.selectedFund} className="send-request-btn btn btn-secondary active">
                  <FormattedMessage
                    id="profile.next"
                    defaultMessage="NEXT"
                  />
                </button>
              </div>
            </React.Fragment>
          ) : (
            <ApiKeysEmpty />
          )}
        </div>
      </div>
    );
  }

  getColumns() {
    const nameFilter = this.state.filtered.find(f => f.id === 'name').value;
    const exchangeFilter = this.state.filtered.find(f => f.id === 'exchange').value;
    return [
      {
        Header: SearchHeader(this.props.intl.messages['profile.fundName'], nameFilter, this.onFilter),
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
            return filter.value === row.exchange;
          }
        }
      }, {
        id: '_id',
        className: 'table_col_value',
        Header: (<div className="table_header_wrapper">
          <span className="table_header">
            <FormattedMessage
              id="profile.balance"
              defaultMessage="Balance"
            />
          </span>
          <div className="sort_icon_wrapper">
            <div className="green_arrow green_arrow_bottom"/>
          </div>
        </div>),
        accessor: key => {
          const balance = key.balances.find(balance => balance.name === this.props.currency);
          return balance ? balance.available + ' ' + this.props.currency : '–';
        }
      }
    ];
  }

  renderTable = () => {
    const { apiKeys } = this.props;
    return (
      <div style={{width: '100%'}}>
        <Desktop>
          <ReactTable
            style={{height: 245, width: '100%'}}
            columns={this.getColumns()}
            data={apiKeys}
            filtered={this.state.filtered}
            selectedItem={this.props.selectedFund}
            onItemSelected={fund => this.props.onFundSelected(fund)}
            scrollBarHeight={150}
          />
        </Desktop>
        <Mobile>
          <ReactTable
            columns={this.getColumns()}
            data={apiKeys}
            filtered={this.state.filtered}
            selectedItem={this.props.selectedFund}
            onItemSelected={fund => this.props.onFundSelected(fund)}
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
      <span className="table_header">
        <FormattedMessage
          id="profile.exchange"
          defaultMessage="Exchange"
        />
      </span>
      <div className="sort_icon_wrapper">
        <div className="green_arrow green_arrow_bottom" />
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
SelectFund.propTypes = {
  onFundSelected: PropTypes.func.isRequired,
  onCancelClick: PropTypes.func.isRequired,
  onNextClick: PropTypes.func.isRequired,
  exchanges: PropTypes.array.isRequired,
  apiKeys: PropTypes.array.isRequired,
  selectedFund: PropTypes.object
};

export default injectIntl(SelectFund);
