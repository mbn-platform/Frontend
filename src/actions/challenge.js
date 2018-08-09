import {apiGet} from '../generic/apiCall';

export const UPDATE_CHALLENGE = 'UPDATE_CHALLENGE';

export const updateChallenge = number => {
  return dispatch => {
    apiGet('/challenge/' + number)
      .then(data => {
        dispatch({
          type: UPDATE_CHALLENGE,
          challenge: data,
        });
      })
      .catch(dispatch({
        type: UPDATE_CHALLENGE,
        challenge: null,
      }));
  };
};
