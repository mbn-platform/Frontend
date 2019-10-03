import { connect } from 'react-redux';

import { fetchTariffs, paymentRequest } from '../../actions/tariffs';
import Tariffs from './Tariffs';

const mapStateToProps = ({ auth, tariffs }) => ({
  auth,
  tariffs,
});

const mapDispatchToProps = {
  fetchTariffs,
  paymentRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tariffs);
