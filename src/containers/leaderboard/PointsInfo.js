import React from 'react';
import { FormattedMessage } from 'react-intl';
import ReactTable from '../../components/SelectableReactTable';

const infoTableData= [
  {
    place:'1',
    point: '100'
  },{
    place:'2',
    point: '75'
  },{
    place:'3',
    point: '50'
  },{
    place:'4',
    point: '35'
  },{
    place:'5',
    point: '25'
  },{
    place:'6-10',
    point: '15'
  },{
    place:'11-20',
    point: '10'
  },{
    place:'21-50',
    point: '5'
  },{
    place:'51-100',
    point: '3'
  },{
    place:'101+',
    point: '1'
  }];

class PointsInfo extends React.Component {

  render() {
    const { screenWidth } = this.props;
    return (
      <div>
        <div className="leaderboard__title">
          <FormattedMessage id="leaderboard.infoTitle" defaultMessage="How many tokens I will earn from postions at the Leaderboard"/>
        </div>
        <div className="leaderboard__annotation">
          <FormattedMessage
            id="leaderboard.annotationInfo"
            defaultMessage="After each round of the competition, every participant receives Tournament Points according the their weekly ratings. The exact amount of points is shown in the table below. After all rounds of competition those Points will be converted into MBN tokens in rate 1/1000.{br}For example, Alice took 1st position at weekly round. She will earn 100*1000 = 100 000 tokens. {dashedTokens}"
            values={{br: <br/>,
              dashedTokens: <span
                title={this.props.intl.messages['leaderboard.ifHardcapWillReached']}
                style={{borderBottom: '1px dashed'}}>
                <FormattedMessage
                  id="leaderboard.dashedTokens"
                  defaultMessage="1000 tokens = $15"
                />
              </span>,
            }}
          />
        </div>
        <ReactTable
          columns={[
            {
              Header: <div
                className="table__header-wrapper">
                <FormattedMessage
                  id="leaderboard.placeInRating"
                  defaultMessage="Place In Rating"
                />
              </div>,
              minWidth: screenWidth === 'lg' ? 80 : 40,
              className: 'ratings__table-cell',
              accessor: 'place',
            },
            {
              Header: <div
                className="table__header-wrapper">
                <FormattedMessage
                  id="leaderboard.pointCount"
                  defaultMessage="Point Count"
                />
              </div>,
              accessor: 'point',
              minWidth: screenWidth === 'lg' ? 80 : 40,
              className: 'ratings__table-cell',
            }
          ]}
          data={infoTableData}
          scrollBarHeight={300}
        />
      </div>
    );
  }

}

export default PointsInfo;
