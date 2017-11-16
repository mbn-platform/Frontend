import React from 'react';
import './SegmentedControl.css';
import classNames from 'classnames';

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
    const width = this.props.segmentWidth * this.props.segments.length;
    const style = {width};
    return (
      <div style={style} className={classNames('table_title_tabs_wr', this.props.className)}>
        {this.props.segments.map((segment, index) => (
          <div className={classNames('table_title_tab', {selected: index === this.props.selectedIndex})} data-index={index} onClick={this.onChange} key={segment}>{segment}</div>
        )
        )}
      </div>
    );
  }
}
function mobileWidth() {
  return window.outerWidth < 1028;
}
SegmentedControl.defaultProps = {
  selectedIndex: 0,
  segmentWidth: mobileWidth() ? 65 : 80,
};

export default SegmentedControl;
