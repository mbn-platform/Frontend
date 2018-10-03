import React from 'react';
import PropTypes from 'prop-types';
import times from 'lodash.times';
import DropdownSelect from './DropdownSelect';


const defaultButton = props => (
  <button type="button" className="send-request-btn btn btn-secondary active" {...props}>
    {props.children}
  </button>);

const availablePageSize = [ 10, 25, 50];

export default class PaginationWithPage extends React.Component {
  constructor(props) {
    super();
    this.state = {
      visiblePages: this.getVisiblePages(props.page, props.pages, props.screenSize)
    };
  }

  static propTypes = {
    pages: PropTypes.number.isRequired,
    page: PropTypes.number,
    PageButtonComponent: PropTypes.any,
    onPageChange: PropTypes.func,
    previousText: PropTypes.string,
    nextText: PropTypes.string,
    screenSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.pages !== nextProps.pages) {
      this.setState({
        visiblePages: this.getVisiblePages(nextProps.page, nextProps.pages, nextProps.screenSize)
      });
      this.props.paginationPageDispatcher(nextProps.page);
    }
  }

  getVisiblePages = (page, total, screenSize) => {
    const isMobileScreen = (screenSize === 'sm');
    if (isMobileScreen) {
      if (total < 5) {
        return times(total, (i) => 1 + i);
      } else {
        if (page < 3) {
          return [1, 2, 3, 4, total];
        } else {
          if (total - page <= 2) {
            return [1, total - 3, total - 2, total - 1, total];
          } else {
            if (page + 3 % 3 >= 0) {
              return [1, page - 1, page, page + 1, total];
            }
          }
        }
      }
    } else {
      if (total < 7) {
        return times(total, (i) => 1 + i);
      } else {
        if (page < 5) {
          return [1, 2, 3, 4, 5, 6, total];
        }
        if (total - page <= 2) {
          return [1, total - 5, total - 4, total - 3, total - 2, total - 1, total];
        }
        if (page + 5 % 5 >= 0) {
          return [1, page - 2, page - 1, page, page + 1, page + 2, total];
        }
      }
    }
  };

  render() {
    const {
      PageButtonComponent = defaultButton,
      page,
      pages: total,
      pageSize,
      paginationPageDispatcher,
      paginationPageSizeDispatcher,
      screenSize
    } = this.props;
    const { visiblePages } = this.state;
    return (
      <div className="table__pagination">
        <div className="table__prev-page-wrapper">
          {screenSize !== 'sm' &&
            <PageButtonComponent
              className=" btn btn-secondary table__page-button"
              onClick={() => {
                if (page === 1) {
                  return;
                }
                paginationPageDispatcher(page - 1);
                this.setState({
                  visiblePages: this.getVisiblePages(page - 1, total, screenSize)
                });
              }}
              disabled={page === 1}
            >
              {this.props.previousText}
            </PageButtonComponent>
          }
        </div>
        <div className="table__visible-pages-wrapper">
          {visiblePages.map((currentPage, index, array) => {
            return (
              <PageButtonComponent
                key={index}
                className={`
                  btn btn-secondary
                  ${page === currentPage
                ? 'table__page-button table__page-button_active'
                : 'table__page-button'}`
                }
                onClick={() => {
                  paginationPageDispatcher(currentPage);
                  this.setState({
                    visiblePages: this.getVisiblePages(currentPage, total, screenSize)
                  });
                }}
              >
                {`
                ${array[index - 1] + 1 < currentPage ? '...' : ''}
                ${currentPage}
                `}
              </PageButtonComponent>
            );
          })}
        </div>
        <div className="table__next-page-wrapper">
          {screenSize !== 'sm' &&
          <PageButtonComponent
            className=" btn btn-secondary table__page-button"
            onClick={() => {
              if (page === this.props.pages) {
                return;
              }
              paginationPageDispatcher(page + 1);
              this.setState({
                visiblePages: this.getVisiblePages(page + 1, total, screenSize)
              });
            }}
            disabled={page === this.props.pages}
          >
            {this.props.nextText}
          </PageButtonComponent>
          }
        </div>
        <div className="table__page-size-wrapper">
          <DropdownSelect
            selected={pageSize}
            items={availablePageSize}
            targetId="time_select"
            switcherClassName="table__page-size-switcher"
            elementClassName="table__page-size-dropdown-list"
            dropdownClassName="table__page-size-dropdown"
            onItemSelect={paginationPageSizeDispatcher}
          />
        </div>
      </div>
    );
  }
}
