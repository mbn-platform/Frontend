import { connect } from 'react-redux';

import Tariffs from './Tariffs';

const mapStateToProps = ({ auth }) => console.log('auth', auth) || ({
  auth,
});

export default connect(mapStateToProps)(Tariffs);
