import Dashboard from './Dashboard';
import { connect } from 'react-redux';
import { deleteApiKey } from '../../actions/apiKeys';
import { acceptOffer, cancelOffer, rejectOffer, payOffer } from '../../actions/offers';
import { updateExchanges } from '../../actions/exchanges';
import { rateContract } from '../../actions/contracts';
import { getExchangeRates } from '../../actions/terminal';
import { showInfoModal } from '../../actions/modal';
import { injectIntl } from 'react-intl';

const mapStateToProps = state => {
  return {
    time: state.time,
    apiKeys: state.apiKeys,
    offers: state.offers,
    contracts: state.contracts,
    userId: state.auth.profile._id,
    userName: state.auth.profile.name,
    exchanges: state.exchanges,
    exchangesInfo: state.exchangesInfo,
    rates: state.rates,
  };
};


const mapDispatchToProps = dispatch => {
  return {
    onKeyDeleteClick: async (apiKey, token2FA) => {
      if(apiKey.inUse) {
        dispatch(showInfoModal(this.props.intl.messages['dashboard.cannotDeleteKey']));
      } else {
        await dispatch(deleteApiKey(apiKey, token2FA));
      }
    },
    updateExchanges: () => dispatch(updateExchanges()),
    onOfferPay: offer => dispatch(payOffer(offer)),
    onOfferAccepted: offer => dispatch(acceptOffer(offer)),
    onOfferRejected: offer => dispatch(rejectOffer(offer)),
    onOfferCanceled: offer => dispatch(cancelOffer(offer)),
    onContractRate: (feedback, userName, time) => dispatch(rateContract(feedback, userName, time)),
    getExchangeRates: exchange => dispatch(getExchangeRates(exchange)),
  };
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
