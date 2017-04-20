import React from 'react';
import Table from '../src';

const def = [
  { key: "name", label: "Name" },
  { key: "gender", label: "Gender" },
];

const data = [
  { name: "Mars", gender: "Male" },
  { name: "Tony", gender: "Male" },
];

export default () => <Table def={def} data={data} width="auto" />;
