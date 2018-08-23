import { ApiChallenge} from '../generic/api';
import {leaderboardErrorHandler} from '../generic/errorHandlers';

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
      .catch(err =>
        leaderboardErrorHandler(err, dispatch));
  };
};
