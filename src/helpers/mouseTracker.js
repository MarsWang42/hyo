import EventListener from './eventListener';

const cancelAnimationFrame =
  global.cancelAnimationFrame ||
  global.webkitCancelAnimationFrame ||
  global.mozCancelAnimationFrame ||
  global.oCancelAnimationFrame ||
  global.msCancelAnimationFrame ||
  global.clearTimeout;

let lastTime = 0;
const requestAnimationFrame =
  global.requestAnimationFrame ||
  global.webkitRequestAnimationFrame ||
  global.mozRequestAnimationFrame ||
  global.oRequestAnimationFrame ||
  global.msRequestAnimationFrame ||
  function (callback) {
    const currTime = Date.now();
    const timeDelay = Math.max(0, 16 - (currTime - lastTime));
    lastTime = currTime + timeDelay;
    return global.setTimeout(() => {
      callback(Date.now());
    }, timeDelay);
  };

// Works around a rare bug in Safari 6 where the first request is never invoked.
requestAnimationFrame(function () {});

class MouseMoveTracker {
  /**
   * onMove is the callback that will be called on every mouse move.
   * onMoveEnd is called on mouse up when movement has ended.
   */
  constructor(onMove, onMoveEnd, domNode) {
    this.isDragging = false;
    this.animationFrameID = null;
    this.domNode = domNode;
    this.onMove = onMove;
    this.onMoveEnd = onMoveEnd;
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.didMouseMove = this.didMouseMove.bind(this);
  }

  /**
   * This is to set up the listeners for listening to mouse move
   * and mouse up signaling the movement has ended. Please note that these
   * listeners are added at the document.body level. It takes in an event
   * in order to grab inital state.
   */
  captureMouseMoves(event) {
    if (!this.eventMoveToken && !this.eventUpToken) {
      this.eventMoveToken = EventListener.listen(
        this.domNode,
        'mousemove',
        this.onMouseMove,
      );
      this.eventUpToken = EventListener.listen(
        this.domNode,
        'mouseup',
        this.onMouseUp,
      );
    }

    if (!this.isDragging) {
      this.deltaX = 0;
      this.deltaY = 0;
      this.isDragging = true;
      this.x = event.clientX;
      this.y = event.clientY;
    }
    event.preventDefault();
  }

  /**
   * These releases all of the listeners on document.body.
   */
  releaseMouseMoves() {
    if (this.eventMoveToken && this.eventUpToken) {
      this.eventMoveToken.remove();
      this.eventMoveToken = null;
      this.eventUpToken.remove();
      this.eventUpToken = null;
    }

    if (this.animationFrameID !== null) {
      cancelAnimationFrame(this.animationFrameID);
      this.animationFrameID = null;
    }

    if (this.isDragging) {
      this.isDragging = false;
      this.x = null;
      this.y = null;
    }
  }

  /**
   * Returns whether or not if the mouse movement is being tracked.
   */
  isDragging() { return this.isDragging; }

  /**
   * Calls onMove passed into constructor and updates internal state.
   */
  onMouseMove(event) {
    const x = event.clientX;
    const y = event.clientY;

    this.deltaX += (x - this.x);
    this.deltaY += (y - this.y);

    if (this.animationFrameID === null) {
      // The mouse may move faster then the animation frame does.
      // Use `requestAnimationFramePolyfill` to avoid over-updating.
      this.animationFrameID =
        requestAnimationFrame(this.didMouseMove);
    }

    this.x = x;
    this.y = y;
    event.preventDefault();
  }

  didMouseMove() {
    this.animationFrameID = null;
    this.onMove(this.deltaX, this.deltaY);
    this.deltaX = 0;
    this.deltaY = 0;
  }

  /**
   * Calls onMoveEnd passed into constructor and updates internal state.
   */
  onMouseUp() {
    if (this.animationFrameID) {
      this.didMouseMove();
    }
    this.onMoveEnd();
  }
}

export default MouseMoveTracker;
