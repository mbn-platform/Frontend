import React from 'react';
import { Col, Row } from 'reactstrap';
import { Desktop } from '../generic/MediaQuery';

class TradingView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullScreen: false
    };
  }

  render() {
    let classNames = 'price-chart chart';
    if (this.state.fullScreen) {
      classNames += ' fullscreen-chart';
    }
    return (
      <Col className={classNames}>
        <div className="price-chart__top justify-content-between row col-12">
          <Desktop>
            <Row className="chart-controls align-items-center justify-content-between">
              <div className="control-resize" onClick={()=>this.setState({fullScreen: !this.state.fullScreen})}></div>
            </Row>
          </Desktop>
        </div>
        <div className="price-chart__graph row col-12">
        </div>
      </Col>
    );
  }
}

export default TradingView;
