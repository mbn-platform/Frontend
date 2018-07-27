import React from 'react';
import ProfileInfo from './ProfileInfo';
import TablesScreen from './TablesScreen';
import { Row, Container } from 'reactstrap';

class Profile extends React.Component {

  state = {
    profile: {
      contractSettings: {},
    },
  };

  constructor(props) {
    super(props);
    this.onSaveChangesClick = this.onSaveChangesClick.bind(this);
    this.onCurrencyToggle = this.onCurrencyToggle.bind(this);
    this.onToggleClick = this.onToggleClick.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if(props.profile !== state.profile && props.name === props.profile.name) {
      return {profile: props.profile};
    } else {
      return null;
    }
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
    this.props.toggleAvailable(this.state.profile.name, {available: availableForOffers});
  }

  onSaveChangesClick(update) {
    const contractSettings = {
      ...this.state.profile.contractSettings,
      ...update
    };
    this.props.updateContractSettings(this.state.profile.name, contractSettings);
  }

  componentDidMount() {
    const name = this.props.name;
    this.props.getProfilePageInfo(name);
    this.props.getExchangeRates('binance');
    this.props.updateExchanges();
  }

  render() {
    const {loggedIn, profile} = this.props.auth;
    const rates = this.props.exchangesInfo.binance ? this.props.exchangesInfo.binance.rates : [];
    let own = false;
    if(loggedIn && profile && profile.name === this.props.name) {
      own = true;
    }
    return (
      <Container fluid className='profile-item'>
        <Row>
          <ProfileInfo
            own={own}
            profile={this.state.profile}
            onSaveChangesClick={this.onSaveChangesClick}
            onToggleClick={this.onToggleClick}
          />
          <TablesScreen
            rates={rates}
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

export default Profile;


