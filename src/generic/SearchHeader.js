import React from 'react';

const SearchHeader = (header, value, onFilter) => {
  return () => {
    return (
      <div>
        <div className="table_header">{header}<div className="sort_triangle"></div></div>
        <div className="table_filter_wrapper">
          <input
            value={value}
            onChange={onFilter}
            className="add_keys_field add_keys_field_name"
            placeholder="Search"
            onClick={e => e.stopPropagation()}
          />
        </div>
      </div>
    );
  };
};

export default SearchHeader;
