import Dashboard from './Dashboard';
import { connect } from 'react-redux';
import { deleteApiKey, updateApiKey } from '../actions/apiKeys';
import { acceptOffer, cancelOffer, rejectOffer } from '../actions/offers';
import { fetchDashboardData } from '../actions/dashboard';

const mapStateToProps = state => {
  return {
    apiKeys: state.apiKeys,
    offers: state.offers,
    contracts: state.contracts,
    userId: state.auth.userId
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
    onDashboardMounted: () => dispatch(fetchDashboardData()),
    onOfferAccepted: offer => dispatch(cancelOffer(offer)),
    onOfferRejected: offer => dispatch(rejectOffer(offer)),
    onOfferCanceled: offer => dispatch(acceptOffer(offer))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
