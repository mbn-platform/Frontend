import React from 'react';
import ProfileInfo from './ProfileInfo';
import TablesScreen from './TablesScreen';
import { Row, Container } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchDashboardData } from '../actions/dashboard';
import { updateExchagnes } from '../actions/exchanges';
import { updateProfile } from '../actions/profile';
import { generateProfile } from '../demoData/profile';

class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.onSaveChangesClick = this.onSaveChangesClick.bind(this);
    this.onCurrencyToggle = this.onCurrencyToggle.bind(this);
  }

  onCurrencyToggle(update) {
    const {
      availableForOffers, currencies,
      minAmount, minAmountCurrency,
      fee, maxLoss, duration, name
    } = this.props.profile;
    const updatedCurrencies = currencies.map(c => c.name === update.name ? update : {name: c.name, preferred: c.preferred});
    const profile = {
      availableForOffers, currencies: updatedCurrencies, minAmount,
      minAmountCurrency, fee, maxLoss, name,
      duration
    };
    this.props.updateProfile(profile);
  }

  onSaveChangesClick(update) {
    const {
      availableForOffers, currencies,
      minAmount, minAmountCurrency,
      fee, maxLoss, duration, name
    } = this.props.profile;
    const profile = {
      availableForOffers, currencies, minAmount,
      minAmountCurrency, fee, maxLoss, name,
      duration, ...update
    };
    this.props.updateProfile(profile);
  }

  componentDidMount() {
    const name = this.props.match.params.id;
    this.updateProfile(name);
    this.props.fetchDashboardData();
    this.props.updateExchanges();
  }

  updateProfile(name) {
    if(name === this.props.profile.name) {
      this.setState(this.props.profile);
    } else {
      this.setState(generateProfile(name));
    }
  }

  componentWillReceiveProps(nextProps) {
    const name = nextProps.match.params.id;
    if(name === nextProps.profile.name) {
      this.setState(nextProps.profile);
    } else if(name === this.state.name) {
      return;
    } else {
      this.setState(generateProfile(name));
    }
  }

  render() {
    const own = this.props.profile._id && this.state._id && this.props.profile._id === this.state._id;
    console.log(own);
    return (
      <Container fluid className='profile-item'>
        <Row>
          <ProfileInfo own={own} {...this.state}
            onSaveChangesClick={this.onSaveChangesClick}
          />
          <TablesScreen
            trades={this.props.profile.trades || []}
            profile={this.state}
            onCurrencyToggle={this.onCurrencyToggle}
            currencies={this.state.currencies}
          />
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.auth.profile,
});

const mapDispatchToProps = dispatch => ({
  updateProfile: profile => dispatch(updateProfile(profile)),
  fetchDashboardData: () => dispatch(fetchDashboardData()),
  updateExchanges: () => dispatch(updateExchagnes()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
