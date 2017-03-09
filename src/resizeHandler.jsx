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
      cursorDelta: 0,
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
    if (newProps.initialEvent && !this.mouseTracker.isDragging) {
      this.mouseTracker.captureMouseMoves(newProps.initialEvent);
      this.setState({
        width: newProps.initialWidth,
        cursorDelta: newProps.initialWidth,
      });
    }
  }

  componentWillUnmount() {
    this.mouseTracker.releaseMouseMoves();
    this.mouseTracker = null;
  }

  onMove(deltaX) {
    const newWidth = this.state.cursorDelta + deltaX;
    const newColumnWidth = clamp(newWidth, this.props.maxWidth, this.props.minWidth);

    this.setState({
      width: newColumnWidth,
      cursorDelta: newWidth,
    });
  }

  onColumnResizeEnd() {
    this.mouseTracker.releaseMouseMoves();
    this.props.onColumnResizeEnd(
      this.state.width,
      this.props.columnKey
    );
  }

  render() {
    const style = {
      width: this.state.width,
      height: this.props.height,
    };
    return (
      <div className="column-resizer" style={style}>
        <div
          className="column-resizer-mouse-area"
          style={{ height: this.props.height }}
        />
      </div>
    );
  }
}
