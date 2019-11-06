import React from 'react';
import { connect } from 'react-redux';
import { verifyStakeAddress, getStakeInfo, getStakeTransactions, getStakeRating,
  setTrListPage, setTrListPageSize } from '../../actions/profile';
import { Container, Row, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import StakingInfo from './StakingInfo';
import StakeInfo from './StakeInfo';

class StakingContainer extends React.Component {

  componentDidMount() {
    this.props.getStakeInfo();
  }

  renderComponent() {
    const {info} = this.props;
    if (info.info.address) {
      return (
        <StakeInfo
          info={info.info}
          rating={info.rating}
          email={this.props.email}
          getPage={this.props.getPage}
          setPage={this.props.setPage}
          setPageSize={this.props.setPageSize}
          trs={this.props.trs}
          getStakeRating={this.props.getStakeRating}
        />
      );
    } else if (info.info.verified === false) {
      return <StakingInfo verifyStakeAddress={this.props.verifyStakeAddress}/>;
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
  email: state.auth.profile.email,
});

const mapDispatchToProps = (dispatch) => ({
  verifyStakeAddress: () => dispatch(verifyStakeAddress()),
  getStakeInfo: () => dispatch(getStakeInfo()),
  getPage: (pages, size) => dispatch(getStakeTransactions(pages, size)),
  setPage: page => dispatch(setTrListPage(page)),
  setPageSize: pageSize => dispatch(setTrListPageSize(pageSize)),
  getStakeRating: () => dispatch(getStakeRating()),
});
export default connect(mapStateToProps, mapDispatchToProps)(StakingContainer);
