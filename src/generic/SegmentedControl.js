import React from 'react';
import './SegmentedControl.css';

class SegmentedControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {index: this.props.selectedIndex || 0};
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const index = parseInt(e.target.dataset.index, 10);
    if(this.state.index !== index) {
      this.setState({index});
      if(this.props.onChange) {
        this.props.onChange(index);
      }
    }
  }

  render() {
    return (
      <div className="table_title_tabs_wr">
        {this.props.segments.map((segment, index) => (
          <div className={classNameForTab(this.state.index, index)} data-index={index} onClick={this.onChange} key={segment}>{segment}</div>
        )
        )}
      </div>
    );
  }
}

function classNameForTab(selectedIndex, tabIndex) {
  if(selectedIndex === tabIndex) {
    return 'table_title_tab selected';
  } else {
    return 'table_title_tab';
  }
}

export default SegmentedControl;
