import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import AmChartsReact from '@amcharts/amcharts3-react';
import { FormattedMessage } from 'react-intl';

import { Desktop, Mobile } from '../../generic/MediaQuery';
import { ProfileBlock } from '../../components/ProfileBlock';
import SegmentedControl from '../../components/SegmentedControl';
import ProfitSelect from './ProfitSelect';

class ProfitChart extends React.Component {

  static propTypes = {
    currentProfit: PropTypes.array.isRequired,
    stats: PropTypes.array.isRequired,
    summary: PropTypes.shape.isRequired,
  }

  state = {
    selectedSegment: 1,
    selectedCurrentContract: undefined,
  }

  onCurrentContractSelect = (contract) => {
    this.setState({selectedCurrentContract: contract});
  }

  onSegmentChange = (selectedSegment) => {
    this.setState({ selectedSegment });
  }

  componentDidUpdate() {
    if (!this.state.selectedCurrentContract && this.props.currentProfit && this.props.currentProfit.length !== 0) {
      this.setState({selectedCurrentContract: this.props.currentProfit[0]});
    }
  }

  segments = ['ALL', 'CURRENT']

  render() {
    const currentProfit = this.props.currentProfit || [];
    const {name } = this.props;
    const { selectedSegment, selectedCurrentContract } = this.state;
    const stats = this.props.stats || [];
    let data;
    let current;
    if (selectedSegment === 1) {
      current = true;
      const contractDataIndex = currentProfit.indexOf(selectedCurrentContract);
      if (contractDataIndex !== -1) {
        const contractData = stats[contractDataIndex];
        if (contractData) {
          data = [contractData];
        } else {
          data = [];
        }
      } else {
        data = [];
      }
    } else {
      current = false;
      data = stats;
    }
    const { negative, positive, avg6: average } = (this.props.summary || {});
    return (
      <ProfileBlock
        iconClassName='icon-005-growth'
        title='profile.profitChart'
        className='graphic'
        titleComponent={<ProfitChartTitle
          current={current}
          selectedProfit={selectedCurrentContract}
          onCurrentProfitSelect={this.onCurrentContractSelect}
          currentProfit={currentProfit || []} />}
      >
        <Row className="justify-content-center d-flex">
          {currentProfit.length === 0 && selectedSegment === 1 ? (
            <Col xs="12" md="9"
              className="d-flex justify-content-center align-items-center chart-contracts-empty"
            >
              {name && (
                <FormattedMessage
                  id="profile.traderHasNoContract"
                  values={{ name: name.toUpperCase() }}
                />
              )}
            </Col>
          ) : (

            <Col xs={{size: 12, order: 2}} md="9">
              <div className="amcharts">
                <ProfitGraphicContainer data={data} />
              </div>
            </Col>
          )}
          <Col xs={{size: 12, order: 3}} md="3" className='legend'>
            <ProfitChartStat
              average={average || 0}
              negative={negative || 0}
              positive={positive || 0}
              currentProfit={currentProfit || []}
            />
          </Col>
          <Col xs={{order: 1}} md={{order: 3}}>
            <Desktop>
              <SegmentedControl
                segments={this.segments}
                selectedIndex={selectedSegment}
                onChange={this.onSegmentChange} />
            </Desktop>
            <Mobile>
              <SegmentedControl
                segments={this.segments}
                segmentWidth={50}
                selectedIndex={selectedSegment}
                onChange={this.onSegmentChange} />
            </Mobile>
          </Col>
        </Row>
      </ProfileBlock>
    );
  }
}

class ProfitChartTitle extends React.Component {
  static propTypes = {
    current: PropTypes.bool.isRequired,
    currentProfit: PropTypes.array.isRequired,
    onCurrentProfitSelect: PropTypes.func.isRequired,
    selectedProfit: PropTypes.object,
  }

  render() {
    if (this.props.current) {
      if (this.props.currentProfit.length === 0 || !this.props.selectedProfit) {
        return <FormattedMessage className="title" id="profile.noContracts" />;
      } else {
        return (
          <React.Fragment>
            <FormattedMessage className="title" id="profile.profitChartCurrent" values={{
              name:          <ProfitSelect
                targetId="profit-select-chart"
                profits={this.props.currentProfit}
                selectedProfit={this.props.selectedProfit}
                onItemSelect={this.props.onCurrentProfitSelect}
              />,
            }}/>
          </React.Fragment>
        );
      }
    } else {
      return <FormattedMessage className="title" id="profile.profitChart"/>;
    }
  }
}


class ProfitChartStat extends React.PureComponent {

  static propTypes = {
    average: PropTypes.number.isRequired,
    positive: PropTypes.number.isRequired,
    negative: PropTypes.number.isRequired,
    currentProfit: PropTypes.array.isRequired,
  }
  render() {
    const { average, positive, negative, currentProfit } = this.props;
    const currentCount = currentProfit.length;
    return (
      <div className="values">
        {currentCount > 0 ?
          <div>Profit per current contract: {currentProfit.map((v) => v.percent.toFixed(2) + '%').join(' / ')}</div>
          : null
        }
        <div>Profit per all contracts in total: {average.toFixed(2)}%</div>
        <div>Contracts with positive profit: {positive}</div>
        <div>Contracts with negative profit: {negative}</div>
      </div>
    );
  }
}

class ProfitGraphicContainer extends React.PureComponent {

  static propTypes = {
    data: PropTypes.array.isRequired,
  }

  createConfig() {
    const data = this.props.data;
    const graphIds = [];
    const dataProvider = [];
    data.forEach(({_id, points, start, sum, c}) => {
      graphIds.push(_id);
      dataProvider.push({
        c,
        id: _id,
        start,
        sum,
        [_id]: 0,
        date: new Date(start).getTime(),
        value: 0,
      });
      let lastAdded;
      points.forEach((p) => {
        if (!lastAdded || true ||
          p.date - lastAdded.date > 86400000) {
          dataProvider.push({
            c,
            id: _id,
            start,
            sum,
            [_id]: p.percent,
            date: p.date,
            value: p.percent,
          });
          lastAdded = p;
        }
      });
      if (lastAdded && lastAdded !== points[points.length - 1]) {
        const last = points[points.length - 1];
        dataProvider.push({
          c,
          id: _id,
          start,
          sum,
          [_id]: last.percent,
          date: last.date,
          value: last.percent,
        });
      }
    });
    const graphs = graphIds.map((id) => {
      return {
        id: id,
        yField: id,
        xField: 'date',
        lineAlpha: 1,
        lineThickness: 2,
        lineColor: '#cfa925',
        balloonFunction: this.balloonFunction,
        bullet: 'round',
        bulletSize: 1,
        bulletAlpha: 0,
        type: 'step',
      };
    });
    let maximum = dataProvider.reduce((a, b) => a > b.value ? a : b.value, 5);
    const minimum = dataProvider.reduce((a, b) => a < b.value ? a : b.value, -5);
    return {
      type: 'xy',
      theme: 'none',
      color: '#6f6f71',
      hideCredits: true,
      fontFamily: 'maven_proregular',
      marginRight: 80,
      dataDateFormat: 'YYYY-MM-DD',
      startDuration: 0,
      trendLines: [],
      balloon: {
        adjustBorderColor: false,
        shadowAlpha: 0,
        fixedPosition:true
      },
      chartCursor: {
        cursorColor: '#c74949',
        showBalloon: true,
        valueLineBalloonEnabled: true,
        valueLineEnabled: true,
        listeners: [
        ],
      },
      graphs,
      valueAxes: [{
        id: 'ValueAxis-1',
        title: 'Contract profit, %',
        position: 'right',
        maximum,
        minimum,
        axisAlpha: 0
      }, {
        id: 'ValueAxis-2',
        axisAlpha: 1,
        position: 'bottom',
        type: 'date',
        stackType: '3d',

      }],
      listeners: [{
        event: 'rendered',
        method: function({type, chart}) {
          chart.zoomOut();
        },
      }],
      allLabels: [],
      titles: [],
      dataProvider,
      zoomOutOnDataUpdate: false,
      pathToImages: 'http://cdn.amcharts.com/lib/3/images/',
      zoomOutText: 'Zoom out',
      zoomOutButtonAlpha: 0,
      zoomOutButtonColor: '#fff',
      zoomOutButtonImage: 'lensWhite',
      zoomOutButtonRollOverAlpha: 0.1,
    };
  }

  render() {
    return (
      <AmChartsReact.React
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'transparent',
          position: 'absolute',
        }}
        options={this.createConfig()}
      />
    );
  }
}

export default ProfitChart;
