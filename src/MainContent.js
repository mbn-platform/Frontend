import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Login from './components/login/LoginContainer';
import Dashboard from './dashboard/DashboardContainer';
import Terminal from './terminal/Terminal';
import Ratings from './ratings/Ratings';
import Orders from './orders/Orders';
import Profile from './profile/Profile';
import './MainContent.css';
import { Col } from 'reactstrap';

const MainContent = ({ loggedIn, profile }) => (
  <Col xs="12" md>
    <Switch>
      <LoginRoute exact path="/login" loggedIn={loggedIn} />
      <ProtectedRoute exact path="/dashboard" component={Dashboard} loggedIn={loggedIn} />
      <ProtectedRoute exact path="/terminal" component={Terminal} loggedIn={loggedIn} />
      <ProtectedRoute exact path="/orders" component={Orders} loggedIn={loggedIn} />
      <ProtectedRoute exact path="/ratings" component={Ratings} loggedIn={loggedIn} />
      <Redirect exact from="/profile" to={profile ? `/${profile.name}` : '/login'} />
      <Route exact path="/:id" component={Profile} />
      <Redirect from="/" to="/profile" />
    </Switch>
  </Col>
);

const LoginRoute = ({ loggedIn, ...props }) => {
  if(loggedIn) {
    return (<Redirect to="/profile" />);
  } else {
    return (<Route  {...props} component={Login} />);
  }
};

const ProtectedRoute = ({ component, loggedIn, ...props }) => {
  if(!loggedIn) {
    return (<Redirect to="/login" />);
  } else {
    return (<Route {...props} component={component} />);
  }
};

export default MainContent;
