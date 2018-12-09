import React from 'react';
import './Competition.css';
import Lambo from '../../assets/img/Lambo.png';
import HappyTrader from '../../assets/svg/HappyTrader.svg';

class Banner extends React.Component {

  constructor(props) {
    super(props);
    this.state = getRandomBanner();
  }

  render() {
    return (
      <a href={this.state.ref} className="competition__container">
        {this.state.banner}
        <img src={this.state.image} alt="Competition" className="competition__icon"/>
      </a>
    );
  }
}
export default Banner;

function getRandomBanner() {
  const index = Math.floor(Math.random() * bannerTexts.length);
  const banner = bannerTexts[index];
  const ref = `https://membrana.io/presale/?utm_source=beta_membrana_mobile&utm_medium=banner&utm_campaign=banner_mobile&utm_content=${index}`;
  let image;
  if (index === 2) {
    image = Lambo;
  } else {
    image = HappyTrader;
  }
  return { ref, banner, image };
}

const bannerTexts = [
  (<div className="competition__subtitle competition__title">
    <u>Get {getBonusPercent()}% bonus</u> on Membrana Platform presale!
  </div>),
  (<div className="competition__subtitle competition__title">
    Want passive income? <u>Join presale now</u> with {getBonusPercent()}% bonus!
  </div>),
  (<div className="competition__subtitle competition__title">
    Make smart invesmtent with {getBonusPercent()}% bonus. <u>Join presale now</u>!
  </div>),
];

function getBonusPercent() {
  const date = Date.now();
  if (date < 1544486400000) {
    return 70;
  } else if (date < 1545696000000) {
    return 50;
  } else if (date < 1546905600000) {
    return 35;
  } else if (date < 1548115200000) {
    return 30;
  } else {
    return 25;
  }
}
