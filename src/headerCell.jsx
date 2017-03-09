import React from 'react';
import ColumnResizer from './resizeHandler';

const HeaderCell = ({ value, initialWidth, spanClass }) => {
  return (
    <div>
      <ColumnResizer initialWidth="28px" initialEvent={{clientX: 1, clientY: 2, preventDefault: function(){}}}/>
      { value }
      <span className={spanClass} />
    </div>
  );
};

export default HeaderCell;
