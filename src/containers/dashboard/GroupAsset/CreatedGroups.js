import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ReactTable from 'react-table';

import { getAssetGroups, deleteAssetGroup } from '../../../actions/assetGroup';
import GroupRow from './GroupRow';

class CreatedGroups extends React.Component {
  static propTypes = {
    assetGroups: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    getAssetGroups: PropTypes.func.isRequired,
    selectAssetGroup: PropTypes.func.isRequired,
    deleteAssetGroup: PropTypes.func.isRequired,
  };

  columns = [
    {
      id: 'name',
      className: 'table_col_value',
      accessor: c => c.name,
      Cell: ({ value, original }) => (
        <GroupRow
          value={value}
          onSelect={this.onGroupSelect(original)}
          onDelete={this.onGroupDelete(original._id)}
        />
      ),
    },
  ];

  componentDidMount = () => {
    this.props.getAssetGroups();
  };

  onGroupSelect = (group) => () => {
    this.props.selectAssetGroup(group);
  };

  onGroupDelete = (id) => (event) => {
    event.stopPropagation();
    this.props.deleteAssetGroup(id);
  };

  render = () => (
    <div className="created-groups-table-wrapper table table-wrapper">
      <div className="table_title_wrapper">
        <div className="table_title">
          <FormattedMessage id="dashboard.createdGroups" />
        </div>
      </div>
      <ReactTable
        style={{ height: 310 }}
        columns={this.columns}
        data={this.props.assetGroups}
      />
    </div>
  );
};

const mapDispatchToProps = {
  getAssetGroups,
  deleteAssetGroup,
};

export default connect(null, mapDispatchToProps)(CreatedGroups);
