export const UPDATE_EXCHANGES = 'UPDATE_EXCHANGES';

export const updateExchagnes = () => {
  return dispatch => {
    window.fetch('/api/exchanges')
      .then(res => res.json())
      .then(json => dispatch({
        type: UPDATE_EXCHANGES,
        exchanges: json
      }));
  };
};
