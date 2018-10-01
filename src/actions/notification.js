export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';
export const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION';


export const showNotification = (notificationType='info', notificationID = null, message='', url='') => {
  return dispatch => {
    const viewedNotificationIDs = localStorage['viewedNotification'] ?
      JSON.parse(localStorage.getItem('viewedNotification')) : [];
    const isCurrentNotificationWasViewed = viewedNotificationIDs.length > 0 ?
      viewedNotificationIDs.find(currentNotificationID =>{
        return currentNotificationID.toString() === notificationID.toString(); }
      ) : false;
    if (!isCurrentNotificationWasViewed) {
      dispatch({
        type: SHOW_NOTIFICATION,
        notificationType,
        notificationID,
        message,
        url
      });
    }
  };
};

export const closeNotification = notificationID => {
  return dispatch => {
    const viewedNotificationIDs = localStorage['viewedNotification'] ?
      JSON.parse(localStorage.getItem('viewedNotification')) : [];
    const isCurrentNotificationWasViewed = viewedNotificationIDs.find(currentNotificationID =>{
      return currentNotificationID === notificationID; }
    );
    if (!isCurrentNotificationWasViewed) {
      localStorage.setItem('viewedNotification', JSON.stringify([notificationID, ...viewedNotificationIDs]));
    }
    dispatch({
      type: CLOSE_NOTIFICATION,
    });
  };
};
