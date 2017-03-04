import React, { Component } from 'react';
import Table from '../src';
import data from './data';

class BigTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      data: [],
    };
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    setTimeout(() => {
      this.setState({ isLoading: false, data });
    }, 1000);
  }

  render() {
    const dateRender = date =>
      new Date(date).toString()
        .slice(4, 15)
        .split(" ")
        .join("-");

    const def = [
      {
        key: "name",
        label: "Name",
        filterable: true,
      },
      {
        key: "gender",
        label: "Gender",
        filterable: true,
        filterType: "select",
        filterTypehead: true,
      },
      {
        key: "age",
        label: "Age",
        filterable: true,
        filterType: "input",
        sortable: true,
      },
      {
        key: "birthday",
        label: "Birthday",
        renderer: dateRender,
      },
    ];

    return (
      <Table
        def={def}
        data={this.state.data}
        filterable
        pagination
        pageSize={10}
        isLoading={this.state.isLoading}
      />
    );
  }
}

export default () => <BigTable />;
