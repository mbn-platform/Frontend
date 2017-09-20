import React from 'react';
import './RatingBar.css';

class RatingBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selected: false, rating: 0, hover: -1};
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onClick(index) {
    this.setState({selected: true, rating: index + 1});
    if(this.props.onRatingSelected) {
      this.props.onRatingSelected(index + 1);
    }
  }

  onMouseEnter(index) {
    this.setState({hover: index});

  }
  onMouseLeave(index) {
    this.setState({hover: -1});
  }

  render() {
    return (
      <div className="rating_bar" onMouseLeave={this.onMouseLeave} >
        {this.renderStars()}
      </div>
    );
  }
  renderStars() {
    const stars = [];
    for(let i = 0; i < this.props.numberOfStars; i++) {
      const className = this.state.hover >= i || this.state.rating > i ? 'rating_bar_item hover' : 'rating_bar_item';
      const comp = (
        <div
          key={i}
          className={className}
          onClick={() => this.onClick(i)}
          onMouseEnter={() => this.onMouseEnter(i)}
        >
        </div>
      );
      stars.push(comp);
    }
    return stars;
  }
}

RatingBar.defaultProps = {
  numberOfStars: 5
};

export default RatingBar;
