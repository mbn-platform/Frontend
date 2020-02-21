import React from 'react';
import { connect } from 'react-redux';

import { updateExchanges } from 'actions/exchanges';
import { updateContractSettings, getProfilePageInfo, toggleAvailable } from 'actions/profile';
import { getExchangeRates } from 'actions/terminal';
import { authSelector } from 'selectors/auth';
import { profileSelector } from 'selectors/profile';
import { exchangesInfoSelector } from 'selectors/exchangesInfo';
import Profile from './Profile';

const mapStateToProps = state => ({
  auth: authSelector(state),
  exchangesInfo: exchangesInfoSelector(state),
  profile: profileSelector(state),
});

const mapDispatchToProps = {
  updateContractSettings,
  toggleAvailable,
  updateExchanges,
  getProfilePageInfo,
  getExchangeRates,
};

const ProfileContainer = connect(mapStateToProps, mapDispatchToProps)(Profile);

/**
 * Component for recreating profile component on user change
 *
 */
const ProfileWrapper = ({ match }) => (
  <ProfileContainer key={match.params.id} name={match.params.id} />
);

export default ProfileWrapper;
