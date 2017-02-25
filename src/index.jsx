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
    };
  }

  componentWillMount() {
    this.initializeStates();
  }

  initializeStates() {
    this.setState({
      sortedRows: this.props.data,
    });
  }

  // Help function to sort rows according to given column
  sortColumn(key) {
    const {
      sortingCol,
      sortingDirection,
      sortedRows,
    } = this.state;
    // Figure out the current direction.
    // If column is not select, then set direction to be asc.
    // If it is already selected, set to be the opposite direction.
    const dr = key !== sortingCol ? 'asc' :
      sortingDirection === 'asc' ? 'desc' : 'asc';
    const updatedRows = sortedRows.sort((a, b) => {
      const attr1 = a[key];
      const attr2 = b[key];
      const order = !attr1 ? -1 : !attr2 ? 1 : attr1.toString().localeCompare(attr2);
      return dr === 'asc' ? order : -order;
    });

    this.setState({
      sortingCol: key,
      sortingDirection: dr,
      sortedRows: updatedRows,
    });
  }

  // Generate headers according to definition
  generateHeaders() {
    const { def } = this.props;
    const { sortingCol, sortingDirection } = this.state;
    const headers = def.map((col) => {
      const thClassName = cn({ "sortable": col.sortable });
      const spanClassName = cn({
        "sort": col.sortable,
        "sortup": col.sortable && col.key === sortingCol && sortingDirection === "asc",
        "sortdown": col.sortable && col.key === sortingCol && sortingDirection === "desc",
      });
      return (<th key={col.key} className={thClassName} onClick={() => this.sortColumn(col.key)}>
        {col.label}<span className={spanClassName} />
      </th>);
    });
    return <thead><tr>{headers}</tr></thead>;
  }

  // Render each row according to data
  generateRows() {
    const { def } = this.props;
    const { sortedRows } = this.state;
    let i = 0;
    const rows = sortedRows.map((row) => {
      i+=1;
      const cell = def.map(col =>
        <td key={`hyo-cell-${col.key}-${i}`}>{ row[col.key] }</td>);
      return <tr key={`hyo-row-${i}`}>{ cell }</tr>;
    });
    return <tbody>{ rows }</tbody>;
  }

  // Generate the whole table
  generateTable() {
    return (
      <table className="rwd-table">
        { this.generateHeaders() }
        { this.generateRows() }
      </table>
    );
  }

  render() {
    return this.generateTable();
  }
}

Table.propTypes = {
  def: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      key: React.PropTypes.string.isRequired,
      label: React.PropTypes.string.isRequired,
      sortable: React.PropTypes.bool,
    })).isRequired,
  data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
};
