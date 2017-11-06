import Dashboard from './Dashboard';
import { connect } from 'react-redux';
import { deleteApiKey, updateApiKey } from '../actions/apiKeys';
import { acceptOffer, cancelOffer, rejectOffer, payOffer } from '../actions/offers';
import { fetchDashboardData } from '../actions/dashboard';
import { updateExchagnes } from '../actions/exchanges';

const mapStateToProps = state => {
  return {
    time: state.time,
    apiKeys: state.apiKeys,
    offers: state.offers,
    contracts: state.contracts,
    userId: state.auth.profile._id,
    exchanges: state.exchanges
  };
};


const mapDispatchToProps = dispatch => {
  return {
    onKeyDeleteClick: apiKey => {
      if(apiKey.inUse) {
        alert('cannot delete key - key is in use');
      } else {
        dispatch(deleteApiKey(apiKey));
      }
    },
    onKeyUpdateClick: apiKey => dispatch(updateApiKey(apiKey)),
    onDashboardMounted: () => {
      dispatch(fetchDashboardData());
      dispatch(updateExchagnes());
    },
    onOfferPay: offer => dispatch(payOffer(offer)),
    onOfferAccepted: offer => dispatch(acceptOffer(offer)),
    onOfferRejected: offer => dispatch(rejectOffer(offer)),
    onOfferCanceled: offer => dispatch(cancelOffer(offer))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
