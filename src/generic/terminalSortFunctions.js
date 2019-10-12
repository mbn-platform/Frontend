import classNames from 'classnames';

export function onColumnSort(column) {
  const currentSortDirection = this.state.sort.direction;
  let direction;
  if(this.state.sort.column === column) {
    direction = currentSortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    direction = 'desc';
  }

  this.setState({sort: {column: column, direction}});
}

export function sortData(data) {
  if(!this.state.sort.column) {
    return data;
  }
  const sortFunction = this.sortFunctions[this.state.sort.column] || defaultSortFunctionColumn(this.state.sort.column);
  const sorted = [...data].sort(sortFunction);
  if(this.state.sort.direction === 'desc') {
    sorted.reverse();
  }
  return sorted;
}

export function defaultSortFunctionColumn(column) {
  return (a, b) =>  defaultSortFunction(a[column], b[column]);
}

export function defaultSortFunction(a, b) {
  if(a > b) {
    return 1;
  } else if(a < b) {
    return -1;
  } else {
    return 0;
  }
}

export function classNameForColumnHeader(state, column, ...additionalClasses) {
  const names = ['icon-dir'];
  if(state.sort.column === column &&
     state.sort.direction === 'desc') {

    names.push('icon-down-dir', 'sort');
  } else {
    if(state.sort.column === column) {
      names.push('icon-up-dir', 'sort');
    } else {
      names.push('icon-down-dir');
    }

  }
  return classNames(names, additionalClasses);
}
