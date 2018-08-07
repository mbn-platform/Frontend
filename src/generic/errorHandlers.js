import { LOGGED_OUT } from '../actions/auth';
import { ApiError } from './apiCall';

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

export function profileErrorHandler(error, dispatch) {
  if (error.apiErrorCode) {
    switch (error.apiErrorCode) {
      case ApiError.NOT_FOUND:
        alert('no such profile');
        break;
      default:
        defaultErrorHandler(error, dispatch);
    }
  } else {
    console.log(error);
  }
}
