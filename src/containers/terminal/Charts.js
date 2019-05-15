import classNames from 'classnames';
import React from 'react';
import { Col } from 'reactstrap';
import { ChartsHeader } from './ChartsHeader';
import TradingView from './TradingView';
import MarketDepth from './MarketDepth';

class Charts extends React.Component {

  state = {
    selectedTab: ChartsHeader.tabs[0],
    fullScreen: false,
  }


  render() {
    return (
      <Col className={classNames('price-chart','chart', {'fullscreen-chart': this.props.fullScreen})}>
        <ChartsHeader
          onClick={(tab) => this.setState({selectedTab: tab})}
          selectedTab={this.state.selectedTab}
        />
        {this.renderComponent()}
      </Col>
    );
  }
  renderComponent() {
    switch (this.state.selectedTab) {
      case ChartsHeader.tabs[0]:
        return <TradingView
          fullScreen={this.props.fullScreen}
          onFullScreenChange={this.props.onFullScreenChange} />;
      case ChartsHeader.tabs[1]:
        return <MarketDepth />;
      default:
        return null;
    }
  }
}

export default Charts;
