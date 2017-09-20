import React from 'react';

const SearchFilter = ({filter, onChange}) => (
  <div>
    <input
      className="add_keys_field add_keys_field_name"
      placeholder="Search"
      onChange={event => onChange(event.target.value)}
      value={filter ? filter.value : ''}
    />
  </div>
);

export default SearchFilter;
