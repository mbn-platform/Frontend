import BN from 'bignumber.js';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card } from 'reactstrap';
import delay from 'lodash/delay';
import { FormattedMessage } from 'react-intl';

import { removeQuickNotif } from '../actions/quickNotif';

const NOTIFICATION_LIFETIME = 30000;

class QuickNotification extends React.PureComponent {
  static propTypes = {
    maxCount: PropTypes.number,
    events: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    removeQuickNotif: PropTypes.func.isRequired,
  }

  static defaultProps = {
    maxCount: 2,
  }

  onEventClick = (event) => () => {
    this.props.removeQuickNotif(event);
  }

  render() {
    const { events, maxCount } = this.props;

    return events.length > 0 ? (
      <div className="quick-notif-wrapper">
        {events.slice(0, maxCount).map(event => {
          switch (event.type) {
            case 'order_closed': {
              const { object } = event;
              const [main, secondary] = object.symbol.split('-');
              const message = object.canceledAt ? 'Order canceled' : 'Order executed';
              const price = object.filled > 0 ? new BN(object.price / object.filled).dp(8).toString() : '0';

              return (
                <Notification
                  key={event.object._id}
                  event={event}
                  time={formatDate(new Date(object.dtClose))}
                  message={message}
                  content={
                    <React.Fragment>
                      <div>Filled: {object.filled} {secondary}</div>
                      <div>Price: {price} {main}</div>
                      <div>Total: {object.price} {main}</div>
                    </React.Fragment>
                  }
                  onClick={this.onEventClick}
                />
              );
            }
            case 'request_timed_out':
            case 'request_created':
            case 'request_accepted':
            case 'request_canceled':
            case 'request_verified':
            case 'request_rejected': {
              const { object: { _id, contractSettings }, type } = event;

              return (
                <Notification
                  key={_id}
                  event={event}
                  time={formatDate(new Date())}
                  message={requestNotifTitle(type)}
                  content={<div>{contractSettings.sum} {contractSettings.currency}</div>}
                  onClick={this.onEventClick}
                />
              );
            }
            case 'group_contract_order_not_placed': {
              const { object: { _id, from, sum, currency }, type } = event;

              return (
                <Notification
                  key={`${_id}order_not_placed`}
                  event={event}
                  time={formatDate(new Date())}
                  message={requestNotifTitle(type)}
                  content={
                    <React.Fragment>
                      <div>Contract from {from} {sum} {currency}</div>
                      <div>Order was not placed due to minimal order size requirement</div>
                    </React.Fragment>
                  }
                  onClick={this.onEventClick}
                />
              );
            }
            case 'error': {
              const { object: { _id, text, values }} = event;
              return (
                <ErrorNotification
                  event={event}
                  text={text}
                  key={_id}
                  onClick={this.onEventClick}
                  values={values || {}}
                />
              );
            };
            case 'success': {
              const { object: { _id, text, values }} = event;
              return (
                <SuccessNotification
                  event={event}
                  text={text}
                  key={_id}
                  onClick={this.onEventClick}
                  values={values || {}}
                />
              );
            }
            default:
              return null;
          }
        })}
      </div>
    ) : null;
  }
}
class ErrorNotification extends React.Component {
  componentDidMount = () => {
    const { event, onClick } = this.props;
    delay(onClick(event), NOTIFICATION_LIFETIME);
  };

  render() {
    const { text, onClick, values, event } = this.props;
    return (
      <Card className="quick-notif error" onClick={onClick(event)}>
        <div className="title error">
          Error
        </div>
        <FormattedMessage
          id={text}
          values={values}
        />
      </Card>
    );
  }
}
class SuccessNotification extends React.Component {
  componentDidMount = () => {
    const { event, onClick } = this.props;
    delay(onClick(event), NOTIFICATION_LIFETIME);
  };

  render() {
    const { text, onClick, event, values } = this.props;
    return (
      <Card className="quick-notif success" onClick={onClick(event)}>
        <div className="title success">
          Success
        </div>
        <FormattedMessage
          id={text}
          values={values}
        />
      </Card>
    );
  }
}
class Notification extends React.Component {
  componentDidMount = () => {
    const { event, onClick } = this.props;
    delay(onClick(event), NOTIFICATION_LIFETIME);
  };

  render = () => {
    const { event, time, message, content, onClick } = this.props;

    return (
      <Card className="quick-notif" onClick={onClick(event)}>
        <div className="top-block">
          <span className="time">{time}</span>
          <span className="close-notif" />
        </div>
        <div className="title">
          {message}
        </div>
        {content}
      </Card>
    );
  };
};

function requestNotifTitle(event) {
  switch (event) {
    case 'request_rejected':
      return 'Contract request rejected';
    case 'request_created':
      return 'New contract request';
    case 'request_canceled':
      return 'Contract request canceled';
    case 'request_accepted': {
      return 'Contract request accepted';
    }
    case 'request_verified': {
      return 'Contract verified';
    }
    case 'request_timed_out': {
      return 'Contract request expired';
    }
    case 'group_contract_order_not_placed': {
      return 'Order could not be placed';
    }
    default:
      return '';
  }
}

function formatDate(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`;
}

function padTime(value) {
  return value < 10 ? '0' + value : value;
}

const mapStateToProps = (state) => ({events: state.quickNotif});
const mapDispatchToProps = (dispatch) => ({
  removeQuickNotif: (event) => dispatch(removeQuickNotif(event)),
});
export default connect(mapStateToProps, mapDispatchToProps)(QuickNotification);

// function PriceChange({value, interval}) {
//   if (value) {
//     return <span>Price change: <b>{formatPercentValueWithSign(value.percent)} / {formatTimeInterval(interval)}</b></span>;
//   } else {
//     return null;
//   }
// }

// function VolumeChange({value, interval}) {
//   if (value) {
//     return <span>Volume change: <b>{formatPercentValueWithSign(value.percent)} / {formatTimeInterval(interval)}</b></span>;
//   } else {
//     return null;
//   }
// }

// function formatPercentValueWithSign(value) {
//   const sign = value >= 0 ? '+' : '';
//   return `${sign}${value.toFixed(2)}%`;
// }

// function formatTimeInterval(interval) {
//   switch (interval) {
//     case 5:
//     case 15:
//       return `${interval} min`;
//     case 60:
//       return '1 h';
//     case 120:
//       return '2 h';
//     case 240:
//       return '4 h';
//     case 1440:
//       return '1 d';
//     case 3 * 1440:
//       return '3 d';
//     case 7 * 1440:
//       return '7 d';
//     case 30 * 1440:
//       return '1 month';
//     default:
//       return `${interval}`;
//   }
// }

