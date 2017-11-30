import React from 'react';

class Controls extends React.Component {

  render() {
    return (
      <div className="row dropdowns">
        <div className="dropdown-link-wrap">
          <a href="#" className="dropdown-link">API KEY <span className="arrow_down"></span></a>
          <div className="dropdown">
            <div className="dropdown__name">
              <span>API KEY</span>
              <span className="arrow_down"></span>
            </div>
            <div className="key">234hgerhg7y924rt318r1t2</div>
            <div className="key">rsogojrpej593yh3jh059hu</div>
            <div className="key">dfpjg934t0g9g3j3pvd;kg3</div>
          </div>
        </div>

        <div className="dropdown-link-wrap">
          <a href="#" className="dropdown-link">BITTREX <span className="arrow_down"></span></a>
          <div className="dropdown exchange">
            <div className="dropdown__name">
              <span>BITTREX</span>
              <span className="arrow_down"></span>
            </div>
            <div className="exchange__switch">Poloniex</div>
            <div className="exchange__switch">Bitfinex</div>
            <div className="exchange__switch active">BITTREX</div>
          </div>
        </div>

        <div className="dropdown-link-wrap">
          <a href="#" className="dropdown-link js-dropdown-table-link">BTC/ETH <span className="arrow_down"></span></a>
          <div className="dropdown search">
            <div className="dropdown__name">
              <span>BTC/ETH</span>
              <span className="arrow_down"></span>
            </div>
            <form action="" className="dropdown__form">
              <input type="text" name="" className="input-search" placeholder="Search..."/>
            </form>
            <div className="dropdown__btn-wrap">
              <button className="dropdown__btn active">BTC</button>
              <button className="dropdown__btn">ETH</button>
              <button className="dropdown__btn">USD</button>
            </div>

            <div className="dropdown-table-wrapper js-dropdown-table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Currency <span className="icon icon-dir icon-down-dir"></span></th>
                    <th>Price <span className="icon icon-dir icon-down-dir"></span></th>
                    <th>Volume <span className="icon icon-dir icon-down-dir"></span></th>
                    <th>Change <span className="icon icon-dir icon-down-dir"></span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="down">
                    <td>ETH</td>
                    <td>0.15</td>
                    <td>100000.86</td>
                    <td>-1.12</td>
                  </tr>
                  <tr className="down">
                    <td>XPR</td>
                    <td>6</td>
                    <td>9843.86</td>
                    <td>-1.12</td>
                  </tr>
                  <tr className="up">
                    <td>BCH</td>
                    <td>0.15</td>
                    <td>100000.86</td>
                    <td>+21</td>
                  </tr>
                  <tr className="down">
                    <td>STR</td>
                    <td>2</td>
                    <td>100000.86</td>
                    <td>-2</td>
                  </tr>
                  <tr className="down">
                    <td>ETH</td>
                    <td>0.14</td>
                    <td>9843.86</td>
                    <td>-1.12</td>
                  </tr>
                  <tr className="up">
                    <td>BCH</td>
                    <td>0.15</td>
                    <td>100000.86</td>
                    <td>+21</td>
                  </tr>
                  <tr className="up">
                    <td>BCH</td>
                    <td>0.25</td>
                    <td>100000.86</td>
                    <td>+21</td>
                  </tr>
                  <tr className="down">
                    <td>ETH</td>
                    <td>0.14</td>
                    <td>9843.86</td>
                    <td>-1.12</td>
                  </tr>
                  <tr className="down">
                    <td>ETH</td>
                    <td>0.14</td>
                    <td>9843.86</td>
                    <td>-1.12</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="dropdown-link-wrap">
          <a href="#" className="dropdown-link">1H <span className="arrow_down"></span></a>
          <div className="dropdown time">
            <div className="dropdown__name">
              <span>1h</span>
              <span className="arrow_down"></span>
            </div>
            <div className="time__switch">1 min</div>
            <div className="time__switch">30 min</div>
            <div className="time__switch active">1 h</div>
            <div className="time__switch">4 h</div>
            <div className="time__switch">12 h</div>
            <div className="time__switch">1 d</div>
            <div className="time__switch">1 w</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Controls;

