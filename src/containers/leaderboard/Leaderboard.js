import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { injectIntl } from 'react-intl';
import { Switch, Route, NavLink } from 'react-router-dom';
import {updateChallenge, getNextInfo, takePart, applyForContract} from '../../actions/challenge';
import {showConfirmModal} from '../../actions/modal';
import {calculateTraderProfit} from '../../actions/profile';
import {updateRatings} from '../../actions/terminal';
import {connect} from 'react-redux';
import Leaderboard from './LeaderboardPage';
import Rating from './Rating';

class PageWrapper extends React.Component {
  render() {
    return (
      <Container fluid className="ratings leaderboard">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <div className="ratings-main">
              {this.renderNavigation()}
              <Switch>
                <Route exact path="/leaderboard" render={() => <Leaderboard {...this.props} />} />
                <Route exact path="/rating" render={() => <Rating {...this.props} />} />
              </Switch>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  renderNavigation() {
    return (
      <div className="rating-navigation">
        <NavLink to="/rating">
          <FormattedMessage
            id="rating.title"
            defaultMessage="RATING" />
        </NavLink>
        <NavLink to="/leaderboard">
          <FormattedMessage
            id="leaderboard.title"
            defaultMessage="RATING" />
        </NavLink>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  challenge: state.challenge,
  loggedIn: state.auth.loggedIn,
  ratings: state.ratings,
});

const mapDispatchToProps = {
  showConfirmModal,
  updateChallenge,
  takePart,
  getNextInfo,
  applyForContract,
  calculateTraderProfit,
  updateRatings,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(PageWrapper));

