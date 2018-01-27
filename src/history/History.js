import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import HeaderStatus from '../terminal/HeaderStatus';
import Controls from './Controls';
import HistoryTable from './HistoryTable';
import { connect } from 'react-redux';
import { fetchDashboardData } from '../actions/dashboard';
import { getMyOrders } from '../actions/terminal';

class History extends React.Component {

  constructor(props) {
    super(props);
    this.state = {selectedApiKey: this.props.selectedApiKey || this.allowedApiKeys(props.apiKeys, props.contracts)[0]};
    this.update = this.update.bind(this);
  }

  update() {
    if(this.state.selectedApiKey) {
      this.props.getMyOrders(this.state.selectedApiKey);
    }
    this.timeout = setTimeout(this.update, 5000);
  }

  allowedApiKeys(apiKeys, contracts) {
    const allowedOwnKeys = apiKeys.ownKeys;
    const allowedReceivedKeys = apiKeys.receivedKeys.filter(k => {
      const contract = contracts.find(c => c.keyId === k._id);
      return !!contract;
    });
    return allowedOwnKeys.concat(allowedReceivedKeys);
  }

  componentWillReceiveProps(props) {
    if(props.apiKeys !== this.props.apiKeys) {
      const allowed = this.allowedApiKeys(props.apiKeys, props.contracts);
      let key;
      if(this.state.selectedApiKey) {
        key = allowed.find(k => k._id === this.state.selectedApiKey._id) || allowed[0];
      } else {
        key = allowed[0];
      }
      this.setState({selectedApiKey: key});
    }
  }

  componentDidUpdate(props, prevState) {
    if(this.state.selectedApiKey && (!prevState.selectedApiKey || this.state.selectedApiKey._id !== prevState.selectedApiKey._id)) {
      clearTimeout(this.timeout);
      this.update();
    }
  }

  render() {
    const allowed = this.allowedApiKeys(this.props.apiKeys, this.props.contracts);
    return (
      <Container fluid className="history">
        <Row>
          <Col xs="12" sm="12" md="12" lg="12">
            <HeaderStatus
              apiKey={this.state.selectedApiKey}
              market={this.props.selectedMarket}
            />
            <div className="history-main">
              <div className="history-main__top">
                <div className="row  align-items-center">
                  <div className="history-main__title"> History</div>
                </div>
                <Controls
                  apiKeys={allowed}
                  selectedApiKey={this.state.selectedApiKey}
                  onApiKeySelect={key => this.setState({selectedApiKey: key})}
                />
              </div>
              <HistoryTable 
                history={this.props.history}
              />
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
  componentDidMount() {
    window.customize();
    this.update();
    this.keysUpdatesTimeout = setInterval(() => this.props.fetchDashboardData(), 5000);
    this.props.fetchDashboardData();
  }

  componentWillUnmount() {
    window.uncustomize();
    clearTimeout(this.timeout);
    clearInterval(this.keysUpdatesTimeout);
  }
}


const HistoryContainer = connect(state => ({
  apiKeys: state.apiKeys,
  contracts: state.contracts.current,
  selectedApiKey: state.terminal.selectedApiKey,
  selectedMarket: state.terminal.selectedMarket,
  history: state.terminal.orders.completed,
}), dispatch => ({
  fetchDashboardData: () => dispatch(fetchDashboardData()),
  getMyOrders: key => dispatch(getMyOrders(key)),
}))(History);


export default HistoryContainer;
