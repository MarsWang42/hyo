import { storiesOf } from '@kadira/storybook';
import SimpleTable from './simpleTable';
import SortableTable from './sortableTable';


storiesOf('Hyo Tables', module)
  .add('Simple Table', SimpleTable)
  .add('Sortable Table', SortableTable);
