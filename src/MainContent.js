import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Login from './login/LoginContainer';
import Dashboard from './dashboard/DashboardContainer';
import Profile from './profile/Profile';
import './MainContent.css';

const MainContent = ({ loggedIn, profile }) => (
  <div className="page_right_col">
    <Switch>
      <LoginRoute exact path="/login" loggedIn={loggedIn} />
      <ProtectedRoute exact path="/dashboard" component={Dashboard} loggedIn={loggedIn} />
      <Redirect exact from="/profile" to={profile ? `/${profile.name}` : '/login'} />
      <Route exact path="/:id" component={Profile} />
      <Redirect from="/" to="/dashboard" />
    </Switch>
  </div>
);


const LoginRoute = ({ loggedIn, ...props }) => {
  if(loggedIn) {
    return (<Redirect to="/dashboard" />);
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
