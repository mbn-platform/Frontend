import { connect } from 'react-redux';

import { fetchTariffs, createPaymentRequest } from '../../actions/tariffs';
import Tariffs from './Tariffs';

const mapStateToProps = ({ auth, tariffs }) => {
  let billing;
  const loggedIn = auth.loggedIn;

  if (loggedIn) {
    billing = auth.profile.billing;
  }

  return {
    loggedIn,
    billing,
    tariffs,
  };
};

const mapDispatchToProps = {
  fetchTariffs,
  createPaymentRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tariffs);
