import { storiesOf } from '@kadira/storybook';
import SimpleTable from './simpleTable';
import SortableTable from './sortableTable';
import FilterableTable from './filterableTable';


storiesOf('Hyo Tables', module)
  .add('Simple Table', SimpleTable)
  .add('Sortable Table', SortableTable)
  .add('Filterable Table', FilterableTable);
