import React from 'react';
import './SegmentedControl.css';
import { Desktop, Mobile } from '../generic/MediaQuery';
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
    return (
      <div>
        <Desktop>
          <div style={{width: (this.props.segmentWidth ?  this.props.segmentWidth : 80) * this.props.segments.length}} className={classNames('table_title_tabs_wr', this.props.className)}>
            {this.props.segments.map((segment, index) => (
              <div className={classNames('table_title_tab', {selected: index === this.props.selectedIndex})} data-index={index} onClick={this.onChange} key={segment}>{segment}</div>
            )
            )}
          </div>
        </Desktop>
        <Mobile>
          <div style={{width: (this.props.segmentWidth ?  this.props.segmentWidth : 65) * this.props.segments.length}} className={classNames('table_title_tabs_wr', this.props.className)}>
            {this.props.segments.map((segment, index) => (
              <div className={classNames('table_title_tab', {selected: index === this.props.selectedIndex})} data-index={index} onClick={this.onChange} key={segment}>{segment}</div>
            )
            )}
          </div>
        </Mobile>
      </div>

    );
  }
}
SegmentedControl.defaultProps = {
  selectedIndex: 0,
  segmentWidth: 0
};

export default SegmentedControl;
