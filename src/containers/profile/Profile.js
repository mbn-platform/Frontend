import React from 'react';
import { Row, Container } from 'reactstrap';
import { prop } from 'ramda';

import TablesScreen from './TablesScreen';
import ProfileInfo from './ProfileInfo';

class Profile extends React.Component {
  state = {
    profile: {
      contractSettings: {},
    },
  };

  static getDerivedStateFromProps(props, state) {
    if (props.profile !== state.profile && props.name === props.profile.name) {
      return { profile: props.profile };
    } else {
      return null;
    }
  }

  onCurrencyToggle = (update) => {
    const {
      availableForOffers, currencies,
      minAmount, minAmountCurrency,
      fee, maxLoss, duration, name,
    } = this.props.profile;
    const updatedCurrencies = currencies.map(c => c.name === update.name ? update : {name: c.name, preferred: c.preferred});
    const profile = {
      availableForOffers, currencies: updatedCurrencies, minAmount,
      minAmountCurrency, fee, maxLoss, name,
      duration,
    };
    this.props.updateProfile(profile);
  }

  onToggleClick = (availableForOffers) => {
    this.props.toggleAvailable(this.state.profile.name, { available: availableForOffers });
  }

  onSaveChangesClick = (update) => {
    const contractSettings = {
      ...this.state.profile.contractSettings,
      ...update,
    };
    this.props.updateContractSettings(this.state.profile.name, contractSettings);
  }

  componentDidMount() {
    const { name } = this.props;

    this.props.getProfilePageInfo(name);
    this.props.getExchangeRates('binance');
    this.props.updateExchanges();
  }

  render() {
    const { loggedIn, profile } = this.props.auth;

    const rates = this.props.exchangesInfo.binance ? this.props.exchangesInfo.binance.rates : [];
    const own = loggedIn && prop('name', profile) === this.props.name;

    return (
      <Container fluid className='profile-item'>
        <Row>
          <ProfileInfo
            own={own}
            profile={this.state.profile}
            auth={this.props.auth}
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

