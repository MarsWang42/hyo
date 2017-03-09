const emptyFunction = function () {};

/**
 * Upstream version of event listener. Does not take into account specific
 * nature of platform.
 */
const EventListener = {
  /**
   * Listen to DOM events during the bubble phase.
   */
  listen: (target, eventType, callback) => {
    if (target.addEventListener) {
      target.addEventListener(eventType, callback, false);
      return {
        remove: () => {
          target.removeEventListener(eventType, callback, false);
        },
      };
    } else if (target.attachEvent) {
      target.attachEvent(`on${eventType}`, callback);
      return {
        remove: () => {
          target.detachEvent(`on${eventType}`, callback);
        },
      };
    }
  },

  /**
   * Listen to DOM events during the capture phase.
   */
  capture: (target, eventType, callback) => {
    if (target.addEventListener) {
      target.addEventListener(eventType, callback, true);
      return {
        remove: () => {
          target.removeEventListener(eventType, callback, true);
        },
      };
    } else {
      return { remove: emptyFunction };
    }
  },

  registerDefault: emptyFunction,
};

export default EventListener;
