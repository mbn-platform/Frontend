import React from 'react';
import PropTypes from 'prop-types';

const GroupRow = ({
  value, amount, expireDate, onSelect, onDelete,
}) => (
  <div
    className="asset_group_row"
    onClick={onSelect}
  >
    <span className="asset_group_row_title">{value}</span>
    {amount && <span>{amount}</span>}
    {expireDate && <span>{expireDate}</span>}
    <div
      className="delete_key_button"
      onClick={onDelete}
    />
  </div>
);

GroupRow.defaultProps = {
  amount: null,
  expireDate: null,
  onSelect: () => {},
  onDelete: () => {},
};

GroupRow.propTypes = {
  amount: PropTypes.string,
  expireDate: PropTypes.string,
  onSelect: PropTypes.func,
  onDelete: PropTypes.func,
  value: PropTypes.string.isRequired,
};

export default GroupRow;
