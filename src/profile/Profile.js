import React from 'react';
import ProfileInfo from './ProfileInfo';
import TablesScreen from './TablesScreen';
import { Row, Container } from 'reactstrap';
import { connect } from 'react-redux';
import { sendOffer } from '../actions/offers';
import { fetchDashboardData } from '../actions/dashboard';
import { updateExchagnes } from '../actions/exchanges';
import { updateProfile } from '../actions/profile';

class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.onSaveChangesClick = this.onSaveChangesClick.bind(this);
    this.onOfferSendClick = this.onOfferSendClick.bind(this);
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

  onOfferSendClick() {
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
    window.fetch(`/api/profile/${name}`, {
      credentials: 'same-origin'
    })
      .then(res => res.json())
      .then(profile => {
        this.setState(profile);
      });
  }

  componentWillReceiveProps(nextProps) {
    const name = nextProps.match.params.id;
    this.updateProfile(name);
  }

  render() {
    const own = this.props.profile._id && this.state._id && this.props.profile._id === this.state._id;
    console.log(own);
    return (
      <Container fluid className='profile-item'>
        <Row>
          <ProfileInfo own={own} {...this.state}
            sendOffer={this.props.sendOffer}
            exchanges={this.props.exchanges}
            apiKeys={this.props.apiKeys}
            onOfferSendClick={this.onOfferSendClick}
            onSaveChangesClick={this.onSaveChangesClick}
          />
          <TablesScreen
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
  apiKeys: state.apiKeys.ownKeys.filter(k => k.state === 'FREE'),
  exchanges: state.exchanges,
});

const mapDispatchToProps = dispatch => ({
  updateProfile: profile => dispatch(updateProfile(profile)),
  sendOffer: offer => dispatch(sendOffer(offer)),
  fetchDashboardData: () => dispatch(fetchDashboardData()),
  updateExchanges: () => dispatch(updateExchagnes()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
