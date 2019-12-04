import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';

import { fetchSelection } from '../../../actions/selection';
import SelectionTable from './SelectionTable';

const FIRST_ROUND_DATE = '9.12 - 13.12';
const SECOND_ROUND_DATE = '16.12 - 22.12';

class Selection extends React.Component {
  componentDidMount = () => {
    this.props.fetchSelection();
  };

  render = () => (
    <Container fluid>
      <Row>
        <Col md="6" sm="12">
          <div className="selection-main__title">
            {FIRST_ROUND_DATE}
          </div>
          <div className="selection-main__block">
            <SelectionTable
              data={this.props.selection}
            />
          </div>
        </Col>
        <Col md="6" sm="12">
          <div className="selection-main__title">
            {SECOND_ROUND_DATE}
          </div>
          <div className="selection-main__block">
            <SelectionTable
              data={this.props.selection}
            />
          </div>
        </Col>
      </Row>
      <div className="selection-main__submit">
        <button
          className="btn active"
          type="button"
          onClick={() => {}}
        >
          <FormattedMessage id="selection.confirm" />
        </button>
      </div>
    </Container>
  );
}

const mapStateToProps = ({ selection }) => ({
  selection,
});

const mapDispatchToProps = {
  fetchSelection,
};

export default connect(mapStateToProps, mapDispatchToProps)(Selection);
