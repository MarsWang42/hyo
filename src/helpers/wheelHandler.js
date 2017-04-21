import normalizeWheel from './normalizeWheel';

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

export default class WheelHandler {
  constructor(onWheel, handleScrollX, handleScrollY, stopPropagation) {
    this.animationFrameID = null;
    this.deltaX = 0;
    this.deltaY = 0;
    this.didWheel = this.didWheel.bind(this);

    this.handleScrollX = handleScrollX || function() {};
    this.handleScrollY = handleScrollY || function() {};
    this.stopPropagation = stopPropagation || function() {};
    this.onWheelCallback = onWheel;
    this.onWheel = this.onWheel.bind(this);
  }

  onWheel(event) {
    const normalizedEvent = normalizeWheel(event);
    const deltaX = this.deltaX + normalizedEvent.pixelX;
    const deltaY = this.deltaY + normalizedEvent.pixelY;
    const handleScrollX = this.handleScrollX(deltaX, deltaY);
    const handleScrollY = this.handleScrollY(deltaY, deltaX);
    if (!handleScrollX && !handleScrollY) {
      return;
    }

    this.deltaX += handleScrollX ? normalizedEvent.pixelX : 0;
    this.deltaY += handleScrollY ? normalizedEvent.pixelY : 0;
    event.preventDefault();

    let changed;
    if (this.deltaX !== 0 || this.deltaY !== 0) {
      if (this.stopPropagation()) {
        event.stopPropagation();
      }
      changed = true;
    }

    if (changed === true && this.animationFrameID === null) {
      this.animationFrameID = requestAnimationFrame(this.didWheel);
    }
  }

  didWheel() {
    this.animationFrameID = null;
    this.onWheelCallback(this.deltaX, this.deltaY);
    this.deltaX = 0;
    this.deltaY = 0;
  }
}
