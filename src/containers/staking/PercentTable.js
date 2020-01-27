import React from 'react';
import PropTypes from 'prop-types';

const stackingData = [
  ['jan20’-dec20’', [0.35, 0.35, 0.46, 0.7], [1.5, 1.5, 2, 3], [20, 20, 27, 43], [0, 10, 10, 15], new Date('2020-01-01'), new Date('2021-01-01')],
];

const globalPool = [
  ['jan20’-dec20’', [0.29, 0.29, 0.38, 0.6], [1.24, 1.24, 1.67, 2.4], [16, 16, 22, 36], [0, 10, 10, 15], new Date('2020-01-01'), new Date('2021-01-01')],
];

const PercentTable = ({ now, early }) => {
  const data = early ? stackingData : globalPool;

  return (
    <div style={{overflowX: 'auto'}}>
      <table>
        <thead>
          <tr>
            <th style={{width: '140px'}}>Timeline</th>
            <th>weekly</th>
            <th>monthly</th>
            <th>annually</th>
            <th style={{width: '140px', whiteSpace: 'unset'}}>COF profit reward (ETH payments)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => {
            let className;

            const until = d[6];
            if ((now - until) > 0) {
              className = 'stale';
            } else if (now - d[5] > 0) {
              className = 'active';
            }
            return (
              <tr className={className} key={i}>
                <td>{d[0]}</td>
                <td>
                  <div>Lvl 1 - {d[1][0]}%</div>
                  <div>Lvl 2 - {d[1][1]}%</div>
                  <div>Lvl 3 - {d[1][2]}%</div>
                  <div>Lvl 4 - {d[1][3]}%</div>
                </td>
                <td>
                  <div>Lvl 1 - {d[2][0]}%</div>
                  <div>Lvl 2 - {d[2][1]}%</div>
                  <div>Lvl 3 - {d[2][2]}%</div>
                  <div>Lvl 4 - {d[2][3]}%</div>
                </td>
                <td>
                  <div>Lvl 1 - {d[3][0]}%</div>
                  <div>Lvl 2 - {d[3][1]}%</div>
                  <div>Lvl 3 - {d[3][2]}%</div>
                  <div>Lvl 4 - {d[3][3]}%</div>
                </td>
                <td>
                  <div>Lvl 1 - {d[4][0]}%</div>
                  <div>Lvl 2 - {d[4][1]}%</div>
                  <div>Lvl 3 - {d[4][2]}%</div>
                  <div>Lvl 4 - {d[4][3]}%</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

PercentTable.defaultProps = {
  now: Date.now(),
  early: false,
};

PercentTable.propTypes = {
  now: PropTypes.number,
  early: PropTypes.bool,
};

export default PercentTable;
