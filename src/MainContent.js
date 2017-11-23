import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Terminal from './terminal/Terminal';
import './MainContent.css';
import { Col } from 'reactstrap';

const MainContent = ({ loggedIn, profile }) => (
  <Col xs="12" md>
    <Switch>
      <Route exact path="/terminal" component={Terminal} />
      <Route exact path="/ratings" component={History} />
      <Route exact path="/orders" component={Orders} />
      <Redirect to="/terminal" />
      <Route path="/" component={RedirectToMain} />
    </Switch>
  </Col>
);

const History = () => null;
const Orders = () => null;

const RedirectToMain = (props) => {
  const location = props.location.pathname;
  window.location = location;
};

const ProtectedRoute = ({ component, loggedIn, ...props }) => {
  if(!loggedIn) {
    return (<Redirect to="/login" />);
  } else {
    return (<Route {...props} component={component} />);
  }
};

export default MainContent;
