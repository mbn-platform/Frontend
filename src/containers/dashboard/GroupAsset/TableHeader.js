import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

const TableHeader = ({ header }) => (
  <div className="table_header_wrapper groups_header_wrapper">
    <div className="table_header">
      <FormattedMessage {...header} />
    </div>
    <div className="sort_icon_wrapper">
      <div className="green_arrow" />
    </div>
  </div>
);

TableHeader.propTypes = {
  header: PropTypes.shape({
    id: PropTypes.string.isRequired,
    values: PropTypes.shape(),
  }).isRequired,
};

export default TableHeader;
