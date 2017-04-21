import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import cn from 'classnames';
import MouseTracker from './helpers/mouseTracker';
import WheelHandler from './helpers/wheelHandler';
import translateDOMPositionXY from './helpers/translateDOMPositionXY';

const KEY = {
  SPACE: 32,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};

// A flag to determine whether the scrollbar being scrolled
// last is this component or not.
let lastScrolledScrollbar = null;

const FACE_MARGIN = 10;
const FACE_MARGIN_2 = FACE_MARGIN * 2;
const FACE_SIZE_MIN = 30;
const KEYBOARD_SCROLL_AMOUNT = 40;

export default class Scrollbar extends Component {
  constructor(props) {
    super(props);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.state = this.calculateState(
      props.position || props.defaultPosition || 0,
      props.size,
      props.contentSize,
      props.orientation
    );
    this.shouldHandleX = this.shouldHandleX.bind(this);
    this.shouldHandleY = this.shouldHandleY.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseMoveEnd = this.onMouseMoveEnd.bind(this);
    this.onWheel = this.onWheel.bind(this);
    this.onWheelX = this.onWheelX.bind(this);
    this.onWheelY = this.onWheelY.bind(this);
  }

  componentWillMount() {
    const isHorizontal = this.props.orientation === 'horizontal';
    const onWheel = isHorizontal ? this.onWheelX : this.onWheelY;

    this.wheelHandler = new WheelHandler(
      onWheel,
      this.shouldHandleX,
      this.shouldHandleY,
    );
  }

  componentDidMount() {
    this.mouseMoveTracker = new MouseTracker(
      this.onMouseMove,
      this.onMouseMoveEnd,
      document.documentElement,
    );

    if (this.props.position !== undefined &&
      this.state.position !== this.props.position) {
      this.didScroll();
    }
  }

  componentWillUnmount() {
    this.nextState = null;
    this.mouseMoveTracker.releaseMouseMoves();
    if (lastScrolledScrollbar === this) {
      lastScrolledScrollbar = null;
    }
    delete this.mouseMoveTracker;
  }

  componentWillReceiveProps(nextProps) {
    const controlledPosition = nextProps.position;
    if (controlledPosition === undefined) {
      this.setNextState(
        this.calculateState(
          this.state.position,
          nextProps.size,
          nextProps.contentSize,
          nextProps.orientation
        )
      );
    } else {
      this.setNextState(
        this.calculateState(
          controlledPosition,
          nextProps.size,
          nextProps.contentSize,
          nextProps.orientation
        ),
        nextProps,
      );
    }
  }

  // These methods are used to handle the wheel events.
  // shouldHandleX and should HandleY will tell whether
  // the onWheel function should be triggered or not.

  shouldHandleX(delta) {
    return this.props.orientation === 'horizontal' ?
      this.shouldHandleChange(delta) :
      false;
  }

  shouldHandleY(delta) {
    return this.props.orientation !== 'horizontal' ?
      this.shouldHandleChange(delta) :
      false;
  }

  shouldHandleChange(delta) {
    const { size, contentSize, orientation } = this.props;
    const nextState = this.calculateState(
      this.state.position + delta,
      size,
      contentSize,
      orientation,
    );
    return nextState.position !== this.state.position;
  }

  onWheelY(deltaX, deltaY) {
    this.onWheel(deltaY);
  }

  onWheelX(deltaX, deltaY) {
    this.onWheel(deltaX);
  }

  onWheel(delta) {
    const { size, contentSize, orientation } = this.props;

    this.setNextState(
      this.calculateState(
        this.state.position + delta,
        size,
        contentSize,
        orientation,
      ),
    );
  }

  onMouseDown(event) {
    let nextState;

    if (event.target !== ReactDOM.findDOMNode(this.refs.face)) {
      // Both `offsetX` and `layerX` are non-standard DOM property but they are
      // magically available for browsers somehow.
      const nativeEvent = event.nativeEvent;
      const { size, contentSize, orientation } = this.props;
      let position = this.state.isHorizontal ?
        nativeEvent.offsetX || nativeEvent.layerX :
        nativeEvent.offsetY || nativeEvent.layerY;

      // MouseDown on the scroll-track directly, move the center of the
      // scroll-face to the mouse position.
      position /= this.state.scale;
      nextState = this.calculateState(
        position - (this.state.faceSize * 0.5 / this.state.scale),
        size,
        contentSize,
        orientation,
      );
    } else {
      nextState = {};
    }

    nextState.focused = true;
    this.setNextState(nextState);

    this.mouseMoveTracker.captureMouseMoves(event);
    // Focus the node so it may receive keyboard event.
    ReactDOM.findDOMNode(this).focus();
  }

  onMouseMove(deltaX, deltaY) {
    const { size, contentSize, orientation } = this.props;
    let delta = this.state.isHorizontal ? deltaX : deltaY;
    delta /= this.state.scale;

    this.setNextState(
      this.calculateState(
        this.state.position + delta,
        size,
        contentSize,
        orientation,
      ),
    );
  }

  onMouseMoveEnd() {
    this.nextState = null;
    this.mouseMoveTracker.releaseMouseMoves();
    this.setState({ isDragging: false });
  }

  // This function is to calculate and update the state after
  // user input or props update.
  calculateState(position, size, contentSize, orientation) {
    if (size < 1 || contentSize <= size) {
      return {
        position: 0,
        scrollable: false,
      };
    }

    // If state is not changed, save the calculation.
    const stateKey = `${position}_${size}_${contentSize}_${orientation}`;
    if (this.stateKey === stateKey) {
      return this.stateForKey;
    }

    const isHorizontal = orientation === 'horizontal';
    let scale = size / contentSize;
    let faceSize = size * scale;

    if (faceSize < FACE_SIZE_MIN) {
      scale = (size - FACE_SIZE_MIN) / (contentSize - size);
      faceSize = FACE_SIZE_MIN;
    }

    const scrollable = true;
    const maxPosition = contentSize - size;

    if (position < 0) {
      position = 0;
    } else if (position > maxPosition) {
      position = maxPosition;
    }

    const isDragging = this.mouseMoveTracker ?
      this.mouseMoveTracker.isDragging :
      false;

    const state = {
      faceSize,
      isDragging,
      isHorizontal,
      position,
      scale,
      scrollable,
    };

    // cache the state for later use.
    this.stateKey = stateKey;
    this.stateForKey = state;
    return state;
  }

  setNextState(nextState, props) {
    props = props || this.props;
    const controlledPosition = props.position;
    const willScroll = this.state.position !== nextState.position;
    if (controlledPosition === undefined) {
      const callback = willScroll ? this.didScroll : undefined;
      this.setState(nextState, callback);
    } else if (controlledPosition === nextState.position) {
      this.setState(nextState);
    } else {
      // Scrolling is controlled. Don't update the state and let the owner
      // to update the scrollbar instead.
      if (nextState.position !== undefined &&
        nextState.position !== this.state.position) {
        this.props.onScroll(nextState.position);
      }
      return;
    }

    if (willScroll && lastScrolledScrollbar !== this) {
      lastScrolledScrollbar && lastScrolledScrollbar.blur();
      lastScrolledScrollbar = this;
    }
  }

  didScroll() {
    this.props.onScroll(this.state.position);
  }

  onFocus() {
    this.setState({
      focused: true,
    });
  }

  onBlur() {
    this.setState({
      focused: false,
    });
  }

  onKeyDown(event) {
    const keyCode = event.keyCode;
    const { size, contentSize, orientation } = this.props;
    let distance = KEYBOARD_SCROLL_AMOUNT;
    let direction = 0;

    if (this.state.isHorizontal) {
      switch (keyCode) {
        case KEY.HOME:
          direction = -1;
          distance = contentSize;
          break;

        case KEY.LEFT:
          direction = -1;
          break;

        case KEY.RIGHT:
          direction = 1;
          break;

        default:
          return;
      }
    }

    if (!this.state.isHorizontal) {
      switch (keyCode) {
        case KEY.SPACE:
          if (event.shiftKey) {
            direction = -1;
          } else {
            direction = 1;
          }
          break;

        case KEY.HOME:
          direction = -1;
          distance = this.props.contentSize;
          break;

        case KEY.UP:
          direction = -1;
          break;

        case KEY.DOWN:
          direction = 1;
          break;

        case KEY.PAGE_UP:
          direction = -1;
          distance = this.props.size;
          break;

        case KEY.PAGE_DOWN:
          direction = 1;
          distance = this.props.size;
          break;

        default:
          return;
      }
    }

    event.preventDefault();

    this.setNextState(
      this.calculateState(
        this.state.position + (distance * direction),
        size,
        contentSize,
        orientation,
      ),
    );
  }

  render() {
    if (!this.state.scrollable) {
      return null;
    }
    const { isHorizontal, isActive, faceSize, scale } = this.state;
    const { size, isOpaque, zIndex } = this.props;
    const isVertical = !isHorizontal;
    const verticalTop = this.props.verticalTop || 0;
    const position = this.state.position * scale + FACE_MARGIN;

    let mainStyle;
    let faceStyle;

    const mainClassName = cn({
      'ScrollbarLayout-main': true,
      'ScrollbarLayout-mainVertical': isVertical,
      'ScrollbarLayout-mainHorizontal': isHorizontal,
      'public-Scrollbar-main': true,
      'public-Scrollbar-mainOpaque': isOpaque,
      'public-Scrollbar-mainActive': isActive,
    });

    const faceClassName = cn({
      'ScrollbarLayout-face': true,
      'ScrollbarLayout-faceHorizontal': isHorizontal,
      'ScrollbarLayout-faceVertical': isVertical,
      'public-Scrollbar-faceActive': isActive,
      'public-Scrollbar-face': true,
    });

    if (isHorizontal) {
      mainStyle = {
        width: size,
      };
      faceStyle = {
        width: faceSize - FACE_MARGIN_2,
      };
      translateDOMPositionXY(faceStyle, position, 0);
    } else {
      mainStyle = {
        top: verticalTop,
        height: size,
      };
      faceStyle = {
        height: faceSize - FACE_MARGIN_2,
      };
      translateDOMPositionXY(faceStyle, 0, position);
    }

    mainStyle.zIndex = zIndex;

    return (
      <div
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
        onMouseDown={this.onMouseDown}
        onWheel={this.wheelHandler.onWheel}
        className={mainClassName}
        style={mainStyle}
        tabIndex={0}
      >
        <div
          ref="face"
          className={faceClassName}
          style={faceStyle}
        />
      </div>
    );
  }
}
