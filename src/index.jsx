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
    });
  }

  render() {
    const {
      sortingCol,
      sortingDirection,
      sortedRows,
      filterCol,
      filterKeyword,
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
      const updatedRows = data.filter((row) => {
        const cell = row[newCol];
        return cell.includes(newKeyword);
      });
      this.setState({
        sortedRows: updatedRows,
        filterCol: newCol,
        filterKeyword: newKeyword,
      });
    };

    const changeFilterCol = (event) => {
      filterRows(event.target.value, filterKeyword);
    };

    const changeFilterKeyword = (event) => {
      filterRows(filterCol, event.target.value);
    };

    // Return the filter UI.
    const filterComponent = () => {
      const options = def.filter(col => col.filterable)
        .map(col => <option value={col.key}>{col.label}</option>);
      return (
        <div>
          <label htmlFor="filterCol">Filter:</label>
          <select name="filterCol" onChange={changeFilterCol}>
            {options}
          </select>
          <label htmlFor="filterKeyword">Keyword:</label>
          <input type="text" id="filterKeyword" onChange={changeFilterKeyword} />
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
