import Dashboard from './Dashboard';
import { connect } from 'react-redux';
import { deleteApiKey } from '../../actions/apiKeys';
import { acceptOffer, cancelOffer, rejectOffer, payOffer } from '../../actions/offers';
import { updateExchanges } from '../../actions/exchanges';
import { rateContract } from '../../actions/contracts';
import { getAllRates } from '../../actions/terminal';
import { injectIntl } from 'react-intl';

const mapStateToProps = state => ({
  time: state.time,
  apiKeys: state.apiKeys,
  offers: state.offers,
  contracts: state.contracts,
  userId: state.auth.profile._id,
  userName: state.auth.profile.name,
  billing: state.auth.profile.billing,
  exchanges: state.exchanges,
  exchangesInfo: state.exchangesInfo,
  rates: state.rates,
});

const mapDispatchToProps = {
  onKeyDeleteClick: deleteApiKey,
  updateExchanges,
  getAllRates,
  onOfferPay: payOffer,
  onOfferAccepted: acceptOffer,
  onOfferRejected: rejectOffer,
  onOfferCanceled: cancelOffer,
  onContractRate: rateContract,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
