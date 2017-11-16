import React from 'react';
import classNames from 'classnames';

class Pagination extends React.Component {

  render() {
    const { page, onPageChange, canPrevious, canNext } = this.props;
    return (
      <div className="table_rewind_page">
        <div className="table_rewind_page_wrapper">
          <div
            onClick={() => {
              if(canPrevious) {
                onPageChange(page - 1);
              }
            }}
            className={classNames('table_prev_page', {disabled: !canPrevious})}>
            <div className="table_prev_page--button"/>
          </div>
          <div
            onClick={() => {
              if(canNext) {
                onPageChange(page + 1);
              }
            }}
            className={classNames('table_next_page', {disabled: !canNext})}>
            <div className="table_next_page--button"/>
          </div>
        </div>
      </div>
    );
  }
}

export default Pagination;
