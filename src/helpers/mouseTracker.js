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

requestAnimationFrame(function () {});

class MouseTracker {
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
   * captureMouseMoves will track states via given event and bind
   * events onto the body.
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
   * releaseMouseMoves will release all events binded to the body.
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
   * onMouseMove will update internal states while mouse moved.
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

 /**
  * didMouseMove will be triggered to clean internal states.
  */
  didMouseMove() {
    this.animationFrameID = null;
    this.onMove(this.deltaX, this.deltaY);
    this.deltaX = 0;
    this.deltaY = 0;
  }

  /**
   * onMouseUp will be call to clean states after mouse movement done.
   */
  onMouseUp() {
    if (this.animationFrameID) {
      this.didMouseMove();
    }
    this.onMoveEnd();
  }
}

export default MouseTracker;
