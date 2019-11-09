import React from 'react';
import PropTypes from 'prop-types';

const GroupsSelect = ({
  titleClass, groups, itemClass, onChange,
  group, defaultPlaceholder, showAllOption,
}) => {
  const renderGroups = () => (
    groups.map(group => (
      <li
        value={group.name}
        key={group._id}
        className={`add_keys_select_li upper ${itemClass}`}
        onClick={onChange(group)}
      >
        {group.name}
      </li>
    ))
  );

  return (
    <div className="add_keys_select_wr group_select_wr">
      <div className={`add_keys_select_value upper upper ${titleClass}`}>
        {group ? group.name : defaultPlaceholder}
        <div className="add_keys_select_value_bg" />
      </div>
      <div className="add_keys_select_values_list_wr overflow_y_auto">
        <ul className="add_keys_select_ul">
          {showAllOption && (
            <li
              value={defaultPlaceholder}
              key={defaultPlaceholder}
              className="add_keys_select_li"
              onClick={onChange}
            >
              {defaultPlaceholder}
            </li>
          )}
          {renderGroups()}
        </ul>
      </div>
    </div>
  );
};

GroupsSelect.propTypes = {
  showAllOption: PropTypes.bool,
  defaultPlaceholder: PropTypes.string,
  titleClass: PropTypes.string,
  itemClass: PropTypes.string,
  group: PropTypes.shape({
    name: PropTypes.string,
    _id: PropTypes.string,
  }),
  groups: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onChange: PropTypes.func.isRequired,
};

GroupsSelect.defaultProps = {
  defaultPlaceholder: '',
  titleClass: '',
  itemClass: '',
  group: null,
  showAllOption: false,
};

export default GroupsSelect;
