import { ApiChallenge} from '../generic/api';

export const UPDATE_CHALLENGE = 'UPDATE_CHALLENGE';


const ChallengeApi = new ApiChallenge();

export const updateChallenge = number => {
  return dispatch => {
    ChallengeApi.update(number)
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
