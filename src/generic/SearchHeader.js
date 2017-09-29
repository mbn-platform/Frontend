import React from 'react';

const SearchHeader = (header, value, onFilter) => {
  return (
    <div className="table_header_wrapper">
      <span className="table_header">{header}</span>
      <div className="sort_icon_wrapper">
        <div className="green_arrow green_arrow_bottom" ></div>
      </div>
      <div className="table_filter_wrapper">
        <input
          value={value}
          onChange={onFilter}
          className="add_keys_field add_keys_field_name"
          placeholder="Search"
          onClick={stop}
        />
      </div>
    </div>
  );
};

function stop(e) {
  e.stopPropagation();
}

export default SearchHeader;
