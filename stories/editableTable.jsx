import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Table from '../src';

const data = [
  { name: "Mars", gender: "Male", age: 19, birthday: "1990-08-13", id: 0 },
  { name: "Tony", gender: "Male", age: 14, birthday: "2004-10-13", id: 1 },
  { name: "Sunny", gender: "Female", age: 21, birthday: "1993-09-02", id: 2 },
  { name: "Pierce", gender: "Male", age: 34, birthday: "2001-08-01", id: 3 },
  { name: "ADL", gender: "Female", age: 12, birthday: "2003-05-27", id: 4 },
  { name: "George", gender: "Female", age: 19, birthday: "2000-05-27", id: 5 },
  { name: "Faris", gender: "Male", age: 16, birthday: "1994-09-04", id: 6 },
  { name: "Paul", gender: "Female", age: 11, birthday: "1991-08-02", id: 7 },
  { name: "Gino", gender: "Male", age: 12, birthday: "2005-09-08", id: 8 },
  { name: "Thomas", gender: "Male", age: 55, birthday: "1996-01-16", id: 9 },
];

class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      data: [],
      width: 0,
    };
    this.update = this.update.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  componentDidMount() {
    this.update();
    const win = window;
    if (win.addEventListener) {
      win.addEventListener('resize', this.onResize, false);
    } else if (win.attachEvent) {
      win.attachEvent('onresize', this.onResize);
    } else {
      win.onresize = this.onResize;
    }
    this.setState({ isLoading: true });
    setTimeout(() => {
      this.setState({ isLoading: false, data });
    }, 1000);
  }

  onResize() {
    clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(this.update, 16);
  }

  update() {
    if (ReactDOM.findDOMNode(this.table)) {
      const newWidth = (ReactDOM.findDOMNode(this.table).parentNode.clientWidth);
      this.setState({ width: newWidth });
    }
  }

  render() {
    const dateRender = date =>
      new Date(date).toString()
        .slice(4, 15)
        .split(" ")
        .join("-");

    const updateValue = (row, col, num, value) => {
      const newData = [...this.state.data];
      const rowToUpdate = newData.find(d => d.id === row.id);
      if (rowToUpdate[col].toString() !== value.toString()) {
        rowToUpdate[col] = value;
        this.setState({ isLoading: true });
        setTimeout(() => this.setState({ data: newData, isLoading: false }), 300);
      }
    };

    const onSort = (sortingData, key, direction) => {
      console.log(key, direction);
      return sortingData.sort((a, b) => {
        const attr1 = a[key];
        const attr2 = b[key];
        const order = !attr1 ? -1 : !attr2 ? 1 : attr1.toString().localeCompare(attr2);
        return direction === 'desc' ? order : -order;
      });
    };

    const def = [
      {
        key: "name",
        label: "Name",
        filterable: true,
        editable: true,
        onEdit: updateValue,
        width: 125,
        flexGrow: 1,
      },
      {
        key: "gender",
        label: "Gender",
        filterable: true,
        filterType: "select",
        editable: true,
        onEdit: updateValue,
        editType: "select",
        editOptions: [
          { key: "Male", label: "Male" },
          { key: "Femail", label: "Female" },
        ],
        width: 125,
        flexGrow: 1,
        resizable: true,
      },
      {
        key: "age",
        label: "Age",
        filterable: true,
        filterType: "input",
        sortable: true,
        onSort,
        editable: true,
        onEdit: updateValue,
        width: 125,
        flexGrow: 1,
      },
      {
        key: "birthday",
        label: "Birthday",
        renderer: dateRender,
        width: 125,
        flexGrow: 1,
      },
    ];

    return (
      <Table
        def={def}
        ref={(table) => { this.table = table; }}
        data={this.state.data}
        rowHeight={35}
        headerHeight={35}
        height={250}
        width={this.state.width}
        filterable
        pagination
        pageSize={10}
        isLoading={this.state.isLoading}
      />
    );
  }
}

export default () => <EditableTable />;
