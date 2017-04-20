import React from 'react';

const HeaderCell = ({
  value,
  width,
  height,
  spanClass,
  resizable,
  onColumnResizerMouseDown,
}) => {
  let headerResizer = null;
  if (resizable) {
    const headerResizerStyle = { height };
    headerResizer = (
      <div
        className="header-resizer"
        style={headerResizerStyle}
        onMouseDown={onColumnResizerMouseDown}
      >
        <div
          className="header-resizer-knob"
          style={headerResizerStyle}
        />
      </div>
    );
    return (
      <div style={{height: "100%"}}>
        { headerResizer }
        <div className="th-content">
          { value }
          <span className={spanClass} />
        </div>
      </div>
    );
  } else {
    return (
      <div className="th-content">
        { value }
        <span className={spanClass} />
      </div>
    );
  }
};

export default HeaderCell;
