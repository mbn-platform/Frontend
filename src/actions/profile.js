export const UPDATE_PROFILE = 'UPDATE_PROFILE';

export function updateProfile(profile) {
  return {
    type: UPDATE_PROFILE,
    profile: profile
  };
}

