import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Login from './login/Login';
import EnterNickname from './login/EnterNickname';
import Dashboard from './dashboard/DashboardContainer';

const MainContent = ({ loggedIn, onLoginClick, nameRequired, onNicknameSet }) => (
  <Switch>
    {loginRoute(loggedIn, nameRequired, onLoginClick)}
    {nicknameRoute(nameRequired, onNicknameSet)}
    {protectedRoute("/dashboard", true, Dashboard, loggedIn)}
    <Redirect from="/" to="/dashboard" />
  </Switch>
);

const protectedRoute = (path, exact, Component, loggedIn) => (
  <Route exact={exact} path={path} render={() => (
    loggedIn ? <Component /> : <Redirect to="/login" />
    )}
  />
);

const loginRoute = (loggedIn, nameRequired, onLoginClick) => {
  const render = () => {
    let component;
    if(loggedIn) {
      component = (<Redirect to="/dashboard" />);
    } else if(nameRequired) {
      component = (<Redirect to="/nickname" />);
    } else {
      component = (<Login onLoginClick={onLoginClick} />);
    }
    return component;
  };
  return (<Route exact path="/login" render={render} />);
};

const nicknameRoute = (nameRequired, onNicknameSet) => (
  <Route exact path="/nickname" render={() => (
    nameRequired ? <EnterNickname onNicknameSet={onNicknameSet} /> : <Redirect to="/login" />
    )} />
);


const ProtectedRoute = ({ path, exact, component: Component, loggedIn, isNew }) => {
  const render = () => {
    let component;
    if(!loggedIn) {
      component = (<Redirect to="/login" />);
    } else if(isNew) {
      component = (<Redirect to="/nickname" />);
    } else {
      component = (<Component />);
    }
    return component;
  };
  return (<Route exact={exact} path={path} render={render} />);
};

export default MainContent;
