import { connect } from 'react-redux';

import { fetchTariffs, paymentRequest } from '../../actions/tariffs';
import Tariffs from './Tariffs';

const mapStateToProps = ({ auth, tariffs }) => {
  let tariff = 'not_logged_in';
  const loggedIn = auth.loggedIn;

  if (loggedIn) {
    tariff = auth.profile.billing.tariff;
  }

  return {
    loggedIn,
    tariff,
    tariffs,
  };
};

const mapDispatchToProps = {
  fetchTariffs,
  paymentRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tariffs);
