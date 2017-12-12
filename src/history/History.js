import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import HeaderStatus from '../terminal/HeaderStatus';
import Controls from './Controls';
import HistoryTable from './HistoryTable';
import { connect } from 'react-redux';
import { selectApiKey } from '../actions/terminal';

class History extends React.Component {

  render() {
    return (
      <Container fluid className="history">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <HeaderStatus />
            <div className="history-main">
              <div className="history-main__top">
                <div className="row  align-items-center">
                  <div className="history-main__title"> History</div>
                </div>
                <Controls
                  apiKeys={[...this.props.apiKeys.ownKeys, ...this.props.apiKeys.receivedKeys]}
                  selectedApiKey={this.props.selectedApiKey}
                  onApiKeySelect={key => this.props.selectApiKey(key)}
                />
              </div>
              <HistoryTable />
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
  componentDidMount() {
    window.customize();
  }

  componentWillUnmount() {
    window.uncustomize();
  }
}


const HistoryContainer = connect(state => ({
  apiKeys: state.apiKeys,
  selectedApiKey: state.terminal.selectedApiKey,
}), dispatch => ({
  selectApiKey: key => dispatch(selectApiKey(key)),
}))(History);

export default HistoryContainer;
