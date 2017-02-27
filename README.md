# Hyo :mount_fuji:
\- A light-weight datatable for React
## Live Demo
[Click Here](https://hyo-mars.herokuapp.com/)
## How to use
```javascript
const def = [
  { key: "name", label: "Name" },
  { key: "gender", label: "Gender" },
];

const data = [
  { name: "Mars", gender: "Male" },
  { name: "Tony", gender: "Male" },
];

export default () => <Table def={def} data={data} />;

```
