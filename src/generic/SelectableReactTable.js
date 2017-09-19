import React from 'react';
import ReactTable, { ReactTableDefaults } from 'react-table';
//import 'react-table/react-table.css';
import './SelectableReactTable.css';

class SelectableReactTable extends React.Component {
  render() {
    const getTheadProps = () => ({className: 'clearfix'});
    const getTrProps = (state, rowInfo, column, instance) => {
      let className;
      if(this.props.selectedItem && this.props.selectedItem._id === rowInfo.original._id) {
        className = '-selected';
      }
      return {
        className,
        onClick: ()  => {
          this.props.onItemSelected(rowInfo.original);
        }
      };
    };
    return (
      <ReactTable
        noDataText=''
        resizable={false}
        showPagination={false}
        minRows={0}
        getTrProps={getTrProps}
        getTheadProps={getTheadProps}
        TbodyComponent={CustomTBodyComponent}
        {...this.props}
      />
    );
  }
}

const CustomTBodyComponent = (props) => {
  const { TbodyComponent } = ReactTableDefaults;
  return (
    <TbodyComponent {...props} />
  );

}

export default SelectableReactTable;
