import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Dashboard from './dashboard/DashboardContainer';
import Profile from './profile/Profile';
import Terminal from './terminal/Terminal';
import History from './history/History';
import Orders from './orders/Orders';
import Ratings from './ratings/Ratings';
import './MainContent.css';
import { Col } from 'reactstrap';

const MainContent = ({ loggedIn, profile }) => (
  <Col xs="12" md>
    <Switch>
      <Redirect from="/login" to="/profile" />
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/terminal" component={Terminal} />
      <Route exact path="/history" component={History} />
      <Route exact path="/orders" component={Orders} />
      <Route exact path="/ratings" component={Ratings} />
      <Redirect exact from="/profile" to={profile.name} />
      <Route exact path="/:id" component={Profile} />
      <Redirect from="/" to="/profile" />
    </Switch>
  </Col>
);

const RedirectToMain = ({location}) => {
  window.location = location.pathname;
  return null;
};

const ProtectedRoute = ({ component, loggedIn, ...props }) => {
  if(!loggedIn) {
    return (<Redirect to="/login" />);
  } else {
    return (<Route {...props} component={component} />);
  }
};

export default MainContent;
