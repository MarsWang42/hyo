import React from 'react';
import Table from '../src';
import data from './data';

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

export default () => <Table def={def} data={data} filterable pagination pageSize={10} />;
