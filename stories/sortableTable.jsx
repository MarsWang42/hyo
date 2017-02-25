import React from 'react';
import Table from '../src';

const dateSorter = (date1, date2) =>
  new Date(date1) - new Date(date2);


const dateRender = date =>
  new Date(date).toString()
    .slice(4, 15)
    .split(" ")
    .join("-");


const def = [
  {
    key: "name",
    label: "Name",
    sortable: true,
  },
  {
    key: "gender",
    label: "Gender",
    sortable: true,
  },
  {
    key: "age",
    label: "Age",
    sortable: true,
  },
  {
    key: "birthday",
    label: "Birthday",
    sortable: true,
    onSort: dateSorter,
    renderer: dateRender,
  },
];

const data = [
  { name: "Mars", gender: "Male", age: 19, birthday: "1990-08-13" },
  { name: "Tony", gender: "Male", age: 14, birthday: "2004-10-13" },
  { name: "Sunny", gender: "Female", age: 21, birthday: "1993-09-02" },
  { name: "Pierce", gender: "Male", age: 34, birthday: "2001-08-01" },
  { name: "ADL", gender: "Female", age: 12, birthday: "2003-05-27" },
  { name: "George", gender: "Female", age: 19, birthday: "2000-05-27" },
  { name: "Faris", gender: "Male", age: 16, birthday: "1994-09-04" },
  { name: "Paul", gender: "Female", age: 11, birthday: "1991-08-02" },
  { name: "Gino", gender: "Male", age: 12, birthday: "2005-09-08" },
  { name: "Thomas", gender: "Male", age: 55, birthday: "1996-01-16" },
];


export default () => <Table def={def} data={data} />;
