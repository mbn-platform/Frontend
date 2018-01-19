import React from 'react';
import ProfileInfo from './ProfileInfo';
import TablesScreen from './TablesScreen';
import { Row, Container } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchDashboardData } from '../actions/dashboard';
import { updateExchanges } from '../actions/exchanges';
import { updateProfile } from '../actions/profile';
import { apiGet } from '../generic/apiCall';
import { ApiError } from '../generic/apiCall';

class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {profile: {}};
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
    console.log(profile);
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
    this.loadProfile(name);
    this.props.fetchDashboardData();
    this.props.updateExchanges();
  }



  loadProfile(name) {
    console.log('loading profile', name);
    apiGet(`/api/profile/${name}`)
      .then(profile => {
        this.setState({profile});
      })
      .catch(e => {
        if(e.apiErrorCode) {
          switch(e.apiErrorCode) {
            case ApiError.NOT_FOUND:
              alert('no such profile');
              break;
            default:
              console.log('unhandled api error', e.apiErrorCode);
          }
        } else {
          console.log(e);
        }
      });
  }

  componentWillReceiveProps(nextProps) {
    const name = nextProps.match.params.id;
    if(this.props.match.params.id !== name) {
      this.loadProfile(name);
      if(nextProps.auth.profile.name === name) {
        this.setState({profile: nextProps.auth.profile});
      }
    } else {
      if(nextProps.auth.profile && nextProps.auth.profile !== this.state.profile) {
        this.setState({profile: nextProps.auth.profile});
      }
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
            own={own}
            profile={this.state.profile}
            onSaveChangesClick={this.onSaveChangesClick}
            onToggleClick={this.onToggleClick}
          />
          <TablesScreen
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
});

const mapDispatchToProps = dispatch => ({
  updateProfile: profile => dispatch(updateProfile(profile)),
  fetchDashboardData: () => dispatch(fetchDashboardData()),
  updateExchanges: () => dispatch(updateExchanges()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
