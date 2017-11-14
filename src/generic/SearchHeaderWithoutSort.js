import React from 'react';

const SearchHeaderWithoutSort = (header, value, onFilter) => {
  return (
    <div className="table_header_wrapper">
      <div className="table_header_wrapper__align">
        <span className="table_header">{header}</span>
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
    </div>
  );
};

function stop(e) {
  e.stopPropagation();
}

export default SearchHeaderWithoutSort;
