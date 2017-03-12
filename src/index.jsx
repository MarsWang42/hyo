import React, { Component, PropTypes } from 'react';
import cn from 'classnames';
import Dropdown from './dropdown';
import InlineEdit from './inlineEdit';
import Spinner from './spinner';
import ColumnResizer from './resizeHandler';
import HeaderCell from './headerCell';
import WidthHelper from './helpers/sizeHelper';

export default class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortingCol: {},
      sortingDirection: "asc",
      pageRows: [],
      currentPage: 1,
      navigatorPage: 1,
      resolvedRows: [],
      filters: [],
      columnResizingData: {},
    };
  }

  componentWillMount() {
    this.initializeStates(this.props);
  }

  componentWillReceiveProps(nextProps) {
    // Whenever loading status changed, reinitialize everything.
    if (nextProps.isLoading !== this.props.isLoading) {
      const { sortingCol, sortingDirection, filters, currentPage } = this.state;
      this.updateRows(nextProps.data, sortingCol, sortingDirection, filters, currentPage, true, true);
    }

    if (nextProps.width !== this.props.width) {
      const cols = WidthHelper.adjustColWidths(this.state.cols, nextProps.width);
      this.setState({ cols });
    }
  }

  /**
   * initializeStates initializes the states with given props.
   */
  initializeStates(props) {
    const {
      data,
      pageSize,
      pagination,
      def,
      width,
    } = props;

    const cols = WidthHelper.adjustColWidths(def, width);
    const pages = pagination? Math.floor(data.length / pageSize)-1 : 0;
    const pageRows = pagination ? data.slice(0, pageSize) : data;

    this.setState({
      pageRows,
      resolvedRows: data,
      pages,
      cols,
    });
  }

  /**
   * updateRows is a method to all of the rows
   * being rendered as the body of table.
   */
  updateRows(
    data,
    newSortingCol,
    newSortingDirection,
    newFilters,
    newCurrentPage,
    filtering,
    sorting,
  ) {
    const {
      filterable,
      pagination,
      pageSize,
    } = this.props;
    let newResolvedRows = data;
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
    if (filtering && filterable) {
      let filteredRows = [...data];
      for (let i = 0, length = newFilters.length; i < length; i+=1) {
        // Use the side effect of sort method.
        filteredRows = filteredRows.filter((row) => {
          const keyword = newFilters[i].keyword;
          const cell = row[newFilters[i].key];
          switch (newFilters[i].filterType) {
            case 'input':
              return cell.toString().toLowerCase().includes(keyword.toLowerCase());
            case 'select':
              // If it is a select filter, must match the whole keyword
              if (keyword === "") return true;
              else return cell.toString() === keyword;
            default:
              return cell.toString().toLowerCase().includes(keyword.toLowerCase());
          }
        });
      }
      newResolvedRows = filteredRows;
    }

    // If Pagination, slice the resolved the data within current page.
    let newPages = 0;
    if (pagination) {
      newPages = newResolvedRows.length === 0 ? 0
        : Math.ceil(newResolvedRows.length / pageSize)-1;
      newCurrentPage = Math.min(newCurrentPage, newPages+1);
      const startRow = pageSize * (newCurrentPage - 1);
      const endRow = Math.min(newResolvedRows.length, startRow + pageSize);
      updatedRows = newResolvedRows.slice(startRow, endRow);
    } else updatedRows = newResolvedRows;

    this.setState({
      pageRows: updatedRows,
      filters: newFilters,
      sortingCol: newSortingCol,
      sortingDirection: newSortingDirection,
      currentPage: newCurrentPage,
      navigatorPage: newCurrentPage,
      resolvedRows: newResolvedRows,
      pages: newPages,
    });
  }

  render() {
    const {
      sortingCol,
      sortingDirection,
      pageRows,
      pages,
      currentPage,
      resolvedRows,
      navigatorPage,
      filters,
      cols,
      columnResizingData,
      isColumnResizing,
    } = this.state;

    const {
      filterable,
      data,
      pagination,
      pageSize,
      isLoading,
      loader,
      height,
      rowHeight,
      headerHeight,
      width,
    } = this.props;

    const sortColumn = (col) => {
      if (col.sortable) {
        const dr = col.key !== sortingCol.key ? 'asc' :
          sortingDirection === 'asc' ? 'desc' : 'asc';
        this.updateRows(data, col, dr, filters, currentPage, true, true);
      }
    };

    const addFilter = (filter) => {
      const filterCol = cols.find(col => col.key === filter.key);
      const newFilters = [...filters];
      newFilters.push({
        key: filter.key,
        keyword: "",
        filterType: filterCol.filterType,
        label: filter.label,
        typehead: filterCol.filterTypehead,
      });
      this.updateRows(data, sortingCol, sortingDirection, newFilters, currentPage, true);
    };

    const removeFilter = (col) => {
      let newFilters = [...filters];
      newFilters = newFilters.filter(filter => filter.key !== col);
      this.updateRows(data, sortingCol, sortingDirection, newFilters, currentPage, true);
    };

    const updateFilter = (col, keyword) => {
      const newFilters = [...filters];
      const updatedFilter = newFilters.find(filter => filter.key === col);
      updatedFilter.keyword = keyword;
      this.updateRows(data, sortingCol, sortingDirection, newFilters, currentPage, true);
    };

    const changePage = (index) => {
      this.updateRows(resolvedRows, sortingCol, sortingDirection, filters, index);
    };

    /**
     * This is called when a cell that is in the header of a column has its
     * resizer knob clicked on. It displays the resizer and puts in the correct
     * location on the table.
     */
    const onColumnResize = (
      leftOffset,
      cellWidth,
      cellMinWidth,
      cellMaxWidth,
      columnKey,
      event,
    ) => {
      this.setState({
        isColumnResizing: true,
        columnResizingData: {
          left: leftOffset,
          width: cellWidth,
          maxWidth: cellMaxWidth,
          minWidth: cellMinWidth,
          initialEvent: {
            clientX: event.clientX,
            clientY: event.clientY,
            preventDefault: () => {},
          },
          key: columnKey,
        },
      });
    };

    const onColumnResizeEndCallback = (newColWidth, colKey) => {
      const newCol = Object.assign(cols.find(col => col.key === colKey), { adjustedWidth: newColWidth });
      const newCols = Object.assign(cols).map((col) => {
        if (col.key !== colKey) return col;
        else return newCol;
      });

      this.setState({
        cols: newCols,
        columnResizingData: {},
        isColumnResizing: false,
      });
    };

    /**
     * renderFilter is a function that returns the filter UI.
     */
    const renderFilter = () => {
      const options = cols.filter(col =>
        col.filterable && filters.find(filter => filter.key === col.key) === undefined);
      const generateFilters = () => {
        if (filters.length === 0) return;
        // render all filters being added
        return filters.map((filter) => {
          const defaultFilter = (
            <div className="text-filter" key={`${filter.key}-filter`}>
              <input
                type="text"
                id={`${filter.key}-filter`}
                onChange={e => updateFilter(filter.key, e.target.value)}
                placeholder={`${filter.label}`}
              />
              <span className="clear-btn" onClick={() => removeFilter(filter.key)} />
            </div>
          );
          switch (filter.filterType) {
            case 'input': {
              return defaultFilter;
            }
            // For select filter, checkout all unique value in the column
            // and put them in options.
            case 'select': {
              const l = data.length;
              const flags = {};
              const filterOptions = [{ key: "", label: "all" }];
              for (let i = 0; i < l; i+=1) {
                const filterOption = data[i][filter.key];
                if (!flags[filterOption]) {
                  flags[filterOption] = true;
                  filterOptions.push({ key: filterOption, label: filterOption });
                }
              }
              return (<Dropdown
                options={filterOptions}
                key={`${filter.key}-filter`}
                onChange={col => updateFilter(filter.key, col.key)}
                remove
                onRemove={() => removeFilter(filter.key)}
                filterable={filter.typehead}
                placeholder={`${filter.label} Filter`}
              />);
            }
            default:
              return defaultFilter;
          }
        });
      };
      return (
        <div className="filter">
          <Dropdown options={options} onChange={col => addFilter(col)} shownContent="Add a filter" />
          { generateFilters() }
        </div>
      );
    };

    /**
     * Render the Pgination Controller.
     */
    const renderPagination = () => {
      const totalRows = resolvedRows.length;
      const startRow = (pageSize * (currentPage-1)) + 1;
      const endRow = Math.min(totalRows, (startRow + pageSize) - 1);
      // When loading, render a loader for pagination navigator
      const paginationLoader = (
        <div className="pagination-wrapper">
          <div className="pagination-loader">Loading...</div>
        </div>
      );
      return (
        <div className="hyo-paginate" style={{ width }}>
          {isLoading ? paginationLoader : (
            <div className="pagination-wrapper" >
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
          )}
        </div>
      );
    };

    /**
     * renderHeaders returns headers according to definition
     */
    const renderHeaders = () => {
      let currentPosition = 0;
      const theadStyle = {
        width: WidthHelper.getHeaderWidth(cols, width),
        height: headerHeight,
      };

      const headers = cols.map((col, i) => {
        const thClassName = cn({
          "hyo-th": true,
          "sortable": col.sortable,
        });
        // if given width
        const thStyle = {
          width: col.adjustedWidth,
          left: currentPosition,
          height: headerHeight,
        };
        const spanClass = cn({
          "sort": col.sortable,
          "sortup": col.sortable && col.key === sortingCol.key && sortingDirection === "asc",
          "sortdown": col.sortable && col.key === sortingCol.key && sortingDirection === "desc",
        });

        const onHeaderResize = (function() {
          const leftOffset = currentPosition;
          return (e) => {
            onColumnResize(
              leftOffset,
              col.adjustedWidth,
              col.width,
              col.maxWidth,
              col.key,
              e,
            );
          };
        })();

        const currentHeaderCell = (
          <div
            key={`${col.key}-header-${i}`}
            className={thClassName}
            style={thStyle}
            onClick={() => sortColumn(col)}
          >
            <HeaderCell
              value={col.key}
              spanClass={spanClass}
              width={col.adjustedWidth}
              height={headerHeight}
              resizable={col.resizable}
              onColumnResizerMouseDown={onHeaderResize}
            />
          </div>);
        // Increment the position and id
        currentPosition += col.adjustedWidth;
        return currentHeaderCell;
      });
      const dragKnob = (<ColumnResizer
        height={height}
        initialWidth={columnResizingData.width || 0}
        minWidth={columnResizingData.minWidth || 0}
        maxWidth={columnResizingData.maxWidth || Number.MAX_VALUE}
        leftOffset={columnResizingData.left || 0}
        initialEvent={columnResizingData.initialEvent}
        onColumnResizeEnd={onColumnResizeEndCallback}
        columnKey={columnResizingData.key}
        isColumnResizing={isColumnResizing}
      />);
      return (
        <div className="hyo-thead" style={theadStyle}>
          <div className="hyo-tr">
            {dragKnob}
            {headers}
          </div>
        </div>
      );
    };

    /**
     * renderRowCell returns each cell in a row.
     */
    const renderRowCell = (row, col, rowId, colId, currentPosition) => {
      let Cell;
      const style = {
        width: col.adjustedWidth,
        left: currentPosition,
        height: rowHeight,
      };
      if (col.editable) {
        Cell = (<InlineEdit
          renderer={col.renderer}
          style={style}
          // TODO: be more cautious
          value={row[col.key].toString()}
          onChange={(value) => {
            if (col.onEdit) col.onEdit(row, col.key, (pageSize*(currentPage-1))+rowId, value);
          }
          }
          editType={col.editType}
          editOptions={col.editOptions}
        />);
      } else Cell = col.renderer ? col.renderer(row[col.key]) : row[col.key];
      return (
        <div className="hyo-td" style={style} key={`cell-${colId}-${rowId}`}>
          { Cell }
        </div>
      );
    };

    /**
     * renderRows returns each row according to data.
     */
    const renderRows = () => {
      let currentRowPosition = 0;
      const rows = pageRows.map((row, i) => {
        let currentCellPosition = 0;
        const cell = cols.map((col, j) => {
          const currentCell = renderRowCell(row, col, i, j, currentCellPosition);
          // Increment cell position and id
          currentCellPosition += col.adjustedWidth;
          j += 1;
          return currentCell;
        });
        const rowStyle = {
          top: currentRowPosition,
        };
        const backgroundStyle = {
          height: rowHeight,
          width: WidthHelper.getHeaderWidth(cols, width),
        }
        const backgroundClassName = cn({
          "hyo-tr-background": true,
          "hyo-tr-highlighted": i%2 === 1,
        });
        const currentRow = (
          <div className="hyo-tr" key={`hyo-row-${i}`} style={rowStyle}>
            <div className={backgroundClassName} style={backgroundStyle} />
            { cell }
          </div>
        );
        // Increment roww position and id
        currentRowPosition += rowHeight;
        return currentRow;
      });
      return (
        <div className="hyo-tbody" style={{ top: headerHeight }}>
          {!isLoading && rows }
        </div>
      );
    };

    /**
     * renderTable generates the whole table.
     */
    const renderTable = () => {
      const shownLoader = loader || <Spinner />;
      const style = {
        height,
        width,
      };
      const tableClass = cn({
        "hyo-table": true,
        "without-pagination": !pagination,
      })
      return (
        <div className="hyo">
          { filterable && renderFilter() }
          <div className={tableClass} style={style}>
            { renderHeaders() }
            { renderRows() }
            { isLoading && shownLoader }
          </div>
          { pagination && renderPagination() }
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
  isLoading: PropTypes.bool,
  loader: PropTypes.element,
  height: PropTypes.number,
  rowHeight: PropTypes.number,
  headerHeight: PropTypes.number,
  width: PropTypes.number,
};

Table.defaultProps = {
  filterable: false,
  pagination: false,
  pageSize: 0,
  isLoading: false,
  loader: undefined,
  height: 500,
  rowHeight: 35,
  headerHeight: 40,
  width: 800,
};
