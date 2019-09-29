import { connect } from 'react-redux';

import { fetchTariffs } from '../../actions/tariffs';
import Tariffs from './Tariffs';

const mapStateToProps = ({ auth, tariffs }) => ({
  auth,
  tariffs,
});

const mapDispatchToProps = {
  fetchTariffs,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tariffs);
