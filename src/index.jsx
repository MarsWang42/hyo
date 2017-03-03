import React, { Component, PropTypes } from 'react';
import cn from 'classnames';
import Dropdown from './dropdown';
import './style.scss';

export default class Table extends Component {
  constructor() {
    super();
    this.state = {
      sortingCol: {},
      sortingDirection: "asc",
      pageRows: [],
      filterCol: "",
      filterKeyword: "",
      currentPage: 1,
      navigatorPage: 1,
      resolvedRows: [],
    };
  }

  componentWillMount() {
    this.initializeStates();
  }

  /**
   * initializeStates initializes the states with given props.
   */
  initializeStates() {
    const {
      def,
      data,
      pageSize,
      pagination,
    } = this.props;

    const filterCol = def.find(col => col.filterable);
    const pages = pagination? Math.floor(data.length / pageSize)-1 : 0;
    const pageRows = pagination ? data.slice(0, pageSize) : data;

    this.setState({
      pageRows,
      resolvedRows: data,
      filterCol: filterCol && filterCol.key,
      filterType: filterCol && filterCol.filterType,
      pages,
    });
  }

  render() {
    const {
      sortingCol,
      sortingDirection,
      pageRows,
      filterCol,
      filterKeyword,
      filterType,
      pages,
      currentPage,
      resolvedRows,
      navigatorPage,
    } = this.state;

    const {
      def,
      filterable,
      data,
      pagination,
      pageSize,
    } = this.props;

    /**
     * updateRows is a method to all of the rows
     * being rendered as the body of table.
     */
    const updateRows = (
      newSortingCol = sortingCol,
      newSortingDirection = sortingDirection,
      newFilterCol = filterCol,
      newFilterKeyword = filterKeyword,
      newCurrentPage = currentPage,
      filtering = false,
      sorting = false,
    ) => {
      let newResolvedRows = resolvedRows;
      let updatedRows;

      if (sorting && newSortingCol.sortable) {
      // Figure out the current direction.
      // If column is not select, then set direction to be asc.
      // If it is already selected, set to be the opposite direction.
        newResolvedRows = data.sort((a, b) => {
          const attr1 = a[newSortingCol.key];
          const attr2 = b[newSortingCol.key];
          const defaultOrder = !attr1 ? -1 : !attr2 ? 1 : attr1.toString().localeCompare(attr2);
          // Here you can load the columns's onSort function if it has.
          const order = newSortingCol.onSort? newSortingCol.onSort(attr1, attr2) : defaultOrder;
          return newSortingDirection === 'asc' ? order : -order;
        });
      }

      // Take two params, Col and Keyword.
      // Filter the data according to the parms
      // and update the sorted Rows
      let newFilterType = filterType;
      if (filtering && filterable) {
        newFilterType = def.find(col => col.key === newFilterCol).filterType;
        // Use the side effect of sort method.
        newResolvedRows = data.filter((row) => {
          const cell = row[newFilterCol];
          switch (newFilterType) {
            case 'input':
              return cell.toString().toLowerCase().includes(newFilterKeyword.toLowerCase());
            case 'select':
              // If it is a select filter, must match the whole keyword
              if (newFilterKeyword === "") return true;
              else return cell.toString() === newFilterKeyword;
            default:
              return cell.toString().toLowerCase().includes(newFilterKeyword.toLowerCase());
          }
        });
      }

      // If Pagination, slice the resolved the data within current page.
      let newPages = 0;
      if (pagination) {
        const startRow = pageSize * (newCurrentPage - 1);
        const endRow = Math.min(newResolvedRows.length, startRow + pageSize);
        newPages = Math.floor(newResolvedRows.length / pageSize)-1;
        updatedRows = newResolvedRows.slice(startRow, endRow);
      } else updatedRows = newResolvedRows;

      this.setState({
        pageRows: updatedRows,
        filterCol: newFilterCol,
        filterKeyword: newFilterKeyword,
        filterType: newFilterType,
        sortingCol: newSortingCol,
        sortingDirection: newSortingDirection,
        currentPage: newCurrentPage,
        navigatorPage: newCurrentPage,
        resolvedRows: newResolvedRows,
        pages: newPages,
      });
    };

    const sortColumn = (col) => {
      if (col.sortable) {
        const dr = col.key !== sortingCol.key ? 'asc' :
          sortingDirection === 'asc' ? 'desc' : 'asc';
        updateRows(col, dr, filterCol, filterKeyword, currentPage, true, true);
      }
    };

    // Clear keyword while changing filterCol
    const changeFilterCol = (col) => {
      updateRows(sortingCol, sortingDirection, col.key, "", currentPage, true);
    };

    const changeFilterKeyword = (keyword) => {
      updateRows(sortingCol, sortingDirection, filterCol, keyword, currentPage, true);
    };

    const changePage = (index) => {
      updateRows(sortingCol, sortingDirection, filterCol, filterKeyword, index);
    };

    const jumpPage = (event) => {
    };

    /**
     * renderFilter is a function that returns the filter UI.
     */
    const renderFilter = () => {
      const options = def.filter(col => col.filterable);
      const generateFilterKeyword = () => {
        switch (filterType) {
          case 'input': {
            return <input type="text" id="filterKeyword" onChange={e => changeFilterKeyword(e.target.value)} placeholder="Keyword..." />;
          }
          // For select filter, checkout all unique value in the column
          // and put them in options.
          case 'select': {
            const l = data.length;
            const flags = {};
            const filterOptions = [{ key: "", label: "all" }];
            for (let i = 0; i < l; i+=1) {
              const filterOption = data[i][filterCol];
              if (!flags[filterOption]) {
                flags[filterOption] = true;
                filterOptions.push(filterOption);
              }
            }
            return <Dropdown options={filterOptions} onChange={col => changeFilterKeyword(col.key)} />;
          }
          default:
            return <input type="text" id="filterKeyword" onChange={e => changeFilterKeyword(e.target.value)} placeholder="Keyword..." />;
        }
      };
      return (
        <div className="filter">
          <label htmlFor="filterCol">Filter:</label>
          <Dropdown options={options} onChange={col => changeFilterCol(col)} />
          <label htmlFor="filterKeyword">Keyword:</label>
          { generateFilterKeyword() }
        </div>
      );
    };

    /*
     * Render the Pgination Controller.
     */
    const renderPagination = () => {
      const totalRows = resolvedRows.length;
      const startRow = (pageSize * (currentPage-1)) + 1;
      const endRow = Math.min(totalRows, (startRow + pageSize) - 1);
      return (
        <div className="hyo-paginate">
          <div>Showing {startRow} to {endRow} of {totalRows} entries</div>
          <div className="navigator" >
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => changePage(1)}
            >
              &lt;&lt;
            </button>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => changePage(currentPage-1)}
            >
              &lt;
            </button>
            <div>
              Go to Page
              <input
                type="text"
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    changePage(e.target.value);
                  }
                }}
                value={navigatorPage}
                onChange={(e) => {
                  let page = e.target.value;
                  console.log(pages);
                  if (page === "") this.setState({ navigatorPage: page });
                  else {
                    page = Math.min(Math.max(0, e.target.value), pages+1);
                    this.setState({ navigatorPage: page });
                  }
                }}
                onBlur={(e) => {
                  changePage(e.target.value);
                }}
              />
              of {pages+1}
            </div>
            <button
              type="button"
              disabled={currentPage === pages+1}
              onClick={() => changePage(currentPage+1)}
            >
              &gt;
            </button>
            <button
              type="button"
              disabled={currentPage === pages+1}
              onClick={() => changePage(pages+1)}
            >
              &gt;&gt;
            </button>
          </div>
        </div>
      );
    };

    /**
     * renderHeaders returns headers according to definition
     */
    const renderHeaders = () => {
      const headers = def.map((col) => {
        const thClassName = cn({
          "hyo-th": true,
          "sortable": col.sortable,
        });
        const spanClassName = cn({
          "sort": col.sortable,
          "sortup": col.sortable && col.key === sortingCol.key && sortingDirection === "asc",
          "sortdown": col.sortable && col.key === sortingCol.key && sortingDirection === "desc",
        });
        return (<div key={col.key} className={thClassName} onClick={() => sortColumn(col)}>
          {col.label}<span className={spanClassName} />
        </div>);
      });
      return <div className="hyo-thead"><div className="hyo-tr">{headers}</div></div>;
    };

    /**
     * renderRows returns each row according to data.
     */
    const renderRows = () => {
      let i = 0;
      const rows = pageRows.map((row) => {
        i+=1;
        const cell = def.map(col =>
          (<div className="hyo-td" key={`hyo-cell-${col.key}-${i}`}>
            { col.renderer? col.renderer(row[col.key]) : row[col.key] }
          </div>));
        return <div className="hyo-tr" key={`hyo-row-${i}`}>{ cell }</div>;
      });
      return <div className="hyo-tbody">{ rows }</div>;
    };

    /**
     * renderTable generates the whole table.
     */
    const renderTable = () => {
      return (
        <div className="hyo">
          { filterable && renderFilter() }
          <div className="hyo-table">
            { renderHeaders() }
            { renderRows() }
            { pagination && renderPagination() }
          </div>
        </div>
      );
    };


    return renderTable();
  }
}

Table.propTypes = {
  def: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      onSort: PropTypes.function,
      renderer: PropTypes.function,
    })).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  filterable: PropTypes.bool,
  pagination: PropTypes.bool,
  pageSize: PropTypes.number,
};

Table.defaultProps = {
  filterable: false,
  pagination: false,
  pageSize: 0,
};
