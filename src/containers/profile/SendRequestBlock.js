import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import qs from 'qs';
import { FormattedMessage, injectIntl } from 'react-intl';
import get from 'lodash/get';

import { sendOffer } from '../../actions/offers';
import { showInfoModal } from '../../actions/modal';
import { clearRequest } from '../../actions/request';
import { getExchangeCurrencies } from '../../actions/exchanges';
import { Desktop, Mobile } from '../../generic/MediaQuery';
import SearchHeader from '../../components/SearchHeader';
import Pagination from '../../components/Pagination';
import ReactTable from '../../components/SelectableReactTable';
import { StatusHeader, StatusCell } from '../../components/StatusComponents';
import ContractDetails from './ContractDetails';
import SelectFund from './SelectFund';
import ContractSent from './ContractSent';
import StepTitle from './StepTitle';
import { EditAmountEntry } from './ContractSettings';

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
    const step = get(props, 'location.state.step', SEND_REQUEST_BLOCK_DETAILS);
    this.state = {
      visibleBlock: Number(step),
      selectedFund: null,
      contractAmount: '',
      filtered: [{id: 'currency', value: ''},],
      changed: false,
      changedCurrencies: {},
      allSelected: false,
      currencies: [],
    };
    this.onFundSelected = async (fund) => {
      const exchangeInfo = this.props.exchangesInfo[fund.exchange];
      if(!exchangeInfo || !exchangeInfo.currencies) {
        await this.props.getExchangeCurrencies(fund.exchange);
      }
      this.setState({selectedFund: fund});
    };
    this.onSendOfferClick = this.onSendOfferClick.bind(this);
    this.onCurrencyChange = this.onCurrencyChange.bind(this);
    this.onCurrencyStateClicked = this.onCurrencyStateClicked.bind(this);
    this.onSelectAllClicked = this.onSelectAllClicked.bind(this);

  }

  async onSendOfferClick() {
    if(!this.state.selectedFund) {
      this.props.showInfoModalWindow('profile.selectKeyFirst');
      return;
    }
    const keyId = this.state.selectedFund._id;
    let allowedCurrencies = ['USDT','ETH','BTC'];
    let selectedCurrencies = this.state.changedCurrencies;
    for (let currency in selectedCurrencies) {
      allowedCurrencies.push(currency);
    }
    const offer = {
      keyId,
      to: this.props.profile._id,
      contractSettings: {
        sum: parseFloat(this.state.contractAmount),
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
    if(currency === 'USDT' || currency === 'BTC' || currency === 'ETH') {;
      this.props.showModalWindow('profile.shouldByAlwaysAvailable');
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
    const flag = !this.state.allSelected;
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
        Header: SearchHeader(this.props.intl.messages['profile.currency'], currencyFilter, this.onCurrencyChange),
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

  onOfferSendClick = () => {
    !this.props.auth.loggedIn
      ? this.onLogIn()
      : this.setState({ visibleBlock: SEND_REQUEST_BLOCK_SELECT_API });
  }

  onLogIn = () => {
    const { location: { pathname }, history } = this.props;
    history.push('/login?' + qs.stringify({
      redirectTo: pathname,
      step: SEND_REQUEST_BLOCK_SELECT_API,
    }));
  };

  render() {
    const { profile } = this.props;
    const { contractSettings } = profile;
    const { visibleBlock } = this.state;

    return (
      <React.Fragment>
        {(() => {
          switch(visibleBlock) {
            case SEND_REQUEST_BLOCK_DETAILS: {
              return (
                <ContractDetails
                  onOfferSendClick={this.onOfferSendClick}
                  availableForOffers={profile.available}
                  duration={contractSettings.duration}
                  amount={contractSettings.minAmount}
                  currency={contractSettings.currency}
                  maxLoss={contractSettings.maxLoss}
                  fee={contractSettings.fee}
                  roi={contractSettings.roi}
                  auth={this.props.auth}
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
                  onNextClick={() => this.setState({visibleBlock:SEND_REQUEST_BLOCK_ENTER_AMOUNT, contractAmount: contractSettings.minAmount})}
                  onFundSelected={this.onFundSelected}
                />
              );
            }
            case SEND_REQUEST_BLOCK_ENTER_AMOUNT: {
              const currentKeyBalance = this.state.selectedFund.balances.find(balance => balance.name === this.props.profile.contractSettings.currency);
              return (
                <div className="row-fluid choose-api-block">
                  <div className="row justify-content-center choose-title">
                    <div className="col-auto text-center align-middle choose-setting-title title-text">
                      <FormattedMessage
                        id="profile.enterContractAmount"
                        defaultMessage="ENTER CONTRACT AMOUNT"
                      />
                    </div>
                    <div className="col-md-12 col-lg-12 col-xl-12 separate-second-block">
                      <div className="separate-line d-none d-md-block"/>
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
                        <FormattedMessage
                          id="profile.back"
                          defaultMessage="BACK"
                        />
                      </button>
                      <button disabled={
                        this.state.contractAmount !== ''
                        && (parseFloat(this.state.contractAmount) < parseFloat(this.props.profile.contractSettings.minAmount)
                        || parseFloat(this.state.contractAmount) > parseFloat(currentKeyBalance ? currentKeyBalance.available : '0'))
                      } onClick={() => {
                        if (this.state.contractAmount === '') {
                          this.setState({contractAmount: this.props.profile.contractSettings.minAmount});
                        }
                        this.setState({visibleBlock:SEND_REQUEST_BLOCK_SELECT_CURRENCIES});
                      }} type="button" className="send-request-btn btn btn-secondary active">
                        <FormattedMessage
                          id="profile.next"
                          defaultMessage="NEXT"
                        />
                      </button>
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
                      <FormattedMessage
                        id="profile.selectTradingCurrencies"
                        defaultMessage="SELECT TRADING CURRENCIES"
                      />
                    </div>
                    <div className="col-md-12 col-lg-12 col-xl-12 separate-second-block">
                      <div className="separate-line d-none d-md-block"/>
                    </div>
                    {this.renderCurrencyTable(currencies)}
                    <div className="col-12 d-flex align-items-center justify-content-between choose-btn-group">
                      <button onClick={() => this.setState({visibleBlock:SEND_REQUEST_BLOCK_ENTER_AMOUNT})} type="button" className="cancel-btn btn btn-secondary">
                        <FormattedMessage
                          id="profile.back"
                          defaultMessage="BACK"
                        />
                      </button>
                      <button onClick={() => this.onSendOfferClick()} type="button" className="send-request-btn btn btn-secondary active">
                        <FormattedMessage
                          id="profile.send"
                          defaultMessage="SEND"
                        />
                      </button>
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
        })()}
        {visibleBlock >= SEND_REQUEST_BLOCK_SELECT_API && (
          <StepTitle
            step={visibleBlock}
            count={REDIRECT_TO_DASHBOARD}
          />
        )}
      </React.Fragment>
    );
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
  auth: state.auth,
  exchangesInfo: state.exchangesInfo
});

const mapDispatchToProps = {
  showModalWindow: showInfoModal,
  onGotItClick: clearRequest('sendOffer'),
  getExchangeCurrencies,
  sendOffer,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl,
  withRouter,
)(SendRequestBlock);

