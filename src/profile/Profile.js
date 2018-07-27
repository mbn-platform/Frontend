import React from 'react';
import ProfileInfo from './ProfileInfo';
import TablesScreen from './TablesScreen';
import { Row, Container } from 'reactstrap';
import { connect } from 'react-redux';
import { updateExchanges } from '../actions/exchanges';
import {updateContractSettings, getProfile, toggleAvailable, getFeedbacks, getTradesForUser} from '../actions/profile';
import {getExchangeRates} from '../actions/terminal';

class Profile extends React.Component {

  constructor(props) {
    super(props);
    const name = this.props.match.params.id;
    if(name !== this.props.profile.name) {
      this.state = {
        profile: {
          contractSettings: {}
        }
      };
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
    this.props.toggleAvailable(this.state.profile.name, {available: availableForOffers});
  }

  onSaveChangesClick(update) {
    const contractSettings = {
      ...this.state.profile.contractSettings,
      ...update
    };
    this.props.updateContractSettings(this.state.profile.name, contractSettings);
  }

  async getProfilePageData(name) {
    await this.props.getProfile(name);
    const p1 = this.props.getFeedbacks(name);
    const p2 = this.props.getTradesForUser(name);
    return Promise.all([p1, p2]);
  }

  componentDidMount() {
    const name = this.props.match.params.id;
    this.getProfilePageData(name);
    this.props.getExchangeRates('binance');
    this.props.updateExchanges();
    this.setState({
      rates: this.props.exchangesInfo['binance'] ? this.props.exchangesInfo['binance'].rates : [],
    });
  }

  async componentWillReceiveProps(nextProps) {
    const name = nextProps.match.params.id;
    if(nextProps.profile !== this.props.profile) {
      this.setState({profile: nextProps.profile});
    }
    if(this.props.match.params.id !== name) {
      this.setState({profile: {contractSettings: {}}});
      await this.getProfilePageData(name);
    }
    if(Object.prototype.hasOwnProperty.call(nextProps.exchangesInfo, 'binance') && (this.state.rates.length === 0)) {
      await this.props.getExchangeRates('binance');
      this.setState({
        rates: this.props.exchangesInfo['binance'].rates,
      });
    }
  }

  render() {
    const {loggedIn, profile} = this.props.auth;
    const {rates} = this.state;
    let own = false;
    if(loggedIn && profile && profile.name === this.props.match.params.id) {
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

const mapStateToProps = state => ({
  auth: state.auth,
  exchangesInfo: state.exchangesInfo,
  profile: state.profile,
});

const mapDispatchToProps = dispatch => ({
  updateContractSettings: (name, contractSettings) => dispatch(updateContractSettings(name, contractSettings)),
  toggleAvailable: (name, available) => dispatch(toggleAvailable(name, available)),
  updateExchanges: () => dispatch(updateExchanges()),
  getProfile: name => dispatch(getProfile(name)),
  getFeedbacks: name => dispatch(getFeedbacks(name)),
  getTradesForUser: name => dispatch(getTradesForUser(name)),
  getExchangeRates: exchange => dispatch(getExchangeRates(exchange)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
