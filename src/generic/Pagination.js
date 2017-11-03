import React from 'react';
import classNames from 'classnames';

class Pagination extends React.Component {

  render() {
    const { page, onPageChange } = this.props;
    return (
      <div className="table_rewind_page">
        <div className="table_rewind_page_wrapper">
          <div
            onClick={() => {
              if(this.props.canPrevious) {
                this.props.onPageChange(page - 1);
              }
            }}
            className={classNames('table_prev_page', {disabled: !this.props.canPrevious})}>
            <div className="table_prev_page--button"/>
          </div>
          <div
            onClick={() => {
              if(this.props.canNext) {
                this.props.onPageChange(page + 1);
              }
            }}
            className={classNames('table_next_page', {disabled: !this.props.canNext})}>
            <div className="table_next_page--button"/>
          </div>
        </div>
      </div>
    );
  }
}

export default Pagination;
