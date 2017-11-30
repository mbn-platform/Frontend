import React from 'react';

class Controls extends React.Component {
  render() {
    return (
      <div className="row dropdowns pt-2">
        <div className="dropdown-link-wrap mr-3">
          <a href="#" className="dropdown-link">API KEY: rsogojrpej593yh3jh059hu <span className="arrow_down"></span></a>
          <div className="dropdown keys">
            <div className="dropdown__name">
              <span>API KEY</span>
              <span className="arrow_down"></span>
            </div>
            <div className="key">234hgerhg7y924rt318r1t2</div>
            <div className="key active">rsogojrpej593yh3jh059hu</div>
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
      </div>
    );
  }
}

export default Controls;
