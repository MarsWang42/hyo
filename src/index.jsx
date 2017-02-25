import React, { Component } from 'react';
import './style.scss';

export default class Table extends Component {
  // Generate headers according to definition
  generateHeaders() {
    const { def } = this.props;
    const headers = def.map(col => <th key={col.key}>{col.label}</th>);
    return <thead><tr>{headers}</tr></thead>;
  }

  // Render each row according to data
  generateRows() {
    const { def, data } = this.props;
    let i = 0;
    const rows = data.map((row) => {
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
    })).isRequired,
  data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
};
