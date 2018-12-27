import { ApiChallenge} from '../generic/api';
import {leaderboardErrorHandler} from '../generic/errorHandlers';

export const UPDATE_CHALLENGE = 'UPDATE_CHALLENGE';
export const NEXT_STATUS = 'NEXT_STATUS';
export const NEXT_PARTICIPATE = 'NEXT_PARTICIPATE';

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

export const getNextInfo = () => {
  return dispatch => {
    ChallengeApi.getNextInfo()
      .then(data => {
        dispatch({
          type: NEXT_STATUS,
          next: data,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
};

export const takePart = () => {
  return dispatch => {
    ChallengeApi.takePart()
      .then(data => {
        dispatch({
          type: NEXT_PARTICIPATE,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
};
