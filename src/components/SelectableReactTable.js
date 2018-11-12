import React from 'react';
import ReactTable, { ReactTableDefaults } from 'react-table';
import Scrollbars from 'react-custom-scrollbars';

class SelectableReactTable extends React.Component {
  render() {
    const getTheadProps = () => ({className: 'clearfix'});
    const getTrProps = (state, rowInfo, column, instance) => {
      let className;
      if(this.props.selectedItem && rowInfo && this.props.selectedItem._id === rowInfo.original._id) {
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
      return {scrollBarHeight: instance.props.scrollBarHeight, scrollToBottom: instance.props.scrollToBottom};
    };
    const props = {
      noDataText: '',
      resizable: false,
      showPagination: false,
      minRows: 0,
      defaultPageSize: 9999,
      getTrProps: getTrProps,
      getTheadProps: getTheadProps,
      defaultFilterMethod: this.defaultFilterMethod,
    };
    if(this.props.scrollBarHeight) {
      props.getTbodyProps = getTbodyProps;
      props.TbodyComponent = FixHeightTBodyComponent;
    }

    if(this.props.scrollBarHeightAuto) {
      props.getTbodyProps = getTbodyProps;
      props.TbodyComponent = AutoHeightTBodyComponent;
    }

    return (
      <ReactTable
        {...props}
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


class FixHeightTBodyComponent extends React.Component {

  state = {
    firstLaunch: true,
  };

  componentDidUpdate() {
    const {scrollToBottom} = this.props;
    const {scrollbar} = this.refs;
    if (scrollToBottom && scrollbar.view.scrollTop === 0) {
      scrollbar.scrollToBottom();
    }
  }

  render() {
    const { TbodyComponent } = ReactTableDefaults;
    const {scrollBarHeight, scrollToBottom,  ...rest} = this.props;
    return (
      <Scrollbars style={{height: scrollBarHeight}}
        ref='scrollbar'
      >
        <TbodyComponent {...rest} />
      </Scrollbars>
    );
  }
};

class AutoHeightTBodyComponent extends React.Component {

  state = {
    firstLaunch: true,
  };

  componentDidUpdate() {
    const {scrollToBottom} = this.props;
    const {scrollbar} = this.refs;
    if (scrollToBottom && scrollbar.view.scrollTop === 0) {
      scrollbar.scrollToBottom();
    }
  }

  render() {
    const { TbodyComponent } = ReactTableDefaults;
    const {scrollBarHeight, scrollToBottom, ...rest} = this.props;
    return (
      <Scrollbars
        style={{height: '100%'}}
        autoHeightMin={100}
        autoHeightMax={'100%'}
        ref='scrollbar'
      >
        <TbodyComponent {...rest} />
      </Scrollbars>
    );
  }
};

export default SelectableReactTable;
