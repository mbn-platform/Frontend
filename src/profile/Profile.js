import React from 'react';
import ProfileInfo from './ProfileInfo';
import TablesScreen from './TablesScreen';
import { Row, Container } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchDashboardData } from '../actions/dashboard';
import { updateExchanges } from '../actions/exchanges';
import { updateProfile, getProfile } from '../actions/profile';

class Profile extends React.Component {

  constructor(props) {
    super(props);
    const name = this.props.match.params.id;
    if(name !== this.props.profile.name) {
      this.state = {profile: {}};
    } else {
      this.state = {profile: this.props.profile};
    }
    this.onSaveChangesClick = this.onSaveChangesClick.bind(this);
    this.onCurrencyToggle = this.onCurrencyToggle.bind(this);
    this.onToggleClick = this.onToggleClick.bind(this);
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

  onToggleClick(availableForOffers) {
    const { name, minAmount, minAmountCurrency, fee, maxLoss, duration, roi, currencies } = this.state.profile;
    const profile = {
      minAmount, fee, maxLoss, duration, currencies, roi,
      availableForOffers, name, minAmountCurrency,
    };
    this.props.updateProfile(profile);
  }

  onSaveChangesClick(update) {
    const {
      availableForOffers, currencies,
      minAmount, minAmountCurrency,
      fee, maxLoss, duration, name, roi,
    } = this.state.profile;
    const profile = {
      availableForOffers, currencies, minAmount,
      minAmountCurrency, fee, maxLoss, name,
      roi,
      duration, ...update
    };
    this.props.updateProfile(profile);
  }

  componentDidMount() {
    const name = this.props.match.params.id;
    this.props.getProfile(name);
    this.props.fetchDashboardData();
    this.props.updateExchanges();
  }

  componentWillReceiveProps(nextProps) {
    const name = nextProps.match.params.id;
    if(nextProps.profile !== this.props.profile) {
      this.setState({profile: nextProps.profile});
    }
    if(this.props.match.params.id !== name) {
      this.setState({profile: {}});
      this.props.getProfile(name);
    }
  }

  render() {
    const {loggedIn, profile} = this.props.auth;
    let own = false;
    if(loggedIn && profile && profile.name === this.props.match.params.id) {
      own = true;
    }
    return (
      <Container fluid className='profile-item'>
        <Row>
          <ProfileInfo
            rates={this.props.rates}
            own={own}
            profile={this.state.profile}
            onSaveChangesClick={this.onSaveChangesClick}
            onToggleClick={this.onToggleClick}
          />
          <TablesScreen
            rates={this.props.rates}
            own={own}
            profile={this.state.profile}
            onCurrencyToggle={this.onCurrencyToggle}
            currencies={this.state.currencies}
          />
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  rates: state.rates,
  profile: state.profile,
});

const mapDispatchToProps = dispatch => ({
  updateProfile: profile => dispatch(updateProfile(profile)),
  fetchDashboardData: () => dispatch(fetchDashboardData()),
  updateExchanges: () => dispatch(updateExchanges()),
  getProfile: name => dispatch(getProfile(name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
