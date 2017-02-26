import React, { Component } from 'react';
import cn from 'classnames';
import './style.scss';

export default class Table extends Component {
  constructor() {
    super();
    this.state = {
      sortingCol: "",
      sortingDirection: "asc",
      sortedRows: [],
      filterCol: "",
      filterKeyword: "",
    };
  }

  componentWillMount() {
    this.initializeStates();
  }

  initializeStates() {
    const {
      filterable,
      def,
      data,
    } = this.props;

    const filterCol = def.find(col => col.filterable);

    this.setState({
      sortedRows: this.props.data,
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

    // Help function to sort rows according to given column
    const sortColumn = (col) => {
      // Figure out the current direction.
      // If column is not select, then set direction to be asc.
      // If it is already selected, set to be the opposite direction.
      if (col.sortable) {
        const dr = col.key !== sortingCol ? 'asc' :
          sortingDirection === 'asc' ? 'desc' : 'asc';
        const updatedRows = data.sort((a, b) => {
          const attr1 = a[col.key];
          const attr2 = b[col.key];
          const defaultOrder = !attr1 ? -1 : !attr2 ? 1 : attr1.toString().localeCompare(attr2);
          const order = col.onSort? col.onSort(attr1, attr2) : defaultOrder;
          return dr === 'asc' ? order : -order;
        });

        this.setState({
          sortingCol: col.key,
          sortingDirection: dr,
          sortedRows: updatedRows,
        });
      }
    };

    // Take two params, Col and Keyword.
    // Filter the data according to the parms
    // and update the sorted Rows
    const filterRows = (newCol, newKeyword) => {
      const newFilterType = def.find(col => col.key === newCol).filterType;
      const updatedRows = data.filter((row) => {
        const cell = row[newCol];
        switch (newFilterType) {
          case 'input':
            return cell.toString().toLowerCase().includes(newKeyword.toLowerCase());
          case 'select':
            // If it is a select filter, must match the whole keyword
            if (newKeyword === "") return true;
            else return cell.toString() === newKeyword;
          default:
            return cell.toString().toLowerCase().includes(newKeyword.toLowerCase());
        }
      });
      this.setState({
        sortedRows: updatedRows,
        filterCol: newCol,
        filterKeyword: newKeyword,
        filterType: newFilterType,
      });
    };

    // Clear keyword while changing FilterCol
    const changeFilterCol = (event) => {
      filterRows(event.target.value, "");
    };

    const changeFilterKeyword = (event) => {
      filterRows(filterCol, event.target.value);
    };

    // Return the filter UI.
    const filterComponent = () => {
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
            filterOptions.push(<option disabled selected value> -- select -- </option>)
            for (let i = 0; i < l; i+=1) {
              const filterOption = data[i][filterCol];
              if (flags[filterOption]) continue;
              flags[filterOption] = true;
              filterOptions.push(
                <option key={`filteroption-${i}`} value={filterOption}>{filterOption}</option>);
            }
            return (<select name="filterKeyworld" onChange={changeFilterKeyword} >
              {filterOptions}
            </select>);
          }
          default:
            return <input type="text" id="filterKeyword" onChange={changeFilterKeyword} />;
        }
      }
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

    // Generate headers according to definition
    const generateHeaders = () => {
      const headers = def.map((col) => {
        const thClassName = cn({ sortable: col.sortable });
        const spanClassName = cn({
          sort: col.sortable,
          sortup: col.sortable && col.key === sortingCol && sortingDirection === "asc",
          sortdown: col.sortable && col.key === sortingCol && sortingDirection === "desc",
        });
        return (<th key={col.key} className={thClassName} onClick={() => sortColumn(col)}>
          {col.label}<span className={spanClassName} />
        </th>);
      });
      return <thead><tr>{headers}</tr></thead>;
    };

    // Render each row according to data
    const generateRows = () => {
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

    // Generate the whole table
    const generateTable = () => {
      return (
        <div className="rwd-table">
          { filterable && filterComponent() }
          <table>
            { generateHeaders() }
            { generateRows() }
          </table>
        </div>
      );
    };


    return generateTable();
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
