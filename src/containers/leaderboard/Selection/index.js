import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import { fetchSelection, confirmRound } from '../../../actions/selection';
import SelectionTable from './SelectionTable';

class Selection extends React.Component {

  state = {
    selectedRound: 1,
  }

  componentDidMount = () => {
    this.props.fetchSelection();
  };

  selectTab = (tab) => {
    this.setState({selectedRound: tab});
  }

  onConfirmButtonClick = () => {
    this.props.confirmRound('first');
  }

  formatDate(date) {
    return `${date.getDate()}.${date.getMonth() + 1}`;
  }

  render = () => {
    let round;
    if (this.props.selection) {
      switch (this.state.selectedRound) {
        case 1:
          round = this.props.selection.firstRound;
          break;
        case 2:
          round = this.props.selection.secondRound;
          break;
        default:
          break;
      }
    }
    return (
      <Container fluid>
        <Navigation selectedRound={this.state.selectedRound} onSelect={this.selectTab} />
        <Row>
          <Col md="6" sm="12">
            <RedirectToDashboard selectedRound={this.state.selectedRound} show={round && (!round.canConfirm && !round.confirmed)} />
            <ConfirmButton
              visible={round && round.canConfirm}
              onClick={this.onConfirmButtonClick}
              title='Click on the button to confirm your participation in the first round'
            />
            <div className="selection-main__block">
              <SelectionTable
                data={(round && round.participants) || []}
              />
            </div>
          </Col>
        </Row>

      </Container>
    );
  }
}

const RedirectToDashboard = ({show, selectedRound}) => {
  if (!show) {
    return null;
  }
  if (selectedRound === 2) {
    return null;
  }
  return (
    <span className="selection-main__submit-title">You need an API key on binance with net worth of 100$ to participate. <Link to="/dashboard">Add</Link></span>
  );
};

const Navigation = ({selectedRound, onSelect}) => {
  return (
    <div className="rating-navigation round">
      <span onClick={() => onSelect(1)} className={classNames({active: selectedRound === 1})}>Round 1</span>
      <span onClick={() => onSelect(2)} className={classNames({active: selectedRound === 2})}>Round 2</span>
    </div>
  );
};

const ConfirmButton = ({visible, title, onClick, round}) => {
  if (round === 2) {
    return null;
  }
  if (!visible) {
    return null;
  }
  return (
    <div>
      <div className="selection-main__submit">
        <span className="selection-main__submit-title">{title}</span>
        <button
          className="btn active"
          type="button"
          onClick={onClick}
        >
          <FormattedMessage id="selection.confirm" />
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = ({ selection }) => ({
  selection,
});

const mapDispatchToProps = {
  fetchSelection,
  confirmRound,
};

export default connect(mapStateToProps, mapDispatchToProps)(Selection);
