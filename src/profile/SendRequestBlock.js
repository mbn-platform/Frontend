import React from 'react';
import PropTypes from 'prop-types';
import ContractDetails from './ContractDetails';
import SelectFund from './SelectFund';
import ContractSent from './ContractSent';
import { connect } from 'react-redux';
import { sendOffer } from '../actions/offers';
import { clearRequest } from '../actions/request';
import { Redirect } from 'react-router-dom';
import {EditAmountEntry} from './ContractSettings';
import SearchHeader from '../generic/SearchHeader';
import { StatusHeader, StatusCell } from '../dashboard/ApiKeyInfo';
import Pagination from '../generic/Pagination';
import ReactTable from '../generic/SelectableReactTable';
import { Desktop, Mobile } from '../generic/MediaQuery';
import {getExchangeCurrencies} from '../actions/exchanges';

const SEND_REQUEST_BLOCK_DETAILS = 0;
const SEND_REQUEST_BLOCK_SELECT_API = 1;
const SEND_REQUEST_BLOCK_ENTER_AMOUNT = 2;
const SEND_REQUEST_BLOCK_SELECT_CURRENCIES = 3;
const SEND_REQUEST_BLOCK_SENT = 4;
const REDIRECT_TO_DASHBOARD = 5;
export const REQUIRED_CURRENCIES = ['USDT', 'ETH', 'BTC'];

class SendRequestBlock extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visibleBlock: SEND_REQUEST_BLOCK_DETAILS,
      selectedFund: null,
      contractAmount: '',
      filtered: [{id: 'currency', value: ''},],
      changed: false,
      changedCurrencies: {},
      allSelected: false,
      currencies: []
    };
    this.onFundSelected = async (fund) => {
      let currenciesList = this.props.exchangesInfo[fund.exchange].currencies;
      if (!currenciesList || currenciesList.length === 0) {
        await this.props.getExchangeCurrencies(fund.exchange);
      }
      this.setState({selectedFund: fund});
    };
    this.onSendOfferClick = this.onSendOfferClick.bind(this);
    this.onCurrencyChange = this.onCurrencyChange.bind(this);
    this.onCurrencyStateClicked = this.onCurrencyStateClicked.bind(this);
    this.onSelectAllClicked = this.onSelectAllClicked.bind(this);

  }

  onSendOfferClick() {
    if(!this.state.selectedFund) {
      alert('select api key first');
      return;
    }
    console.log('offer', this.props.profile)
    const keyId = this.state.selectedFund._id;
    let allowedCurrencies = ['USDT','ETH','BTC']
    let selectedCurrencies = this.state.changedCurrencies
    for (let currency in selectedCurrencies) {
      allowedCurrencies.push(currency);
    }
    const offer = {
      keyId,
      to: this.props.profile._id,
      contractSettings: {
        sum: this.state.contractAmount,
        currency: this.props.profile.contractSettings.currency,
        maxLoss: this.props.profile.contractSettings.maxLoss,
        fee: this.props.profile.contractSettings.fee,
        duration: this.props.profile.contractSettings.duration,
        roi: this.props.profile.contractSettings.roi,
      },
      allowedCurrencies: allowedCurrencies
    };
    this.props.sendOffer(offer);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.request.sendOffer === 'success') {
      this.setState({visibleBlock: SEND_REQUEST_BLOCK_SENT});
    } else if(this.state.visibleBlock === SEND_REQUEST_BLOCK_SENT) {
      this.setState({visibleBlock: REDIRECT_TO_DASHBOARD});
    }
  }

  onCurrencyChange(e) {
    this.setState({filtered: [{id: 'currency', value: e.target.value}]});
  }

  canChangeCurrency(currency) {
    if(currency === 'USDT' || currency === 'BTC' || currency === 'ETH') {
      return false;
    } else {
      return true;
    }
  }

  onCurrencyStateClicked(e) {
    e.stopPropagation();
    const currency = e.target.dataset.currency;
    if(currency === 'USDT' || currency === 'BTC' || currency === 'ETH') {
      alert('BTC/ETH/USDT should be always available for trading');
      return;
    }
    if(!this.canChangeCurrency(currency)) {
      return;
    } else {
      const changedCurrencies = this.state.changedCurrencies;
      if(changedCurrencies[currency]) {
        delete changedCurrencies[currency];
      } else {
        changedCurrencies[currency] = true;
      }
      if(Object.keys(changedCurrencies).length) {
        this.setState({
          changed: true,
          changedCurrencies,
          allSelected: false
        });
      } else {
        this.setState({
          changed: false,
          changedCurrencies,
          allSelected: false
        });
      }
    }
  }

  onSelectAllClicked(e) {
    e.stopPropagation();
    const currencies = this.props.exchangesInfo[this.state.selectedFund.exchange] ? this.props.exchangesInfo[this.state.selectedFund.exchange].currencies : [];
    const change = {};
    const flag = !this.state.allSelected
    currencies.forEach((currency)=>{
      if (!REQUIRED_CURRENCIES.includes(currency)) {
        change[currency] = flag;
      }
    });
    this.setState({
      changed: Object.keys(change).length > 0,
      changedCurrencies: change,
      allSelected: !this.state.allSelected
    });

  }

  getCurrencyTableColumns() {
    const currencyFilter = this.state.filtered.find(f => f.id === 'currency').value;
    return [
      {
        Header: SearchHeader('Currency', currencyFilter, this.onCurrencyChange),
        id: 'currency',
        accessor: 'name',
        headerClassName: 'filter_align_center',
        className: 'table_col_value'
      }, {
        id: 'selected',
        Header: StatusHeader(this.onSelectAllClicked, this.state.allSelected),
        Cell: StatusCell(this.onCurrencyStateClicked, this.state.changedCurrencies),
        accessor: 'enabled',
        headerClassName: 'selected_header',
        filterMethod: (filter, row) => {
          if(filter.value === 'all') {
            return true;
          } else {
            return filter.value === row.enabled;
          }
        }
      }
    ];
  }
  renderCurrencyTable(currencies) {
    let data = [];
    currencies.forEach(currency => {
      data.push({
        name: currency,
        enabled: REQUIRED_CURRENCIES.includes(currency)
      });
    });
    const scrollBarHeight = 217;
    return (
      <div style={{width: '100%'}}>
        <Desktop>
          <div style={{width: '90%', margin: '0 auto'}}>
            <ReactTable
              style={{height: 312, marginRight: -1}}
              data={data}
              columns={this.getCurrencyTableColumns()}
              filtered={this.state.filtered}
              onItemSelected={() => {
              }}
              scrollBarHeight={scrollBarHeight}
            />
          </div>
        </Desktop>
        <Mobile>
          <div style={{width: '100%'}}>
            <ReactTable
              data={data}
              columns={this.getCurrencyTableColumns()}
              filtered={this.state.filtered}
              onItemSelected={() => {
              }}
              minRows={5}
              showPagination={true}
              defaultPageSize={15}
              PaginationComponent={Pagination}
            />
          </div>
        </Mobile>
      </div>
    );
  }

  render() {
    const profile = this.props.profile;
    const contractSettings = profile.contractSettings;
    switch(this.state.visibleBlock) {
      case SEND_REQUEST_BLOCK_DETAILS: {
        return (
          <ContractDetails
            onOfferSendClick={() => this.setState({visibleBlock: SEND_REQUEST_BLOCK_SELECT_API})}
            availableForOffers={profile.available}
            duration={contractSettings.duration}
            amount={contractSettings.minAmount}
            currency={contractSettings.currency}
            maxLoss={contractSettings.maxLoss}
            fee={contractSettings.fee}
            roi={contractSettings.roi}
          />
        );
      }
      case SEND_REQUEST_BLOCK_SELECT_API: {
        return (
          <SelectFund
            onOfferSendClick={this.onOfferSendClick}
            exchanges={this.props.exchanges}
            apiKeys={this.props.apiKeys}
            rates={this.props.rates}
            currency={contractSettings.currency}
            selectedFund={this.state.selectedFund}
            onCancelClick={() => this.setState({visibleBlock:SEND_REQUEST_BLOCK_DETAILS})}
            onNextClick={() => this.setState({visibleBlock:SEND_REQUEST_BLOCK_ENTER_AMOUNT})}
            onFundSelected={this.onFundSelected}
          />
        );
      }
      case SEND_REQUEST_BLOCK_ENTER_AMOUNT: {
        // <button onSendOfferClick={this.onSendOfferClick}>Next</button>
        return (
          <div className="row-fluid choose-api-block">
            <div className="row justify-content-center choose-title">
              <div className="col-auto text-center align-middle choose-setting-title title-text">
                ENTER CONTRACT AMOUNT
              </div>
              <div className="col-md-12 col-lg-12 col-xl-12 separate-second-block">
                <div className="separate-line d-none d-md-block"></div>
              </div>
              <EditAmountEntry
                dimension={this.props.profile.contractSettings.currency}
                tabIndex={0}
                onChange={e => this.setState({contractAmount: e.target.value})}
                value={this.state.contractAmount}
                placeholder={this.props.profile.contractSettings.minAmount}
              />
              <div className="col-12 d-flex align-items-center justify-content-between choose-btn-group">
                <button onClick={() => this.setState({visibleBlock:SEND_REQUEST_BLOCK_SELECT_API})} type="button" className="cancel-btn btn btn-secondary">
                  BACK</button>
                <button disabled={this.state.contractAmount !== '' && parseInt(this.state.contractAmount) < parseInt(this.props.profile.contractSettings.minAmount)} onClick={() => {
                  if (this.state.contractAmount === '') {
                    this.setState({contractAmount: this.props.profile.contractSettings.minAmount});
                  }
                  this.setState({visibleBlock:SEND_REQUEST_BLOCK_SELECT_CURRENCIES});
                }} type="button" className="send-request-btn btn btn-secondary active">
                  NEXT</button>
              </div>
            </div>
          </div>
        );
      }
      case SEND_REQUEST_BLOCK_SELECT_CURRENCIES: {
        const currencies = this.props.exchangesInfo[this.state.selectedFund.exchange] && this.props.exchangesInfo[this.state.selectedFund.exchange].currencies ? this.props.exchangesInfo[this.state.selectedFund.exchange].currencies : [];
        return (
          <div className="row-fluid choose-api-block">
            <div className="row justify-content-center choose-title">
              <div className="col-auto text-center align-middle choose-setting-title title-text">
                SELECT TRADING CURRENCIES
              </div>
              <div className="col-md-12 col-lg-12 col-xl-12 separate-second-block">
                <div className="separate-line d-none d-md-block"></div>
              </div>
              {this.renderCurrencyTable(currencies)}
              <div className="col-12 d-flex align-items-center justify-content-between choose-btn-group">
                <button onClick={() => this.setState({visibleBlock:SEND_REQUEST_BLOCK_ENTER_AMOUNT})} type="button" className="cancel-btn btn btn-secondary">
                  BACK</button>
                <button onClick={() => this.onSendOfferClick()} type="button" className="send-request-btn btn btn-secondary active">
                  SEND</button>
              </div>
            </div>
          </div>
        );
      }
      case SEND_REQUEST_BLOCK_SENT: {
        return (
          <ContractSent
            onButtonClick={this.props.onGotItClick}
          />
        );
      }
      case REDIRECT_TO_DASHBOARD:
        return <Redirect to="/dashboard" />;
      default:
        return null;
    }
  }

  componentWillUnmount() {
    if(this.props.request.sendOffer === 'success') {
      this.props.onGotItClick();
    }
  }
}

SendRequestBlock.propTypes = {
  apiKeys: PropTypes.array.isRequired,
  exchanges: PropTypes.array.isRequired,
  profile: PropTypes.object,
  onOfferSendClick: PropTypes.func,
  request: PropTypes.object,
  onGotItClick: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  apiKeys: state.apiKeys.ownKeys,
  exchanges: state.exchanges,
  request: state.request,
  rates: state.rates,
  exchangesInfo: state.exchangesInfo
});

const mapDispatchToProps = dispatch => ({
  sendOffer: offer => dispatch(sendOffer(offer)),
  onGotItClick: () => dispatch(clearRequest('sendOffer')),
  getExchangeCurrencies: exchange => dispatch(getExchangeCurrencies(exchange)),
});


export default connect(mapStateToProps, mapDispatchToProps)(SendRequestBlock);
