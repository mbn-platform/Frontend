import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import qs from 'qs';
import get from 'lodash/get';

import {
  verifyStakeAddress, getStakeInfo, getStakeTransactions,
  getStakeRating, setTrListPage, setTrListPageSize,
} from '../../actions/profile';
import { showCommitTokensModal } from '../../actions/modal';
import StakingInfo from './StakingInfo';
import PersonalInfo from './PersonalInfo';

class StakingContainer extends React.Component {
  state = {
    renderItem: null,
  };

  componentDidMount() {
    this.props.getStakeInfo();
  }

  componentDidUpdate(prevProps) {
    const verified = get(this.props, 'info.info.verified');
    if (prevProps.info.info !== this.props.info.info) {
      this.setState({ renderItem: verified === false ? 'info' : 'personal' });
    }
  }

  setRenderItem = renderItem => () => {
    this.setState({ renderItem });
  };

  verifyStakeAddress = () => {
    const { loggedIn, location: { pathname }, history } = this.props;

    if (loggedIn) {
      this.props.verifyStakeAddress();
      return;
    }

    history.push(`/login?${qs.stringify({ redirectTo: pathname })}`);
  };

  showCommitTokensModal = () => {
    this.props.showCommitTokensModal();
  };

  render() {
    const { info } = this.props;
    const { renderItem } = this.state;

    return (
      <Container fluid className="ratings staking">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <div className="hashlog__main">
              <div className="hashlog__main-title">
                <FormattedMessage
                  id="staking.title"
                  defaultMessage="Staking"
                />
              </div>
              <div className="hashlog__main-board">
                {renderItem === 'personal' && (
                  <PersonalInfo
                    info={info.info}
                    rating={info.rating}
                    getPage={this.props.getPage}
                    setPage={this.props.setPage}
                    setPageSize={this.props.setPageSize}
                    trs={this.props.trs}
                    getStakeRating={this.props.getStakeRating}
                    setRenderItem={this.setRenderItem}
                    showModal={this.showCommitTokensModal}
                  />
                )}
                {renderItem === 'info' && (
                  <StakingInfo
                    info={info.info}
                    verifyStakeAddress={this.verifyStakeAddress}
                    setRenderItem={this.setRenderItem}
                  />
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
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

export default connect(mapStateToProps, mapDispatchToProps)(StakingContainer);
