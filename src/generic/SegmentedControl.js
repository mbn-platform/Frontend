import React from 'react';
import './SegmentedControl.css';

class SegmentedControl extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.selectedIndex !== this.props.selectedIndex;
  }

  onChange(e) {
    const index = parseInt(e.target.dataset.index, 10);
    if(this.props.selectedIndex !== index) {
      if(this.props.onChange) {
        this.props.onChange(index);
      }
    }
  }

  render() {
    return (
      <div className="table_title_tabs_wr">
        {this.props.segments.map((segment, index) => (
          <div className={classNameForTab(this.props.selectedIndex, index)} data-index={index} onClick={this.onChange} key={segment}>{segment}</div>
        )
        )}
      </div>
    );
  }
}

SegmentedControl.defaultProps = {
  selectedIndex: 0
}

function classNameForTab(selectedIndex, tabIndex) {
  if(selectedIndex === tabIndex) {
    return 'table_title_tab selected';
  } else {
    return 'table_title_tab';
  }
}

export default SegmentedControl;
