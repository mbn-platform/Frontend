import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import HeaderStatus from '../terminal/HeaderStatus';
import Controls from './Controls';
import HistoryTable from './HistoryTable';
import { connect } from 'react-redux';

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
}))(History);

export default HistoryContainer;
