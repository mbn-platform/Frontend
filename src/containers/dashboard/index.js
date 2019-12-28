import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Switch, Route, NavLink, Redirect } from 'react-router-dom';
import DashboardContainer from './DashboardContainer';
import { External } from './External';

class DashboardWrapper extends React.Component {

  render() {
    return(
      <div className="dashboard page">
        {this.renderNavigation()}
        <Switch>
          <Route exact path="/dashboard/inner" component={DashboardContainer} />
          <Route exact path="/dashboard/external" component={External} />
          <Redirect to="/dashboard/inner"/>
        </Switch>
      </div>
    );
  }

  renderNavigation() {
    return (
      <div className="dashboard_wrapper clearfix">
        <div className="page-tab">
          <NavLink to="/dashboard/inner">
            <FormattedMessage
              id="dashboard.inner.title"
              defaultMessage="INNER API" />
          </NavLink>
          <NavLink to="/dashboard/external">
            <FormattedMessage
              id="dashboard.external.title"
              defaultMessage="EXTERNAL API (BOTS)" />
          </NavLink>
        </div>
      </div>
    );
  }
}

export default DashboardWrapper;
