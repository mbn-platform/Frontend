import React from 'react';
import { logIn } from './actions/auth';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import Login from './login/Login';
import Dashboard from './dashboard/DashboardContainer';

const MainContent = ({ loggedIn, onLoginClick }) => (
  <Switch>
    <Route exact path="/login" render={() => (
      loggedIn ? <Redirect to="/dashboard" /> : <Login onLoginClick={onLoginClick}/>
    )} />
    <ProtectedRoute exact path="/dashboard" component={Dashboard} loggedIn={loggedIn} />
    <Redirect from="/" to="/dashboard" />
  </Switch>
);

const ProtectedRoute = ({ path, exact, component: Component, loggedIn }) => (
  <Route exact={exact} path={path} render={() =>
    loggedIn ? (<Component />) : (<Redirect to="/login" />)
    } />
);

const mapStateToProps = state => ({loggedIn: state.auth.loggedIn});
const mapDispatchToProps = dispatch =>({onLoginClick: () => dispatch(logIn())});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainContent));
