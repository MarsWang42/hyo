import React, { Component } from 'react';
import cn from 'classnames';
import './style.scss';

export default class Table extends Component {
  constructor() {
    super();
    this.state = {
      sortingCol: {},
      sortingDirection: "asc",
      sortedRows: [],
      filterCol: "",
      filterKeyword: "",
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
    } = this.props;

    const filterCol = def.find(col => col.filterable);

    this.setState({
      sortedRows: data,
      filterCol: filterCol && filterCol.key,
      filterType: filterCol && filterCol.filterType,
    });
  }

  render() {
    const {
      sortingCol,
      sortingDirection,
      sortedRows,
      filterCol,
      filterKeyword,
      filterType,
    } = this.state;

    const {
      def,
      filterable,
      data,
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
      filtering = false,
      sorting = false,
    ) => {
      let updatedRows = sortedRows
      // Take two params, Col and Keyword.
      // Filter the data according to the parms
      // and update the sorted Rows
      let newFilterType = filterType;
      if (filtering) {
        newFilterType = def.find(col => col.key === newFilterCol).filterType;
        updatedRows = data.filter((row) => {
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

      if (sorting && newSortingCol.sortable) {
      // Figure out the current direction.
      // If column is not select, then set direction to be asc.
      // If it is already selected, set to be the opposite direction.
        updatedRows = updatedRows.sort((a, b) => {
          const attr1 = a[newSortingCol.key];
          const attr2 = b[newSortingCol.key];
          const defaultOrder = !attr1 ? -1 : !attr2 ? 1 : attr1.toString().localeCompare(attr2);
          // Here you can load the columns's onSort function if it has.
          const order = newSortingCol.onSort? newSortingCol.onSort(attr1, attr2) : defaultOrder;
          return newSortingDirection === 'asc' ? order : -order;
        });
      }

      this.setState({
        sortedRows: updatedRows,
        filterCol: newFilterCol,
        filterKeyword: newFilterKeyword,
        filterType: newFilterType,
        sortingCol: newSortingCol,
        sortingDirection: newSortingDirection,
      });
    };

    const sortColumn = (col) => {
      if (col.sortable) {
        const dr = col.key !== sortingCol.key ? 'asc' :
          sortingDirection === 'asc' ? 'desc' : 'asc';
        updateRows(col, dr, filterCol, filterKeyword, false, true);
      }
    };

    // Clear keyword while changing filterCol
    const changeFilterCol = (event) => {
      updateRows(sortingCol, sortingDirection, event.target.value, "", true, true);
    };

    const changeFilterKeyword = (event) => {
      updateRows(sortingCol, sortingDirection, filterCol, event.target.value, true, true);
    };

    /**
     * renderFilter is a function that returns the filter UI.
     */
    const renderFilter = () => {
      const options = def.filter(col => col.filterable)
        .map(col =>
          <option key={`filter-${col.key}`} value={col.key}>{col.label}</option>);
      const generateFilterKeyword = () => {
        switch (filterType) {
          case 'input': {
            return <input type="text" id="filterKeyword" onChange={changeFilterKeyword} />;
          }
          // For select filter, checkout all unique value in the column
          // and put them in options.
          case 'select': {
            const l = data.length;
            const flags = {};
            const filterOptions = [];
            filterOptions.push(<option
              key="empty-filter-option"
              disabled value="default"> -- select -- </option>)
            for (let i = 0; i < l; i+=1) {
              const filterOption = data[i][filterCol];
              if (!flags[filterOption]) {
                flags[filterOption] = true;
                filterOptions.push(
                  <option key={`filteroption-${i}`} value={filterOption}>{filterOption}</option>);
              }
            }
            return (<select name="filterKeyworld" defaultValue="default" onChange={changeFilterKeyword} >
              {filterOptions}
            </select>);
          }
          default:
            return <input type="text" id="filterKeyword" onChange={changeFilterKeyword} />;
        }
      };
      return (
        <div className="filter">
          <label htmlFor="filterCol">Filter:</label>
          <select name="filterCol" onChange={changeFilterCol}>
            {options}
          </select>
          <label htmlFor="filterKeyword">Keyword:</label>
          { generateFilterKeyword() }
        </div>
      );
    };

    /**
     * renderHeaders returns headers according to definition
     */
    const renderHeaders = () => {
      const headers = def.map((col) => {
        const thClassName = cn({ sortable: col.sortable });
        const spanClassName = cn({
          sort: col.sortable,
          sortup: col.sortable && col.key === sortingCol.key && sortingDirection === "asc",
          sortdown: col.sortable && col.key === sortingCol.key && sortingDirection === "desc",
        });
        return (<th key={col.key} className={thClassName} onClick={() => sortColumn(col)}>
          {col.label}<span className={spanClassName} />
        </th>);
      });
      return <thead><tr>{headers}</tr></thead>;
    };

    /**
     * renderRows returns each row according to data.
     */
    const renderRows = () => {
      let i = 0;
      const rows = sortedRows.map((row) => {
        i+=1;
        const cell = def.map(col =>
          (<td key={`hyo-cell-${col.key}-${i}`}>
            { col.renderer? col.renderer(row[col.key]) : row[col.key] }
          </td>));
        return <tr key={`hyo-row-${i}`}>{ cell }</tr>;
      });
      return <tbody>{ rows }</tbody>;
    };

    /**
     * renderTable generates the whole table.
     */
    const renderTable = () => {
      return (
        <div className="rwd-table">
          { filterable && renderFilter() }
          <table>
            { renderHeaders() }
            { renderRows() }
          </table>
        </div>
      );
    };


    return renderTable();
  }
}

Table.propTypes = {
  def: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      key: React.PropTypes.string.isRequired,
      label: React.PropTypes.string.isRequired,
      sortable: React.PropTypes.bool,
      onSort: React.PropTypes.function,
      renderer: React.PropTypes.function,
    })).isRequired,
  data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  filterable: React.PropTypes.bool,
};

Table.defaultProps = {
  filterable: false,
};
