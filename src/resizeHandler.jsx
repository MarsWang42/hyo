import React, { Component, PropTypes } from 'react';
import MouseTracker from './helpers/mouseTracker';

const clamp = (width, maxWidth, minWidth) => {
  if (width > maxWidth) width = maxWidth;
  if (width < minWidth) width = minWidth;
  return width;
};

export default class ResizeHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      resizerPosition: 0,
      mousePosition: 0,
    };
    this.onMove = this.onMove.bind(this);
    this.onColumnResizeEnd = this.onColumnResizeEnd.bind(this);
  }

  componentDidMount() {
    this.mouseTracker = new MouseTracker(
      this.onMove,
      this.onColumnResizeEnd,
      document.body
    );
  }

  componentWillReceiveProps(newProps) {
    const { initialEvent, leftOffset, initialWidth } = newProps;
    if (initialEvent) {
      this.mouseTracker.captureMouseMoves(initialEvent);
      this.setState({
        width: initialWidth,
        resizerPosition: leftOffset,
        mousePosition: leftOffset + initialWidth,
      });
    }
  }

  componentWillUnmount() {
    this.mouseTracker.releaseMouseMoves();
    this.mouseTracker = null;
  }

  onMove(deltaX) {
    const { leftOffset, maxWidth, minWidth } = this.props;
    const { mousePosition, width } = this.state;
    const newMousePosition = mousePosition + deltaX;
    const newWidth = newMousePosition - leftOffset;
    const newColumnWidth = clamp(newWidth, maxWidth, minWidth);
    const newResizerPosition = leftOffset + newColumnWidth;

    this.setState({
      width: newColumnWidth,
      resizerPosition: newResizerPosition,
      mousePosition: newMousePosition,
    });
  }

  onColumnResizeEnd() {
    this.mouseTracker.releaseMouseMoves();
    this.props.onColumnResizeEnd(
      this.state.width,
      this.props.columnKey,
    );
  }

  render() {
    const style = {
      width: this.state.resizerPosition,
      height: this.props.height,
      display: this.props.isColumnResizing? "block" : "none",
    };
    return (
      <div className="column-resizer" style={style} />
    );
  }
}
