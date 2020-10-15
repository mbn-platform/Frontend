import React from 'react';
import { Switch, Route, NavLink, Redirect } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Orders from '../orders/Orders';
import ContractHistory from './ContractHistory';
import ActiveContracts from './ActiveContracts';

export default class History extends React.Component {

  render() {
    return(
      <div className="dashboard page">
        {this.renderNavigation()}
        <Switch>
          <Route exact path="/history/contracts" component={ActiveContracts} />
          <Route exact path="/history/finishedContracts" component={ContractHistory} />
          <Route exact path="/history/orders" component={Orders} />
          <Redirect to="/history/contracts"/>
        </Switch>
      </div>
    );
  }

  renderNavigation() {
    return (
      <div className="dashboard_wrapper clearfix">
        <div className="page-tab">
          <NavLink to="/history/contracts">
            <FormattedMessage id="history.contracts.active.title" />
          </NavLink>
          <NavLink to="/history/finishedContracts">
            <FormattedMessage id="history.contracts.title" />
          </NavLink>
          <NavLink to="/history/orders">
            <FormattedMessage id="history.orders.title" />
          </NavLink>
        </div>
      </div>
    );
  }
}
