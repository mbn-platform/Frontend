import React from 'react';

class SegmentedControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {index: this.props.selectedIndex || 0};
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const index = parseInt(e.target.dataset.index);
    if(this.state.index !== index) {
      this.setState({index});
      if(this.props.onChange) {
        this.props.onChange(index);
      }
    }
  }

  render() {
    return (
      <div>
        {this.props.segments.map((segment, index) => (
          <span style={{backgroundColor: this.state.index == index ? 'white' : 'grey'}} data-index={index} onClick={this.onChange} key={segment}>{segment}</span>
        )
        )}
      </div>
    );
  }
}

export default SegmentedControl;
