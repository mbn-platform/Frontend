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
  }

  onOfferSendClick() {
  }

  onSaveChangesClick(update) {
    const profile = {
      availableForOffers: true,
      name: this.props.profile.name,
      currencies: this.props.profile.currencies,
      ...update
    }
    console.log(profile);
    updateProfile(profile);
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
      <Container fluid>
        <Row>
          <ProfileInfo own={own} {...this.state}
            sendOffer={this.props.sendOffer}
            exchanges={this.props.exchanges}
            apiKeys={this.props.apiKeys}
            onOfferSendClick={this.onOfferSendClick}
            onSaveChangesClick={this.onSaveChangesClick}
          />
          <TablesScreen />
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.auth.profile,
  apiKeys: state.apiKeys.ownKeys,
  exchanges: state.exchanges,
});

const mapDispatchToProps = dispatch => ({
  sendOffer: offer => dispatch(sendOffer(offer)),
  fetchDashboardData: () => dispatch(fetchDashboardData()),
  updateExchanges: () => dispatch(updateExchagnes()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
