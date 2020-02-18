import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { compose } from 'ramda';

import { deleteApiKey } from 'actions/apiKeys';
import { acceptOffer, cancelOffer, rejectOffer, payOffer } from 'actions/offers';
import { updateExchanges } from 'actions/exchanges';
import { getExchangeRates } from 'actions/terminal';
import { showInfoModal } from 'actions/modal';
import Dashboard from './Dashboard';
import { profileNameSelector } from 'selectors/auth';
import { apiKeysSelector } from 'selectors/apiKeys';
import { offersSelector } from 'selectors/offers';
import { contractsSelector } from 'selectors/contracts';

const mapStateToProps = state => ({
  userName: profileNameSelector(state),
  apiKeys: apiKeysSelector(state),
  offers: offersSelector(state),
  contracts: contractsSelector(state),
});

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
    getExchangeRates: exchange => dispatch(getExchangeRates(exchange)),
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl,
)(Dashboard);
