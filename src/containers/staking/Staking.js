import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import qs from 'qs';

import {
  verifyStakeAddress, getStakeInfo, getStakeTransactions,
  getStakeRating, setTrListPage, setTrListPageSize,
} from '../../actions/profile';
import StakingInfo from './StakingInfo';
import StakeInfo from './StakeInfo';

class StakingContainer extends React.Component {
  componentDidMount() {
    this.props.getStakeInfo();
  }

  verifyStakeAddress = () => {
    const { loggedIn, location: { pathname }, history } = this.props;

    if (loggedIn) {
      this.props.verifyStakeAddress();
      return;
    }

    history.push('/login?' + qs.stringify({ redirectTo: pathname }));
  };

  renderComponent() {
    const {info} = this.props;
    if (info.info.address) {
      return (
        <StakeInfo
          info={info.info}
          rating={info.rating}
          getPage={this.props.getPage}
          setPage={this.props.setPage}
          setPageSize={this.props.setPageSize}
          trs={this.props.trs}
          getStakeRating={this.props.getStakeRating}
        />
      );
    } else if (info.info.verified === false) {
      return <StakingInfo verifyStakeAddress={this.verifyStakeAddress}/>;
    } else {
      return null;
    }
  }
  render() {
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
                {this.renderComponent()}
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
  getPage: getStakeTransactions,
  setPage: setTrListPage,
  setPageSize: setTrListPageSize,
};

export default connect(mapStateToProps, mapDispatchToProps)(StakingContainer);
