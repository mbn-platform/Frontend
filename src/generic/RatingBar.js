import React from 'react';
import './RatingBar.css';

class RatingBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selected: false, rating: props.rating, hover: -1};
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
    const props = {
      className: 'rating_bar'
    };
    if(this.props.selectable) {
      props.onMouseLeave = this.onMouseLeave;
    }
    return (
      <div {...props} >
        {this.renderStars()}
      </div>
    );
  }
  renderStars() {
    const stars = [];
    for(let i = 0; i < this.props.numberOfStars; i++) {
      const className = this.state.hover >= i || this.state.rating > i ? 'rating_bar_item hover' : 'rating_bar_item';
      const props = {};
      if(this.props.selectable) {
        props.onClick =  () => this.onClick(i);
        props.onMouseEnter = () => this.onMouseEnter(i);
      }
      const comp = (
        <div
          key={i}
          className={className}
          {...props}
        >
        </div>
      );
      stars.push(comp);
    }
    return stars;
  }
}

RatingBar.defaultProps = {
  numberOfStars: 5,
  rating: 0,
  selectable: true
};

export default RatingBar;
