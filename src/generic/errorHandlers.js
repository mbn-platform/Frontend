import { LOGGED_OUT } from '../actions/auth';
import { ApiError } from './apiCall';
import { showInfoModal } from '../actions/modal';

export default function defaultErrorHandler(error, dispatch) {
  if(error.apiErrorCode) {
    switch(error.apiErrorCode) {
      case ApiError.FORBIDDEN:
        dispatch({
          type: LOGGED_OUT,
        });
        break;
      default:
        console.log('unhandled api error', error.apiErrorCode);
    }
  } else {
    console.log('error perfoming request');
    console.log(error);
  }
}

export function leaderboardErrorHandler(error, dispatch) {
  if (error.apiErrorCode) {
    switch (error.apiErrorCode) {
      case ApiError.NOT_FOUND:
        dispatch(showInfoModal('noDataAboutCurrentRound'));
        break;
      default:
        defaultErrorHandler(error, dispatch);
    }
  } else {
    console.log(error);
  }
}

export function profileErrorHandler(error, dispatch) {
  if (error.apiErrorCode) {
    switch (error.apiErrorCode) {
      case ApiError.NOT_FOUND:
        dispatch(showInfoModal('noSuchProfile'));
        break;
      default:
        defaultErrorHandler(error, dispatch);
    }
  } else {
    console.log(error);
  }
}
