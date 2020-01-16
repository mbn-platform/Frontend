import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import qs from 'qs';

import {
  verifyStakeAddress, getStakeInfo, getStakeTransactions,
  getStakeRating, setTrListPage, setTrListPageSize,
} from '../../actions/profile';
import { showCommitTokensModal } from '../../actions/modal';
import StakingInfo from './StakingInfo';
import PersonalInfo from './PersonalInfo';
import { Switch, Route, NavLink, Redirect } from 'react-router-dom';

class NewStaking extends React.Component {

  state = {
    loaded: false,
  }

  verifyStakeAddress = () => {
    const { loggedIn, history } = this.props;

    if (loggedIn) {
      this.props.verifyStakeAddress();
      return;
    }

    history.push(`/login?${qs.stringify({ redirectTo: '/staking' })}`);
  };

  showCommitTokensModal = () => {
    this.props.showCommitTokensModal();
  };

  componentDidUpdate(prevProps) {
    if (this.props.info.info !== prevProps.info.info) {
      this.setState({loaded: true});
    }
  }

  componentDidMount() {
    this.props.getStakeInfo();
  }

  render() {
    const { info } = this.props;
    return (
      <Container fluid className="ratings leaderboard staking">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <div className="ratings-main">
              {this.renderNavigation()}
              <div className="hashlog__main-board">
                <Switch>
                  <Route exact path="/staking/info">
                    <StakingInfo
                      info={info.info}
                      verifyStakeAddress={this.verifyStakeAddress}
                    />
                  </Route>
                  <Route exact path='/staking' render={() => {
                    if (!this.state.loaded) {
                      return null;
                    } else if (!info.info.verified) {
                      return <Redirect to='/staking/info' />;
                    } else {
                      return (
                        <PersonalInfo
                          info={info.info}
                          rating={info.rating}
                          getPage={this.props.getPage}
                          setPage={this.props.setPage}
                          setPageSize={this.props.setPageSize}
                          trs={this.props.trs}
                          getStakeRating={this.props.getStakeRating}
                          showModal={this.showCommitTokensModal}
                        />
                      );
                    }
                  }}/>
                  <Redirect to="/staking" />
                </Switch>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  renderNavigation() {
    return (
      <div className="rating-navigation">
        <NavLink exact to="/staking">
          <FormattedMessage
            id="staking.title"
            defaultMessage="STAKING"
          />
        </NavLink>
        <NavLink exact to="/staking/info">
          <FormattedMessage
            id="staking.info.title"
            defaultMessage="INFO"
          />
        </NavLink>
      </div>
    );
  }

}

const mapStateToProps = (state) => ({
  info: state.stakeInfo,
  trs: state.stakeTr,
  loggedIn: state.auth.loggedIn,
});

const mapDispatchToProps = {
  verifyStakeAddress,
  getStakeInfo,
  getStakeRating,
  showCommitTokensModal,
  getPage: getStakeTransactions,
  setPage: setTrListPage,
  setPageSize: setTrListPageSize,
};


export default connect(mapStateToProps, mapDispatchToProps)(NewStaking);
