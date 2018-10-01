import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

class NotificationBar extends React.Component {
  static defaultProps = {
    notificationType: '',
    message: '',
    url: '',
  }

  static propTypes = {
    notificationType: PropTypes.string,
    message: PropTypes.string,
    url: PropTypes.string,
    closeNotification: PropTypes.func.isRequired,
  };

  constructor(props){
    super(props);
    this.textWrapper = React.createRef();
    this.state = {
      textExpand: false,
      textOverflowed: false,
    };
  }

  componentDidMount() {
    this.isTextOverflowed(this.textWrapper.current);
  }

  textOnClickHandler = () => this.setState({textExpand: !this.state.textExpand});

  isTextOverflowed = (textElementWrapper) => {
    if (textElementWrapper.offsetWidth < textElementWrapper.scrollWidth) {
      this.setState({textOverflowed: true});
    }
  };

  render() {
    const {notificationType, message, url, closeNotification} = this.props;
    const {textExpand, textOverflowed} = this.state;
    return (
      <div className="notification__container">
        <div
          className={
            `notification__type-wrapper
            ${notificationType === 'warning' ? 'notification__type-wrapper_warning' : ''}
            `}>
          <FormattedMessage id={`notification.${notificationType}`}
            defaultMessage={notificationType === 'info' ? 'Attention' : 'Warning'}
          />
        </div>
        <div
          className={`notification__text-wrapper
          ${textExpand ? 'notification__text-wrapper_expand' : ''}
          ${textOverflowed ? 'notification__text-wrapper_overflowed' : ''}`}
          onClick={this.textOnClickHandler}>
          <span ref={this.textWrapper} className="notification__text">
            {message}
          </span>
        </div>
        {url && <a href={url} className="notification__button" rel="nofollow">
          <FormattedMessage id="notification.details"
            defaultMessage="Details"
          />
        </a> }
        <div className="close-button" onClick={closeNotification}/>
      </div>
    );
  }
}

export default NotificationBar;
