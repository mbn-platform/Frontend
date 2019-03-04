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
      <a id="popUp" href={this.state.ref} className={`competition__container competition__container-${this.state.index}`}>
        {this.state.banner}
        <img src={this.state.image} alt="Competition" className="competition__icon"/>
        <span className="competition__closer" onClick={handleClick}></span>
      </a>
    );
  }
}
export default Banner;

function handleClick(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('popUp').classList.add('competition__container-hidden');
}

function getRandomBanner() {
  const index = Math.floor(Math.random() * bannerTexts.length);
  const banner = bannerTexts[index];
  const ref = `https://membrana.io/presale/?utm_source=beta_membrana_mobile&utm_medium=banner&utm_campaign=banner_mobile&utm_content=${index}`;
  let image;
  if (index === 2) {
    image = HappyTrader;
  } else {
    image = Lambo;
  }
  return { ref, banner, image, index };
}

const bannerTexts = [
  (<div className="competition__subtitle competition__title">
    <u>Get {getBonusPercent()}% bonus</u> on Membrana Platform presale!
  </div>),
  (<div className="competition__subtitle competition__title">
    Want passive income? <u>Join presale now</u> with {getBonusPercent()}% bonus!
  </div>),
  (<div className="competition__subtitle competition__title">
    Make <br /> smart invesmtent with {getBonusPercent()}% bonus. <u>Join presale now</u>!
  </div>),
];

function getBonusPercent() {
  return 20;
}
