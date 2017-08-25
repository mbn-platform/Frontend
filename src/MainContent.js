import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Login from './login/Login';
import EnterNickname from './login/EnterNickname';
import Dashboard from './dashboard/DashboardContainer';

const MainContent = ({ loggedIn, onLoginClick, isNew, onNicknameSet }) => (
  <Switch>
    <Route exact path="/login" render={() => (
      loggedIn ? <Redirect to="/dashboard" /> : <Login onLoginClick={onLoginClick}/>
    )} />
    <Route exact path="/nickname" render={() => (
      (loggedIn && isNew) ? <EnterNickname onNicknameSet={onNicknameSet} /> : <Redirect to="/dashboard" />
     )} />
    <ProtectedRoute exact path="/dashboard" component={Dashboard} loggedIn={loggedIn} />
    <Redirect from="/" to="/dashboard" />
  </Switch>
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
