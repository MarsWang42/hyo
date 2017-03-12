import React, { Component, PropTypes } from 'react';
import MouseTracker from './helpers/mouseTracker';
import Utils from './helpers/utils';

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
    if (!Utils.isEmpty(initialEvent)) {
      this.mouseTracker.captureMouseMoves(initialEvent);
      this.setState({
        width: initialWidth,
        resizerPosition: (leftOffset + initialWidth) - 1,
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
    const { mousePosition } = this.state;
    const newMousePosition = mousePosition + deltaX;
    const newWidth = newMousePosition - leftOffset;
    const newColumnWidth = clamp(newWidth, maxWidth, minWidth);
    const newResizerPosition = (leftOffset + newColumnWidth) - 1;

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
      this.props.colKey,
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

ResizeHandler.propTypes = {
  height: PropTypes.number,
  leftOffset: PropTypes.number,
  maxWidth: PropTypes.number,
  minWidth: PropTypes.number,
  colKey: PropTypes.string,
  onColumnResizeEnd: PropTypes.func,
  isColumnResizing: PropTypes.bool,
};

ResizeHandler.defaultProps = {
  height: 0,
  leftOffset: 0,
  maxWidth: 1000,
  minWidth: 0,
  colKey: "",
  onColumnResizeEnd: null,
  isColumnResizing: false,
};
