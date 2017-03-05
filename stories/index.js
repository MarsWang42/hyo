import { storiesOf } from '@kadira/storybook';
import SimpleTable from './simpleTable';
import SortableTable from './sortableTable';
import FilterableTable from './filterableTable';
import BigTable from './bigTable';
import PaginationTable from './paginationTable';
import EditableTable from './editableTable';


storiesOf('Hyo Tables', module)
  .add('Simple Table', SimpleTable)
  .add('Sortable Table', SortableTable)
  .add('Filterable Table', FilterableTable)
  .add('5k lines Table', BigTable)
  .add('Pagination Table', PaginationTable)
  .add('Editable Table', EditableTable);
