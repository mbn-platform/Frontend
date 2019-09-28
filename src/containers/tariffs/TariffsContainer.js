import { connect } from 'react-redux';

import { fetchTariffs, getTariffById, paymentRequest } from '../../actions/tariffs';
import Tariffs from './Tariffs';

const mapStateToProps = ({ auth, tariffs }) => ({
  auth,
  tariffs,
});

const mapDispatchToProps = {
  fetchTariffs,
  paymentRequest,
  getTariffById,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tariffs);
