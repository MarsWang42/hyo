/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableNew.react
 * @typechecks
 * @noflow
 */

import PrefixIntervalTree from './prefixIntervalTree';

const clamp = (val, min, max) => {
  if (val > max) val = max;
  if (val < min) val = min;
  return val;
};

const BUFFER_ROWS = 5;
const NO_ROWS_SCROLL_RESULT = {
  index: 0,
  offset: 0,
  position: 0,
  contentHeight: 0,
};

export default class FixedDataTableScrollHelper {
  constructor(rowCount, defaultRowHeight, viewportHeight, rowHeightGetter) {
    this.rowOffsets = PrefixIntervalTree.uniform(rowCount, defaultRowHeight);
    this.storedHeights = new Array(rowCount);
    for (let i = 0; i < rowCount; ++i) {
      this.storedHeights[i] = defaultRowHeight;
    }
    this.rowCount = rowCount;
    this.position = 0;
    this.contentHeight = rowCount * defaultRowHeight;
    this.defaultRowHeight = defaultRowHeight;
    this.rowHeightGetter = rowHeightGetter ?
      rowHeightGetter :
      () => defaultRowHeight;
    this.viewportHeight = viewportHeight;
    this.scrollRowIntoView = this.scrollRowIntoView.bind(this);
    this.setViewportHeight = this.setViewportHeight.bind(this);
    this.scrollBy = this.scrollBy.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.scrollToRow = this.scrollToRow.bind(this);
    this.setRowHeightGetter = this.setRowHeightGetter.bind(this);
    this.getContentHeight = this.getContentHeight.bind(this);
    this.getRowPosition = this.getRowPosition.bind(this);

    this.updateHeightsInViewport(0, 0);
  }

  setRowHeightGetter(rowHeightGetter) {
    this.rowHeightGetter = rowHeightGetter;
  }

  setViewportHeight(viewportHeight) {
    this.viewportHeight = viewportHeight;
  }

  getContentHeight() {
    return this.contentHeight;
  }

  updateHeightsInViewport(firstRowIndex, firstRowOffset) {
    let top = firstRowOffset;
    let index = firstRowIndex;
    while (top <= this.viewportHeight && index < this.rowCount) {
      this.updateRowHeight(index);
      top += this.storedHeights[index];
      index++;
    }
  }

  updateHeightsAboveViewport(firstRowIndex) {
    let index = firstRowIndex - 1;
    while (index >= 0 && index >= firstRowIndex - BUFFER_ROWS) {
      const delta = this.updateRowHeight(index);
      this.position += delta;
      index--;
    }
  }

  updateRowHeight(rowIndex) {
    if (rowIndex < 0 || rowIndex >= this.rowCount) {
      return 0;
    }
    const newHeight = this.rowHeightGetter(rowIndex);
    if (newHeight !== this.storedHeights[rowIndex]) {
      const change = newHeight - this.storedHeights[rowIndex];
      this.rowOffsets.set(rowIndex, newHeight);
      this.storedHeights[rowIndex] = newHeight;
      this.contentHeight += change;
      return change;
    }
    return 0;
  }

  getRowPosition(rowIndex) {
    this.updateRowHeight(rowIndex);
    return this.rowOffsets.sumUntil(rowIndex);
  }

  scrollBy(delta) {
    if (this.rowCount === 0) {
      return NO_ROWS_SCROLL_RESULT;
    }
    let firstRow = this.rowOffsets.greatestLowerBound(this.position);
    firstRow = clamp(firstRow, 0, Math.max(this.rowCount - 1, 0));
    let firstRowPosition = this.rowOffsets.sumUntil(firstRow);
    let rowIndex = firstRow;
    let position = this.position;

    const rowHeightChange = this.updateRowHeight(rowIndex);
    if (firstRowPosition !== 0) {
      position += rowHeightChange;
    }
    let visibleRowHeight = this.storedHeights[rowIndex] -
      (position - firstRowPosition);

    if (delta >= 0) {
      while (delta > 0 && rowIndex < this.rowCount) {
        if (delta < visibleRowHeight) {
          position += delta;
          delta = 0;
        } else {
          delta -= visibleRowHeight;
          position += visibleRowHeight;
          rowIndex++;
        }
        if (rowIndex < this.rowCount) {
          this.updateRowHeight(rowIndex);
          visibleRowHeight = this.storedHeights[rowIndex];
        }
      }
    } else if (delta < 0) {
      delta = -delta;
      let invisibleRowHeight = this.storedHeights[rowIndex] - visibleRowHeight;

      while (delta > 0 && rowIndex >= 0) {
        if (delta < invisibleRowHeight) {
          position -= delta;
          delta = 0;
        } else {
          position -= invisibleRowHeight;
          delta -= invisibleRowHeight;
          rowIndex--;
        }
        if (rowIndex >= 0) {
          const change = this.updateRowHeight(rowIndex);
          invisibleRowHeight = this.storedHeights[rowIndex];
          position += change;
        }
      }
    }

    const maxPosition = this.contentHeight - this.viewportHeight;
    position = clamp(position, 0, maxPosition);
    this.position = position;
    let firstRowIndex = this.rowOffsets.greatestLowerBound(position);
    firstRowIndex = clamp(firstRowIndex, 0, Math.max(this.rowCount - 1, 0));
    firstRowPosition = this.rowOffsets.sumUntil(firstRowIndex);
    const firstRowOffset = firstRowPosition - position;

    this.updateHeightsInViewport(firstRowIndex, firstRowOffset);
    this.updateHeightsAboveViewport(firstRowIndex);

    return {
      index: firstRowIndex,
      offset: firstRowOffset,
      position: this.position,
      contentHeight: this.contentHeight,
    };
  }

  getRowAtEndPosition(rowIndex) {
    // We need to update enough rows above the selected one to be sure that when
    // we scroll to selected position all rows between first shown and selected
    // one have most recent heights computed and will not resize
    this.updateRowHeight(rowIndex);
    let currentRowIndex = rowIndex;
    let top = this.storedHeights[currentRowIndex];
    while (top < this.viewportHeight && currentRowIndex >= 0) {
      currentRowIndex--;
      if (currentRowIndex >= 0) {
        this.updateRowHeight(currentRowIndex);
        top += this.storedHeights[currentRowIndex];
      }
    }
    let position = this.rowOffsets.sumTo(rowIndex) - this.viewportHeight;
    if (position < 0) {
      position = 0;
    }
    return position;
  }

  scrollTo(position) {
    if (this.rowCount === 0) {
      return NO_ROWS_SCROLL_RESULT;
    }
    if (position <= 0) {
      // If position less than or equal to 0 first row should be fully visible
      // on top
      this.position = 0;
      this.updateHeightsInViewport(0, 0);

      return {
        index: 0,
        offset: 0,
        position: this.position,
        contentHeight: this.contentHeight,
      };
    } else if (position >= this.contentHeight - this.viewportHeight) {
      // If position is equal to or greater than max scroll value, we need
      // to make sure to have bottom border of last row visible.
      const rowIndex = this.rowCount - 1;
      position = this.getRowAtEndPosition(rowIndex);
    }
    this.position = position;

    let firstRowIndex = this.rowOffsets.greatestLowerBound(position);
    firstRowIndex = clamp(firstRowIndex, 0, Math.max(this.rowCount - 1, 0));
    const firstRowPosition = this.rowOffsets.sumUntil(firstRowIndex);
    const firstRowOffset = firstRowPosition - position;

    this.updateHeightsInViewport(firstRowIndex, firstRowOffset);
    this.updateHeightsAboveViewport(firstRowIndex);

    return {
      index: firstRowIndex,
      offset: firstRowOffset,
      position: this.position,
      contentHeight: this.contentHeight,
    };
  }

  /**
   * Allows to scroll to selected row with specified offset. It always
   * brings that row to top of viewport with that offset
   */
  scrollToRow(rowIndex, offset) {
    rowIndex = clamp(rowIndex, 0, Math.max(this.rowCount - 1, 0));
    offset = clamp(offset, -this.storedHeights[rowIndex], 0);
    const firstRow = this.rowOffsets.sumUntil(rowIndex);
    return this.scrollTo(firstRow - offset);
  }

  /**
   * Allows to scroll to selected row by bringing it to viewport with minimal
   * scrolling. This that if row is fully visible, scroll will not be changed.
   * If top border of row is above top of viewport it will be scrolled to be
   * fully visible on the top of viewport. If the bottom border of row is
   * below end of viewport, it will be scrolled up to be fully visible on the
   * bottom of viewport.
   */
  scrollRowIntoView(rowIndex) {
    rowIndex = clamp(rowIndex, 0, Math.max(this.rowCount - 1, 0));
    const rowBegin = this.rowOffsets.sumUntil(rowIndex);
    const rowEnd = rowBegin + this.storedHeights[rowIndex];
    if (rowBegin < this.position) {
      return this.scrollTo(rowBegin);
    } else if (this.position + this.viewportHeight < rowEnd) {
      const position = this.getRowAtEndPosition(rowIndex);
      return this.scrollTo(position);
    }
    return this.scrollTo(this.position);
  }
}
