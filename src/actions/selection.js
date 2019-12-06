import defaultErrorHandler from '../generic/errorHandlers';
import { ApiSelection } from '../generic/api';

const SelectionApi = new ApiSelection();

export const UPDATE_SELECTION = 'UPDATE_SELECTION';
export const CONFIRM_SELECTION = 'CONFIRM_SELECTION';

export function fetchSelection() {
  return dispatch => {
    SelectionApi.fetch()
      .then(json => dispatch({
        type: UPDATE_SELECTION,
        selection: json,
      }))
      .catch(err => {
        defaultErrorHandler(err, dispatch);
      });
  };
}

export function confirmRound(round) {
  return dispatch => {
    SelectionApi.confirmRound(round)
      .then((json) => dispatch({
        type: UPDATE_SELECTION,
        selection: json,
      }))
      .catch((err) => {
        console.log(err);
        defaultErrorHandler(err, dispatch);
      });
  };
}
