const getTotalWidth = cols =>
  cols.reduce((totalWidth, col) => totalWidth += col.width || 0, 0);

const getAdjustedTotalWidth = cols =>
  cols.reduce((totalWidth, col) => totalWidth += col.adjustedWidth || 0, 0);

const getTotalFlexGrow = cols =>
  cols.reduce((totalFlexGrow, col) => totalFlexGrow += col.flexGrow || 0, 0);

const getHeaderWidth = (cols, expectedWidth) => {
  const totalColsWidth = getAdjustedTotalWidth(cols);
  return Math.max(totalColsWidth, expectedWidth);
};

const distributeFlexWidth = (cols, flexWidth) => {
  if (flexWidth <= 0) {
    return {
      cols,
      width: getTotalWidth(cols),
    };
  }
  let remainingFlexGrow = getTotalFlexGrow(cols);
  let remainingFlexWidth = flexWidth;
  const newCols = [];
  let totalWidth = 0;
  for (let i = 0; i < cols.length; i+=1) {
    const col = cols[i];
    if (!col.flexGrow) {
      totalWidth += col.width;
      newCols.push(col);
      continue;
    }
    const colFlexWidth = Math.floor((col.flexGrow / remainingFlexGrow) * remainingFlexWidth);
    const newColWidth = Math.floor(col.width + colFlexWidth);
    totalWidth += newColWidth;

    remainingFlexGrow -= col.flexGrow;
    remainingFlexWidth -= colFlexWidth;

    const newCol = Object.assign(col, { adjustedWidth: newColWidth });
    newCols.push(newCol);
  }

  return {
    cols: newCols,
    width: totalWidth,
  };
};

const adjustColWidths = (cols, expectedWidth) => {
  // Initialize cols. TODO: improve performance
  cols = cols.map(col => Object.assign(col, {adjustedWidth: col.width}));
  const colsWidth = getTotalWidth(cols);
  if (colsWidth < expectedWidth) {
    return distributeFlexWidth(cols, expectedWidth - colsWidth).cols;
  }
  return cols;
};

const WidthHelper = {
  getTotalWidth,
  getAdjustedTotalWidth,
  getTotalFlexGrow,
  getHeaderWidth,
  distributeFlexWidth,
  adjustColWidths,
};

export default WidthHelper;
