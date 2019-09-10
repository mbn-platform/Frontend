import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Col } from 'reactstrap';

import NotificationBar from './components/NotificationBar';
import ActionList from './containers/hashlog/ActionList';
import Dashboard from './containers/dashboard/DashboardContainer';
import Hashlog from './containers/hashlog/Hashlog';
import Leaderboard from './containers/leaderboard/Leaderboard';
import Login from './containers/login/LoginContainer';
import Orders from './containers/orders/Orders';
import Payments from './containers/payments';
import Profile from './containers/profile/ProfileContainer';
import Staking from './containers/staking/Staking';
import Terminal from './containers/terminal/Terminal';
import { ApiNotification } from './generic/api';
import './MainContent.css';

const NotificationApi = new ApiNotification();

const defaultRoute = '/terminal';

class MainContent extends React.Component {
  componentDidMount = () => {
    this.getNotificationData();
  };

  componentDidUpdate = (prevProps) => {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  };

  getNotificationData = async () => {
    const { showNotificationBar } = this.props;

    try {
      const data = await NotificationApi.fetch();
      data.forEach(({id, message, type, url}) => {
        showNotificationBar(type, id, message, url);
      });
    } catch(e) {
      console.error(e);
    }
  };

  renderNotificationBar = () => {
    const {
      isNotificationOpen,
      closeNotificationBar,
      notificationMessage,
      notificationUrl,
      notificationType,
      notificationID,
    } = this.props;

    return isNotificationOpen && (
      <NotificationBar
        closeNotification={closeNotificationBar}
        url={notificationUrl}
        message={notificationMessage}
        notificationType={notificationType}
        notificationID={notificationID}
      />
    );
  };

  render() {
    const { loggedIn, profile } = this.props;

    return (
      <Col xs="12" md>
        {this.renderNotificationBar()}
        <Switch>
          <LoginRoute exact path="/login" loggedIn={loggedIn}/>

          <Route exact path="/terminal" component={Terminal} loggedIn={loggedIn}/>
          <Route exact path="/terminal/:exchange" component={Terminal} loggedIn={loggedIn}/>
          <Route exact path="/terminal/:exchange/:market" component={Terminal} loggedIn={loggedIn}/>
          <Route exact path="/hashlog" component={Hashlog} loggedIn={loggedIn}/>
          <Route exact path="/hashlog/actions/" component={ActionList} loggedIn={loggedIn}/>
          <Route exact path="/leaderboard" component={Leaderboard}/>
          <Route exact path="/rating" component={Leaderboard}/>
          <Route exact path="/:id" component={Profile}/>

          <ProtectedRoute exact path="/dashboard" component={Dashboard} loggedIn={loggedIn}/>
          <ProtectedRoute exact path="/staking" component={Staking} loggedIn={loggedIn}/>
          <ProtectedRoute exact path="/orders" component={Orders} loggedIn={loggedIn}/>
          <ProtectedRoute exact path="/payments/:id" component={Payments} loggedIn={loggedIn}/>

          <Redirect exact from="/ratings" to="/leaderboard"/>
          <Redirect exact from="/profile" to={loggedIn ? `/${profile.name}` : '/login'}/>
          <Redirect exact from="/" to={defaultRoute}/>
        </Switch>
      </Col>
    );
  }
}

const LoginRoute = ({ loggedIn, ...props }) => {
  if (loggedIn) {
    return (<Redirect to={defaultRoute} />);
  } else {
    return (<Route  {...props} component={Login} />);
  }
};

const ProtectedRoute = ({ component, loggedIn, ...props }) => {
  if (!loggedIn) {
    return (<Redirect to="/login" />);
  } else {
    return (<Route {...props} component={component} />);
  }
};

export default MainContent;
