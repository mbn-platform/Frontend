import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

const GroupRow = ({
  value, amount, onSelect, onDelete,
}) => (
  <div
    className="asset_group_row"
    onClick={onSelect}
  >
    <span className="asset_group_row_title">{value}</span>
    {amount && <span>{amount}</span>}
    <div
      className="asset_group_row_delete"
      onClick={onDelete}
    >
      <FormattedMessage id="dashboard.delete" />
    </div>
  </div>
);

GroupRow.defaultProps = {
  amount: null,
  onSelect: () => {},
};

GroupRow.propTypes = {
  amount: PropTypes.string,
  onSelect: PropTypes.func,
  value: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default GroupRow;
