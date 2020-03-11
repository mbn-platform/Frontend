import { reducerCreator } from 'generic/util';
import { LOGGED_IN, NAME_REQUIRED } from 'actions/auth';
import { UPDATE_PROFILE, UPDATE_PROFILE_AVAILABLE, GET_PROFILE } from 'actions/profile';

const initialState = { loggedIn: false };

const reducerList = {
  [LOGGED_IN]: (auth, { data }) => ({
    ...auth, loggedIn: true, profile: data,
  }),
  [NAME_REQUIRED]: (auth) => ({
    ...auth, nameRequired: true, loggedIn: false,
  }),
  [GET_PROFILE]: (auth, { profile }) => {
    return auth.loggedIn && auth.profile._id === profile._id
      ? { ...auth, profile: { ...auth.profile, ...profile } }
      : auth;
  },
  [UPDATE_PROFILE_AVAILABLE]: (auth, { profile }) => {
    if(!auth.loggedIn) { return auth; }

    const { available, contractSettings, currencies } = profile;
    const currentProfile = auth.profile;
    const update = { ...currentProfile, available, contractSettings, currencies };

    return { ...auth, profile: update };
  },
  [UPDATE_PROFILE]: (auth, { profile }) => {
    return { ...auth, profile: { ...auth.profile, ...profile }};
  },
};

export default reducerCreator(initialState, reducerList);

