import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import cn from 'classnames';
import Dropdown from './components/dropdown';
import InlineEdit from './components/inlineEdit';
import Spinner from './components/spinner';
import Scrollbar from './components/scrollbar';
import ColumnResizer from './components/resizeHandler';
import HeaderCell from './components/headerCell';
import WidthHelper from './helpers/sizeHelper';
import ResizeSensor from './helpers/resizeSensor';
import WheelHandler from './helpers/wheelHandler';
import ScrollHelper from './helpers/facebook/scrollHelper';
import translateDOMPositionXY from './helpers/facebook/translateDOMPositionXY';


// A solution for find mathod in IE
// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    },
  });
}

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
    this.updateWidth = this.updateWidth.bind(this);
    this.initializeWidth = this.initializeWidth.bind(this);
    this.onResizeWidth = this.onResizeWidth.bind(this);
    this.onWheel = this.onWheel.bind(this);
    this.onVerticalScroll = this.onVerticalScroll.bind(this);
    this.onHorizontalScroll = this.onHorizontalScroll.bind(this);
    this.shouldHandleWheelX = this.shouldHandleWheelX.bind(this);
    this.shouldHandleWheelY = this.shouldHandleWheelY.bind(this);
  }

  componentWillMount() {
    this.wheelHandler = new WheelHandler(
      this.onWheel,
      this.shouldHandleWheelX,
      this.shouldHandleWheelY,
    );

    this.initializeStates(this.props);
  }

  componentDidMount() {
    if (this.props.width === "auto") {
      const parentNode = ReactDOM.findDOMNode(this.table).parentNode;
      this.initializeWidth(parentNode);
      this.resizeSensor = new ResizeSensor(parentNode, this.onResizeWidth);
    }
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

  componentWillUnmount() {
    if (this.eventResizeWidthToken) {
      this.eventResizeWidthToken.remove();
      this.eventResizeWidthToken = null;
    }
    if (this.resizeSensor) {
      this.resizeSensor.detach();
      this.resizeSensor = null;
    }
  }

  onResizeWidth() {
    clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(this.updateWidth, 16);
  }

  initializeWidth() {
    const domNode = ReactDOM.findDOMNode(this.table).parentNode;
    if (domNode) {
      const newWidth = (domNode.clientWidth - 20);
      const cols = WidthHelper.adjustColWidths(this.props.def, newWidth);
      const maxScrollX = WidthHelper.getHeaderWidth(cols, newWidth)
        - newWidth;
      this.setState({ width: newWidth, maxScrollX, cols });
    }
  }

  updateWidth() {
    if (this.table) {
      const domNode = ReactDOM.findDOMNode(this.table).parentNode;
      const newWidth = (domNode.clientWidth - 20);
      const maxScrollX = WidthHelper.getHeaderWidth(this.state.cols, newWidth)
        - newWidth;
      this.setState({ width: newWidth, maxScrollX });
    }
  }

  shouldHandleWheelX(delta) {
    delta = Math.round(delta);
    if (delta === 0) {
      return false;
    }

    return (
      (delta < 0 && this.state.scrollX > 0) ||
      (delta >= 0 && this.state.scrollX < this.state.maxScrollX)
    );
  }

  shouldHandleWheelY(delta) {
    delta = Math.round(delta);
    if (delta === 0) {
      return false;
    }

    return (
      (delta < 0 && this.state.scrollY > 0) ||
      (delta >= 0 && this.state.scrollY < this.state.maxScrollY)
    );
  }

  onWheel(deltaX, deltaY) {
    if (!this.isScrolling) this.isScrolling = true;
    let x = this.state.scrollX;
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      const scrollState = this.scrollHelper.scrollBy(Math.round(deltaY));
      const maxScrollY = Math.max(
        0,
        scrollState.contentHeight - this.state.height + this.props.headerHeight,
      );
      this.setState({
        firstRowIndex: scrollState.index,
        firstRowOffset: scrollState.offset,
        scrollY: scrollState.position,
        scrollContentHeight: scrollState.contentHeight,
        maxScrollY,
      });
    } else if (deltaX) {
      x += deltaX;
      x = x < 0 ? 0 : x;
      x = x > this.state.maxScrollX ? this.state.maxScrollX : x;
      this.setState({
        scrollX: x,
      });
    }

    this.isScrolling = false;
  }

  onVerticalScroll(scrollPos) {
    if (scrollPos !== this.state.scrollY) {
      if (!this.isScrolling) {
        this.isScrolling = true;
      }
      const scrollState = this.scrollHelper.scrollTo(Math.round(scrollPos));
      this.setState({
        firstRowIndex: scrollState.index,
        firstRowOffset: scrollState.offset,
        scrollY: scrollState.position,
        scrollContentHeight: scrollState.contentHeight,
      });
      this.isScrolling = false;
    }
  }

  onHorizontalScroll(scrollPos) {
    if (scrollPos !== this.state.scrollX) {
      if (!this.isScrolling) {
        this.isScrolling = true;
      }
      this.setState({
        scrollX: scrollPos,
      });
      this.isScrolling = false;
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
      rowHeight,
      headerHeight,
      height,
    } = props;
    let { width } = props;
    if (width === "auto") width = 100000;

    const cols = WidthHelper.adjustColWidths(def, width);
    const pages = pagination? Math.floor(data.length / pageSize)-1 : 0;
    const pageRows = pagination ? data.slice(0, pageSize) : data;
    const rowNum = pagination ? pageSize : data.length;
    const newHeight = Math.min(height, (rowHeight * rowNum) + headerHeight);

    this.scrollHelper = new ScrollHelper(
      pageSize,
      rowHeight,
      newHeight - headerHeight,
    );

    const scrollState = this.scrollHelper.scrollTo(0);
    const firstRowIndex = scrollState.index;
    const firstRowOffset = scrollState.offset;
    const scrollY = scrollState.position;
    const scrollX = 0;
    const maxScrollY = rowHeight * pageSize - newHeight + headerHeight;
    const maxScrollX = WidthHelper.getHeaderWidth(cols, width) - width;

    this.setState({
      pageRows,
      resolvedRows: data,
      pages,
      cols,
      height: newHeight,
      width,
      firstRowIndex,
      firstRowOffset,
      scrollY,
      scrollX,
      maxScrollY,
      maxScrollX,
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
      rowHeight,
      headerHeight,
    } = this.props;
    let { height } = this.state;
    let newResolvedRows = data;
    let updatedRows;

    if (sorting && newSortingCol.sortable) {
    // Figure out the current direction.
    // If column is not select, then set direction to be asc.
    // If it is already selected, set to be the opposite direction.
      const defaultSortFunction = (sortingData) => {
        return sortingData.sort((a, b) => {
          const attr1 = a[newSortingCol.key];
          const attr2 = b[newSortingCol.key];
          const order = !attr1 ? -1 : !attr2 ? 1 : attr1.toString().localeCompare(attr2);
          return newSortingDirection === 'asc' ? order : -order;
        });
      };
      // Here you can load the columns's onSort function if it has.
      newResolvedRows = newSortingCol.onSort ?
        newSortingCol.onSort(data, newSortingCol.key, newSortingDirection) :
        defaultSortFunction(data);
    }

    // Take two params, Col and Keyword.
    // Filter the data according to the parms
    // and update the sorted Rows
    if (filtering && filterable) {
      let filteredRows = [...data];
      for (let i = 0, length = newFilters.length; i < length; i+=1) {
        const keyword = newFilters[i].keyword;
        // Use the side effect of sort method.
        if (newFilters[i].onFilter) {
          filteredRows = newFilters[i].onFilter(
            filteredRows,
            keyword,
            newFilters[i].key,
          );
        } else {
          filteredRows = filteredRows.filter((row) => {
            const cell = row[newFilters[i].key];
            switch (newFilters[i].filterType) {
              case 'input':
                return cell && cell.toString().toLowerCase().includes(keyword.toLowerCase());
              case 'select':
                // If it is a select filter, must match the whole keyword
                if (keyword === "") return true;
                else return cell && cell.toString() === keyword;
              default:
                return cell && cell.toString().toLowerCase().includes(keyword.toLowerCase());
            }
          });
        }
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

    const rowNum = pagination ? pageSize : data.length;
    const newHeight = Math.min(height, (rowHeight * rowNum) + headerHeight);

    this.setState({
      pageRows: updatedRows,
      filters: newFilters,
      sortingCol: newSortingCol,
      sortingDirection: newSortingDirection,
      currentPage: newCurrentPage,
      navigatorPage: newCurrentPage,
      resolvedRows: newResolvedRows,
      pages: newPages,
      height: newHeight,
    });
  }

  render() {
    const {
      sortingCol,
      sortingDirection,
      height,
      pageRows,
      pages,
      currentPage,
      resolvedRows,
      navigatorPage,
      filters,
      cols,
      columnResizingData,
      isColumnResizing,
      width,
      scrollY,
      scrollX,
      maxScrollX,
      maxScrollY,
    } = this.state;

    const {
      filterable,
      data,
      pagination,
      pageSize,
      isLoading,
      loader,
      rowHeight,
      headerHeight,
    } = this.props;

    const contentWidth = WidthHelper.getHeaderWidth(cols, width);

    let verticalScrollbar;
    if (maxScrollY > 0) {
      verticalScrollbar = (
        <Scrollbar
          size={height - headerHeight}
          contentSize={rowHeight * pageSize}
          verticalTop={headerHeight}
          position={scrollY}
          onScroll={this.onVerticalScroll}
        />
      );
    }

    let horizontalScrollbar;
    if (maxScrollX > 0) {
      const innerContainerStyle = {
        width,
      };
      horizontalScrollbar = (
        <div style={innerContainerStyle} className="horizontal-scrollbar-container">
          <Scrollbar
            size={width}
            contentSize={contentWidth}
            orientation="horizontal"
            position={scrollX}
            onScroll={this.onHorizontalScroll}
            offset={undefined}
          />
        </div>
      );
    }

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
        onFilter: filterCol.onFilter,
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
      colKey,
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
          key: colKey,
        },
      });
    };

    const onColumnResizeEndCallback = (newColWidth, colKey) => {
      const newCol = Object.assign(cols.find(col => col.key === colKey), { adjustedWidth: newColWidth });
      const newCols = Object.assign(cols).map((col) => {
        if (col.key !== colKey) return col;
        else return newCol;
      });
      const maxScrollX = WidthHelper.getHeaderWidth(newCols, this.state.width)
        - this.state.width;

      this.setState({
        cols: newCols,
        columnResizingData: {},
        maxScrollX,
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
          if (typeof filter.filterType === 'function') {
            return filter.filterType(filter, updateFilter, removeFilter);
          } else if (filter.filterType === undefined || typeof filter.filterType === "string") {
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
                  const filterOption = data[i][filter.key] || "";
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
          } else return defaultFilter;
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
        width: contentWidth,
        height: headerHeight,
      };

      translateDOMPositionXY(theadStyle, -scrollX, 0);

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
              col.width || 125,
              col.maxWidth,
              col.key,
              e,
            );
          };
        }());

        const currentHeaderCell = (
          <div
            key={`${col.key}-header-${i}`}
            className={thClassName}
            style={thStyle}
            onClick={() => sortColumn(col)}
          >
            <HeaderCell
              value={col.label}
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
        colKey={columnResizingData.key}
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
      } else Cell = col.renderer ? col.renderer(row[col.key], row) : row[col.key];
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
      let rowsStyle = { top: headerHeight };

      translateDOMPositionXY(rowsStyle, -scrollX, -scrollY);
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
          width: contentWidth,
        };
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
        <div className="hyo-tbody" style={rowsStyle}>
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
      });
      return (
        <div className="hyo" ref={(table) => { this.table = table; }}>
          { filterable && renderFilter() }
        <div className="hyo-table-layout">
            <div className={tableClass} style={style} onWheel={this.wheelHandler.onWheel}>
              { renderHeaders() }
              { renderRows() }
              { isLoading && shownLoader }
            </div>
            {!isLoading && verticalScrollbar}
            {!isLoading && horizontalScrollbar}
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
      onSort: PropTypes.func,
      renderer: PropTypes.func,
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
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
  width: 700,
};
