import React from 'react';
import { Col, Row } from 'reactstrap';
import { Desktop } from '../generic/MediaQuery';
import classNames from 'classnames';
import {ESCAPE_KEYCODE} from '../constants';



class TradingView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullScreen: false
    };
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentWillMount(){
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleFullScreenChange(value) {
    this.setState({fullScreen: value});
    this.props.onFullScreenChange(value);
  }

  handleKeyDown(event) {
    if (this.state.fullScreen && event.keyCode === ESCAPE_KEYCODE) {
      this.handleFullScreenChange(false);
    }
  }

  render() {
    return (
      <Col className={classNames('price-chart','chart', {'fullscreen-chart': this.state.fullScreen})}>
        <div className="price-chart__top justify-content-between row col-12">
          <Desktop>
            <Row className="chart-controls align-items-center justify-content-between">
              <div className="control-resize" onClick={()=>this.handleFullScreenChange(!this.state.fullScreen)}></div>
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
