import React from 'react';
import ReactTable, { ReactTableDefaults } from 'react-table';
//import 'react-table/react-table.css';
import './SelectableReactTable.css';
import Scrollbars from 'react-custom-scrollbars';

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

    const getTbodyProps = (state, rowInfo, column, instance) => {
      return {scrollBarHeight: instance.props.scrollBarHeight};
    };
    return (
      <ReactTable
        noDataText=''
        resizable={false}
        showPagination={false}
        minRows={0}
        defaultPageSize={9999}
        getTrProps={getTrProps}
        getTheadProps={getTheadProps}
        getTbodyProps={getTbodyProps}
        TbodyComponent={CustomTBodyComponent}
        scrollBarHeight={200}
        defaultFilterMethod={this.defaultFilterMethod}
        {...this.props}
      />
    );
  }

  defaultFilterMethod(filter, row, column) {
    const id = filter.pivotId || filter.id;
    const rowValue = row[id];
    if(rowValue === undefined) {
      return true;
    } else {
      return rowValue.toLowerCase().indexOf(filter.value.toLowerCase()) !== -1;
    }
  }


}

const CustomTBodyComponent = (props) => {
  const { TbodyComponent } = ReactTableDefaults;
  let {scrollBarHeight, ...rest} = props;
  return (
    <Scrollbars style={{height: scrollBarHeight }}>
      <TbodyComponent {...rest} />
    </Scrollbars>
  );

};

export default SelectableReactTable;
