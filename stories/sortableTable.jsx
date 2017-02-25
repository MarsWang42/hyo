import React from 'react';
import Table from '../src';

const def = [
  { key: "name", label: "Name", sortable: true },
  { key: "gender", label: "Gender", sortable: true },
  { key: "age", label: "Age", sortable: true },
];

const data = [
  { name: "Mars", gender: "Male", age: 19 },
  { name: "Tony", gender: "Male", age: 14 },
  { name: "Sunny", gender: "Female", age: 21 },
  { name: "Pierce", gender: "Male", age: 34 },
  { name: "ADL", gender: "Female", age: 12 },
  { name: "George", gender: "Female", age: 19 },
  { name: "Faris", gender: "Male", age: 16 },
  { name: "Paul", gender: "Female", age: 11 },
  { name: "Gino", gender: "Male", age: 12 },
  { name: "Thomas", gender: "Male", age: 55 },
];

export default () => <Table def={def} data={data} />;
