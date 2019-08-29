import React from 'react';
import PropTypes from 'prop-types';

class OutsideClick extends React.Component {

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  handleClick = (e) => {
    if (!this.ref.current.contains(e.target)) {
      this.props.onOutsideClick();
    }
  }

  handleKey = (e) => {
    if (e.keyCode === 27) {
      this.props.onOutsideClick();
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick);
    document.addEventListener('keydown', this.handleKey);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick);
    document.removeEventListener('keydown', this.handleKey);
  }

  render() {
    return (
      <div ref={this.ref}>
        {this.props.children}
      </div>
    );
  }
}

OutsideClick.propTypes = {
  onOutsideClick: PropTypes.func.isRequired,
};

export default OutsideClick;
