export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';
export const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION';


export const showNotification = (notificationType='info', message='', url='') => {
  return dispatch => {
    dispatch({
      type: SHOW_NOTIFICATION,
      notificationType,
      message,
      url
    });
  };
};

export const closeNotification = () => {
  return dispatch => {
    dispatch({
      type: CLOSE_NOTIFICATION,
    });
  };
};
