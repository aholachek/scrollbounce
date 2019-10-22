// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"../node_modules/rebound/dist/rebound.js":[function(require,module,exports) {
var define;
var global = arguments[3];
var process = require("process");
/**
 *  Copyright (c) 2013, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.rebound = factory();
})(this, function () {
  'use strict';

  var _onFrame = void 0;

  if (typeof window !== 'undefined') {
    _onFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame;
  }

  if (!_onFrame && typeof process !== 'undefined' && process.title === 'node') {
    _onFrame = setImmediate;
  }

  _onFrame = _onFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };

  var _onFrame$1 = _onFrame;
  /* eslint-disable flowtype/no-weak-types */

  var concat = Array.prototype.concat;
  var slice = Array.prototype.slice; // Bind a function to a context object.

  function bind(func, context) {
    for (var _len = arguments.length, outerArgs = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      outerArgs[_key - 2] = arguments[_key];
    }

    return function () {
      for (var _len2 = arguments.length, innerArgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        innerArgs[_key2] = arguments[_key2];
      }

      func.apply(context, concat.call(outerArgs, slice.call(innerArgs)));
    };
  } // Add all the properties in the source to the target.


  function extend(target, source) {
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
  } // Cross browser/node timer functions.


  function onFrame(func) {
    return _onFrame$1(func);
  } // Lop off the first occurence of the reference in the Array.


  function removeFirst(array, item) {
    var idx = array.indexOf(item);
    idx !== -1 && array.splice(idx, 1);
  }

  var colorCache = {};
  /**
   * Converts a hex-formatted color string to its rgb-formatted equivalent. Handy
   * when performing color tweening animations
   * @public
   * @param colorString A hex-formatted color string
   * @return An rgb-formatted color string
   */

  function hexToRGB(colorString) {
    if (colorCache[colorString]) {
      return colorCache[colorString];
    }

    var normalizedColor = colorString.replace('#', '');

    if (normalizedColor.length === 3) {
      normalizedColor = normalizedColor[0] + normalizedColor[0] + normalizedColor[1] + normalizedColor[1] + normalizedColor[2] + normalizedColor[2];
    }

    var parts = normalizedColor.match(/.{2}/g);

    if (!parts || parts.length < 3) {
      throw new Error('Expected a color string of format #rrggbb');
    }

    var ret = {
      r: parseInt(parts[0], 16),
      g: parseInt(parts[1], 16),
      b: parseInt(parts[2], 16)
    };
    colorCache[colorString] = ret;
    return ret;
  }
  /**
   * Converts a rgb-formatted color string to its hex-formatted equivalent. Handy
   * when performing color tweening animations
   * @public
   * @param colorString An rgb-formatted color string
   * @return A hex-formatted color string
   */


  function rgbToHex(rNum, gNum, bNum) {
    var r = rNum.toString(16);
    var g = gNum.toString(16);
    var b = bNum.toString(16);
    r = r.length < 2 ? '0' + r : r;
    g = g.length < 2 ? '0' + g : g;
    b = b.length < 2 ? '0' + b : b;
    return '#' + r + g + b;
  }

  var util = Object.freeze({
    bind: bind,
    extend: extend,
    onFrame: onFrame,
    removeFirst: removeFirst,
    hexToRGB: hexToRGB,
    rgbToHex: rgbToHex
  });
  /**
   * This helper function does a linear interpolation of a value from
   * one range to another. This can be very useful for converting the
   * motion of a Spring to a range of UI property values. For example a
   * spring moving from position 0 to 1 could be interpolated to move a
   * view from pixel 300 to 350 and scale it from 0.5 to 1. The current
   * position of the `Spring` just needs to be run through this method
   * taking its input range in the _from_ parameters with the property
   * animation range in the _to_ parameters.
   * @public
   */

  function mapValueInRange(value, fromLow, fromHigh, toLow, toHigh) {
    var fromRangeSize = fromHigh - fromLow;
    var toRangeSize = toHigh - toLow;
    var valueScale = (value - fromLow) / fromRangeSize;
    return toLow + valueScale * toRangeSize;
  }
  /**
   * Interpolate two hex colors in a 0 - 1 range or optionally provide a
   * custom range with fromLow,fromHight. The output will be in hex by default
   * unless asRGB is true in which case it will be returned as an rgb string.
   *
   * @public
   * @param asRGB Whether to return an rgb-style string
   * @return A string in hex color format unless asRGB is true, in which case a string in rgb format
   */


  function interpolateColor(val, startColorStr, endColorStr) {
    var fromLow = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var fromHigh = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
    var asRGB = arguments[5];
    var startColor = hexToRGB(startColorStr);
    var endColor = hexToRGB(endColorStr);
    var r = Math.floor(mapValueInRange(val, fromLow, fromHigh, startColor.r, endColor.r));
    var g = Math.floor(mapValueInRange(val, fromLow, fromHigh, startColor.g, endColor.g));
    var b = Math.floor(mapValueInRange(val, fromLow, fromHigh, startColor.b, endColor.b));

    if (asRGB) {
      return 'rgb(' + r + ',' + g + ',' + b + ')';
    } else {
      return rgbToHex(r, g, b);
    }
  }

  function degreesToRadians(deg) {
    return deg * Math.PI / 180;
  }

  function radiansToDegrees(rad) {
    return rad * 180 / Math.PI;
  }

  var MathUtil = Object.freeze({
    mapValueInRange: mapValueInRange,
    interpolateColor: interpolateColor,
    degreesToRadians: degreesToRadians,
    radiansToDegrees: radiansToDegrees
  }); // Math for converting from
  // [Origami](http://facebook.github.io/origami/) to
  // [Rebound](http://facebook.github.io/rebound).
  // You mostly don't need to worry about this, just use
  // SpringConfig.fromOrigamiTensionAndFriction(v, v);

  function tensionFromOrigamiValue(oValue) {
    return (oValue - 30.0) * 3.62 + 194.0;
  }

  function origamiValueFromTension(tension) {
    return (tension - 194.0) / 3.62 + 30.0;
  }

  function frictionFromOrigamiValue(oValue) {
    return (oValue - 8.0) * 3.0 + 25.0;
  }

  function origamiFromFriction(friction) {
    return (friction - 25.0) / 3.0 + 8.0;
  }

  var OrigamiValueConverter = Object.freeze({
    tensionFromOrigamiValue: tensionFromOrigamiValue,
    origamiValueFromTension: origamiValueFromTension,
    frictionFromOrigamiValue: frictionFromOrigamiValue,
    origamiFromFriction: origamiFromFriction
  });

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
  /**
   * Plays each frame of the SpringSystem on animation
   * timing loop. This is the default type of looper for a new spring system
   * as it is the most common when developing UI.
   * @public
   */

  /**
   *  Copyright (c) 2013, Facebook, Inc.
   *  All rights reserved.
   *
   *  This source code is licensed under the BSD-style license found in the
   *  LICENSE file in the root directory of this source tree. An additional grant
   *  of patent rights can be found in the PATENTS file in the same directory.
   *
   * 
   */


  var AnimationLooper = function () {
    function AnimationLooper() {
      classCallCheck(this, AnimationLooper);
      this.springSystem = null;
    }

    AnimationLooper.prototype.run = function run() {
      var springSystem = getSpringSystem.call(this);
      onFrame(function () {
        springSystem.loop(Date.now());
      });
    };

    return AnimationLooper;
  }();
  /**
   * Resolves the SpringSystem to a resting state in a
   * tight and blocking loop. This is useful for synchronously generating
   * pre-recorded animations that can then be played on a timing loop later.
   * Sometimes this lead to better performance to pre-record a single spring
   * curve and use it to drive many animations; however, it can make dynamic
   * response to user input a bit trickier to implement.
   * @public
   */


  var SimulationLooper = function () {
    function SimulationLooper(timestep) {
      classCallCheck(this, SimulationLooper);
      this.springSystem = null;
      this.time = 0;
      this.running = false;
      this.timestep = timestep || 16.667;
    }

    SimulationLooper.prototype.run = function run() {
      var springSystem = getSpringSystem.call(this);

      if (this.running) {
        return;
      }

      this.running = true;

      while (!springSystem.getIsIdle()) {
        springSystem.loop(this.time += this.timestep);
      }

      this.running = false;
    };

    return SimulationLooper;
  }();
  /**
   * Resolves the SpringSystem one step at a
   * time controlled by an outside loop. This is useful for testing and
   * verifying the behavior of a SpringSystem or if you want to control your own
   * timing loop for some reason e.g. slowing down or speeding up the
   * simulation.
   * @public
   */


  var SteppingSimulationLooper = function () {
    function SteppingSimulationLooper() {
      classCallCheck(this, SteppingSimulationLooper);
      this.springSystem = null;
      this.time = 0;
      this.running = false;
    }

    SteppingSimulationLooper.prototype.run = function run() {} // this.run is NOOP'd here to allow control from the outside using
    // this.step.
    // Perform one step toward resolving the SpringSystem.
    ;

    SteppingSimulationLooper.prototype.step = function step(timestep) {
      var springSystem = getSpringSystem.call(this);
      springSystem.loop(this.time += timestep);
    };

    return SteppingSimulationLooper;
  }();

  function getSpringSystem() {
    if (this.springSystem == null) {
      throw new Error('cannot run looper without a springSystem');
    }

    return this.springSystem;
  }

  var Loopers = Object.freeze({
    AnimationLooper: AnimationLooper,
    SimulationLooper: SimulationLooper,
    SteppingSimulationLooper: SteppingSimulationLooper
  });
  /**
   * Provides math for converting from Origami PopAnimation
   * config values to regular Origami tension and friction values. If you are
   * trying to replicate prototypes made with PopAnimation patches in Origami,
   * then you should create your springs with
   * SpringSystem.createSpringWithBouncinessAndSpeed, which uses this Math
   * internally to create a spring to match the provided PopAnimation
   * configuration from Origami.
   */

  var BouncyConversion = function () {
    function BouncyConversion(bounciness, speed) {
      classCallCheck(this, BouncyConversion);
      this.bounciness = bounciness;
      this.speed = speed;
      var b = this.normalize(bounciness / 1.7, 0, 20.0);
      b = this.projectNormal(b, 0.0, 0.8);
      var s = this.normalize(speed / 1.7, 0, 20.0);
      this.bouncyTension = this.projectNormal(s, 0.5, 200);
      this.bouncyFriction = this.quadraticOutInterpolation(b, this.b3Nobounce(this.bouncyTension), 0.01);
    }

    BouncyConversion.prototype.normalize = function normalize(value, startValue, endValue) {
      return (value - startValue) / (endValue - startValue);
    };

    BouncyConversion.prototype.projectNormal = function projectNormal(n, start, end) {
      return start + n * (end - start);
    };

    BouncyConversion.prototype.linearInterpolation = function linearInterpolation(t, start, end) {
      return t * end + (1.0 - t) * start;
    };

    BouncyConversion.prototype.quadraticOutInterpolation = function quadraticOutInterpolation(t, start, end) {
      return this.linearInterpolation(2 * t - t * t, start, end);
    };

    BouncyConversion.prototype.b3Friction1 = function b3Friction1(x) {
      return 0.0007 * Math.pow(x, 3) - 0.031 * Math.pow(x, 2) + 0.64 * x + 1.28;
    };

    BouncyConversion.prototype.b3Friction2 = function b3Friction2(x) {
      return 0.000044 * Math.pow(x, 3) - 0.006 * Math.pow(x, 2) + 0.36 * x + 2;
    };

    BouncyConversion.prototype.b3Friction3 = function b3Friction3(x) {
      return 0.00000045 * Math.pow(x, 3) - 0.000332 * Math.pow(x, 2) + 0.1078 * x + 5.84;
    };

    BouncyConversion.prototype.b3Nobounce = function b3Nobounce(tension) {
      var friction = 0;

      if (tension <= 18) {
        friction = this.b3Friction1(tension);
      } else if (tension > 18 && tension <= 44) {
        friction = this.b3Friction2(tension);
      } else {
        friction = this.b3Friction3(tension);
      }

      return friction;
    };

    return BouncyConversion;
  }();
  /**
   * Maintains a set of tension and friction constants
   * for a Spring. You can use fromOrigamiTensionAndFriction to convert
   * values from the [Origami](http://facebook.github.io/origami/)
   * design tool directly to Rebound spring constants.
   * @public
   */


  var SpringConfig = function () {
    /**
     * Convert an origami Spring tension and friction to Rebound spring
     * constants. If you are prototyping a design with Origami, this
     * makes it easy to make your springs behave exactly the same in
     * Rebound.
     * @public
     */
    SpringConfig.fromOrigamiTensionAndFriction = function fromOrigamiTensionAndFriction(tension, friction) {
      return new SpringConfig(tensionFromOrigamiValue(tension), frictionFromOrigamiValue(friction));
    };
    /**
     * Convert an origami PopAnimation Spring bounciness and speed to Rebound
     * spring constants. If you are using PopAnimation patches in Origami, this
     * utility will provide springs that match your prototype.
     * @public
     */


    SpringConfig.fromBouncinessAndSpeed = function fromBouncinessAndSpeed(bounciness, speed) {
      var bouncyConversion = new BouncyConversion(bounciness, speed);
      return SpringConfig.fromOrigamiTensionAndFriction(bouncyConversion.bouncyTension, bouncyConversion.bouncyFriction);
    };
    /**
     * Create a SpringConfig with no tension or a coasting spring with some
     * amount of Friction so that it does not coast infininitely.
     * @public
     */


    SpringConfig.coastingConfigWithOrigamiFriction = function coastingConfigWithOrigamiFriction(friction) {
      return new SpringConfig(0, frictionFromOrigamiValue(friction));
    };

    function SpringConfig(tension, friction) {
      classCallCheck(this, SpringConfig);
      this.tension = tension;
      this.friction = friction;
    }

    return SpringConfig;
  }();

  SpringConfig.DEFAULT_ORIGAMI_SPRING_CONFIG = SpringConfig.fromOrigamiTensionAndFriction(40, 7);
  /**
   * Consists of a position and velocity. A Spring uses
   * this internally to keep track of its current and prior position and
   * velocity values.
   */

  var PhysicsState = function PhysicsState() {
    classCallCheck(this, PhysicsState);
    this.position = 0;
    this.velocity = 0;
  };
  /**
   * Provides a model of a classical spring acting to
   * resolve a body to equilibrium. Springs have configurable
   * tension which is a force multipler on the displacement of the
   * spring from its rest point or `endValue` as defined by [Hooke's
   * law](http://en.wikipedia.org/wiki/Hooke's_law). Springs also have
   * configurable friction, which ensures that they do not oscillate
   * infinitely. When a Spring is displaced by updating it's resting
   * or `currentValue`, the SpringSystems that contain that Spring
   * will automatically start looping to solve for equilibrium. As each
   * timestep passes, `SpringListener` objects attached to the Spring
   * will be notified of the updates providing a way to drive an
   * animation off of the spring's resolution curve.
   * @public
   */


  var Spring = function () {
    function Spring(springSystem) {
      classCallCheck(this, Spring);
      this.listeners = [];
      this._startValue = 0;
      this._currentState = new PhysicsState();
      this._displacementFromRestThreshold = 0.001;
      this._endValue = 0;
      this._overshootClampingEnabled = false;
      this._previousState = new PhysicsState();
      this._restSpeedThreshold = 0.001;
      this._tempState = new PhysicsState();
      this._timeAccumulator = 0;
      this._wasAtRest = true;
      this._id = 's' + Spring._ID++;
      this._springSystem = springSystem;
    }
    /**
     * Remove a Spring from simulation and clear its listeners.
     * @public
     */


    Spring.prototype.destroy = function destroy() {
      this.listeners = [];

      this._springSystem.deregisterSpring(this);
    };
    /**
     * Get the id of the spring, which can be used to retrieve it from
     * the SpringSystems it participates in later.
     * @public
     */


    Spring.prototype.getId = function getId() {
      return this._id;
    };
    /**
     * Set the configuration values for this Spring. A SpringConfig
     * contains the tension and friction values used to solve for the
     * equilibrium of the Spring in the physics loop.
     * @public
     */


    Spring.prototype.setSpringConfig = function setSpringConfig(springConfig) {
      this._springConfig = springConfig;
      return this;
    };
    /**
     * Retrieve the SpringConfig used by this Spring.
     * @public
     */


    Spring.prototype.getSpringConfig = function getSpringConfig() {
      return this._springConfig;
    };
    /**
     * Set the current position of this Spring. Listeners will be updated
     * with this value immediately. If the rest or `endValue` is not
     * updated to match this value, then the spring will be dispalced and
     * the SpringSystem will start to loop to restore the spring to the
     * `endValue`.
     *
     * A common pattern is to move a Spring around without animation by
     * calling.
     *
     * ```
     * spring.setCurrentValue(n).setAtRest();
     * ```
     *
     * This moves the Spring to a new position `n`, sets the endValue
     * to `n`, and removes any velocity from the `Spring`. By doing
     * this you can allow the `SpringListener` to manage the position
     * of UI elements attached to the spring even when moving without
     * animation. For example, when dragging an element you can
     * update the position of an attached view through a spring
     * by calling `spring.setCurrentValue(x)`. When
     * the gesture ends you can update the Springs
     * velocity and endValue
     * `spring.setVelocity(gestureEndVelocity).setEndValue(flingTarget)`
     * to cause it to naturally animate the UI element to the resting
     * position taking into account existing velocity. The codepaths for
     * synchronous movement and spring driven animation can
     * be unified using this technique.
     * @public
     */


    Spring.prototype.setCurrentValue = function setCurrentValue(currentValue, skipSetAtRest) {
      this._startValue = currentValue;
      this._currentState.position = currentValue;

      if (!skipSetAtRest) {
        this.setAtRest();
      }

      this.notifyPositionUpdated(false, false);
      return this;
    };
    /**
     * Get the position that the most recent animation started at. This
     * can be useful for determining the number off oscillations that
     * have occurred.
     * @public
     */


    Spring.prototype.getStartValue = function getStartValue() {
      return this._startValue;
    };
    /**
     * Retrieve the current value of the Spring.
     * @public
     */


    Spring.prototype.getCurrentValue = function getCurrentValue() {
      return this._currentState.position;
    };
    /**
     * Get the absolute distance of the Spring from its resting endValue
     * position.
     * @public
     */


    Spring.prototype.getCurrentDisplacementDistance = function getCurrentDisplacementDistance() {
      return this.getDisplacementDistanceForState(this._currentState);
    };
    /**
     * Get the absolute distance of the Spring from a given state value
     */


    Spring.prototype.getDisplacementDistanceForState = function getDisplacementDistanceForState(state) {
      return Math.abs(this._endValue - state.position);
    };
    /**
     * Set the endValue or resting position of the spring. If this
     * value is different than the current value, the SpringSystem will
     * be notified and will begin running its solver loop to resolve
     * the Spring to equilibrium. Any listeners that are registered
     * for onSpringEndStateChange will also be notified of this update
     * immediately.
     * @public
     */


    Spring.prototype.setEndValue = function setEndValue(endValue) {
      if (this._endValue === endValue && this.isAtRest()) {
        return this;
      }

      this._startValue = this.getCurrentValue();
      this._endValue = endValue;

      this._springSystem.activateSpring(this.getId());

      for (var i = 0, len = this.listeners.length; i < len; i++) {
        var listener = this.listeners[i];
        var onChange = listener.onSpringEndStateChange;
        onChange && onChange(this);
      }

      return this;
    };
    /**
     * Retrieve the endValue or resting position of this spring.
     * @public
     */


    Spring.prototype.getEndValue = function getEndValue() {
      return this._endValue;
    };
    /**
     * Set the current velocity of the Spring, in pixels per second. As
     * previously mentioned, this can be useful when you are performing
     * a direct manipulation gesture. When a UI element is released you
     * may call setVelocity on its animation Spring so that the Spring
     * continues with the same velocity as the gesture ended with. The
     * friction, tension, and displacement of the Spring will then
     * govern its motion to return to rest on a natural feeling curve.
     * @public
     */


    Spring.prototype.setVelocity = function setVelocity(velocity) {
      if (velocity === this._currentState.velocity) {
        return this;
      }

      this._currentState.velocity = velocity;

      this._springSystem.activateSpring(this.getId());

      return this;
    };
    /**
     * Get the current velocity of the Spring, in pixels per second.
     * @public
     */


    Spring.prototype.getVelocity = function getVelocity() {
      return this._currentState.velocity;
    };
    /**
     * Set a threshold value for the movement speed of the Spring below
     * which it will be considered to be not moving or resting.
     * @public
     */


    Spring.prototype.setRestSpeedThreshold = function setRestSpeedThreshold(restSpeedThreshold) {
      this._restSpeedThreshold = restSpeedThreshold;
      return this;
    };
    /**
     * Retrieve the rest speed threshold for this Spring.
     * @public
     */


    Spring.prototype.getRestSpeedThreshold = function getRestSpeedThreshold() {
      return this._restSpeedThreshold;
    };
    /**
     * Set a threshold value for displacement below which the Spring
     * will be considered to be not displaced i.e. at its resting
     * `endValue`.
     * @public
     */


    Spring.prototype.setRestDisplacementThreshold = function setRestDisplacementThreshold(displacementFromRestThreshold) {
      this._displacementFromRestThreshold = displacementFromRestThreshold;
    };
    /**
     * Retrieve the rest displacement threshold for this spring.
     * @public
     */


    Spring.prototype.getRestDisplacementThreshold = function getRestDisplacementThreshold() {
      return this._displacementFromRestThreshold;
    };
    /**
     * Enable overshoot clamping. This means that the Spring will stop
     * immediately when it reaches its resting position regardless of
     * any existing momentum it may have. This can be useful for certain
     * types of animations that should not oscillate such as a scale
     * down to 0 or alpha fade.
     * @public
     */


    Spring.prototype.setOvershootClampingEnabled = function setOvershootClampingEnabled(enabled) {
      this._overshootClampingEnabled = enabled;
      return this;
    };
    /**
     * Check if overshoot clamping is enabled for this spring.
     * @public
     */


    Spring.prototype.isOvershootClampingEnabled = function isOvershootClampingEnabled() {
      return this._overshootClampingEnabled;
    };
    /**
     * Check if the Spring has gone past its end point by comparing
     * the direction it was moving in when it started to the current
     * position and end value.
     * @public
     */


    Spring.prototype.isOvershooting = function isOvershooting() {
      var start = this._startValue;
      var end = this._endValue;
      return this._springConfig.tension > 0 && (start < end && this.getCurrentValue() > end || start > end && this.getCurrentValue() < end);
    };
    /**
     * The main solver method for the Spring. It takes
     * the current time and delta since the last time step and performs
     * an RK4 integration to get the new position and velocity state
     * for the Spring based on the tension, friction, velocity, and
     * displacement of the Spring.
     * @public
     */


    Spring.prototype.advance = function advance(time, realDeltaTime) {
      var isAtRest = this.isAtRest();

      if (isAtRest && this._wasAtRest) {
        return;
      }

      var adjustedDeltaTime = realDeltaTime;

      if (realDeltaTime > Spring.MAX_DELTA_TIME_SEC) {
        adjustedDeltaTime = Spring.MAX_DELTA_TIME_SEC;
      }

      this._timeAccumulator += adjustedDeltaTime;
      var tension = this._springConfig.tension;
      var friction = this._springConfig.friction;
      var position = this._currentState.position;
      var velocity = this._currentState.velocity;
      var tempPosition = this._tempState.position;
      var tempVelocity = this._tempState.velocity;
      var aVelocity = void 0;
      var aAcceleration = void 0;
      var bVelocity = void 0;
      var bAcceleration = void 0;
      var cVelocity = void 0;
      var cAcceleration = void 0;
      var dVelocity = void 0;
      var dAcceleration = void 0;
      var dxdt = void 0;
      var dvdt = void 0;

      while (this._timeAccumulator >= Spring.SOLVER_TIMESTEP_SEC) {
        this._timeAccumulator -= Spring.SOLVER_TIMESTEP_SEC;

        if (this._timeAccumulator < Spring.SOLVER_TIMESTEP_SEC) {
          this._previousState.position = position;
          this._previousState.velocity = velocity;
        }

        aVelocity = velocity;
        aAcceleration = tension * (this._endValue - tempPosition) - friction * velocity;
        tempPosition = position + aVelocity * Spring.SOLVER_TIMESTEP_SEC * 0.5;
        tempVelocity = velocity + aAcceleration * Spring.SOLVER_TIMESTEP_SEC * 0.5;
        bVelocity = tempVelocity;
        bAcceleration = tension * (this._endValue - tempPosition) - friction * tempVelocity;
        tempPosition = position + bVelocity * Spring.SOLVER_TIMESTEP_SEC * 0.5;
        tempVelocity = velocity + bAcceleration * Spring.SOLVER_TIMESTEP_SEC * 0.5;
        cVelocity = tempVelocity;
        cAcceleration = tension * (this._endValue - tempPosition) - friction * tempVelocity;
        tempPosition = position + cVelocity * Spring.SOLVER_TIMESTEP_SEC;
        tempVelocity = velocity + cAcceleration * Spring.SOLVER_TIMESTEP_SEC;
        dVelocity = tempVelocity;
        dAcceleration = tension * (this._endValue - tempPosition) - friction * tempVelocity;
        dxdt = 1.0 / 6.0 * (aVelocity + 2.0 * (bVelocity + cVelocity) + dVelocity);
        dvdt = 1.0 / 6.0 * (aAcceleration + 2.0 * (bAcceleration + cAcceleration) + dAcceleration);
        position += dxdt * Spring.SOLVER_TIMESTEP_SEC;
        velocity += dvdt * Spring.SOLVER_TIMESTEP_SEC;
      }

      this._tempState.position = tempPosition;
      this._tempState.velocity = tempVelocity;
      this._currentState.position = position;
      this._currentState.velocity = velocity;

      if (this._timeAccumulator > 0) {
        this._interpolate(this._timeAccumulator / Spring.SOLVER_TIMESTEP_SEC);
      }

      if (this.isAtRest() || this._overshootClampingEnabled && this.isOvershooting()) {
        if (this._springConfig.tension > 0) {
          this._startValue = this._endValue;
          this._currentState.position = this._endValue;
        } else {
          this._endValue = this._currentState.position;
          this._startValue = this._endValue;
        }

        this.setVelocity(0);
        isAtRest = true;
      }

      var notifyActivate = false;

      if (this._wasAtRest) {
        this._wasAtRest = false;
        notifyActivate = true;
      }

      var notifyAtRest = false;

      if (isAtRest) {
        this._wasAtRest = true;
        notifyAtRest = true;
      }

      this.notifyPositionUpdated(notifyActivate, notifyAtRest);
    };

    Spring.prototype.notifyPositionUpdated = function notifyPositionUpdated(notifyActivate, notifyAtRest) {
      for (var i = 0, len = this.listeners.length; i < len; i++) {
        var listener = this.listeners[i];

        if (notifyActivate && listener.onSpringActivate) {
          listener.onSpringActivate(this);
        }

        if (listener.onSpringUpdate) {
          listener.onSpringUpdate(this);
        }

        if (notifyAtRest && listener.onSpringAtRest) {
          listener.onSpringAtRest(this);
        }
      }
    };
    /**
     * Check if the SpringSystem should advance. Springs are advanced
     * a final frame after they reach equilibrium to ensure that the
     * currentValue is exactly the requested endValue regardless of the
     * displacement threshold.
     * @public
     */


    Spring.prototype.systemShouldAdvance = function systemShouldAdvance() {
      return !this.isAtRest() || !this.wasAtRest();
    };

    Spring.prototype.wasAtRest = function wasAtRest() {
      return this._wasAtRest;
    };
    /**
     * Check if the Spring is atRest meaning that it's currentValue and
     * endValue are the same and that it has no velocity. The previously
     * described thresholds for speed and displacement define the bounds
     * of this equivalence check. If the Spring has 0 tension, then it will
     * be considered at rest whenever its absolute velocity drops below the
     * restSpeedThreshold.
     * @public
     */


    Spring.prototype.isAtRest = function isAtRest() {
      return Math.abs(this._currentState.velocity) < this._restSpeedThreshold && (this.getDisplacementDistanceForState(this._currentState) <= this._displacementFromRestThreshold || this._springConfig.tension === 0);
    };
    /**
     * Force the spring to be at rest at its current position. As
     * described in the documentation for setCurrentValue, this method
     * makes it easy to do synchronous non-animated updates to ui
     * elements that are attached to springs via SpringListeners.
     * @public
     */


    Spring.prototype.setAtRest = function setAtRest() {
      this._endValue = this._currentState.position;
      this._tempState.position = this._currentState.position;
      this._currentState.velocity = 0;
      return this;
    };

    Spring.prototype._interpolate = function _interpolate(alpha) {
      this._currentState.position = this._currentState.position * alpha + this._previousState.position * (1 - alpha);
      this._currentState.velocity = this._currentState.velocity * alpha + this._previousState.velocity * (1 - alpha);
    };

    Spring.prototype.getListeners = function getListeners() {
      return this.listeners;
    };

    Spring.prototype.addListener = function addListener(newListener) {
      this.listeners.push(newListener);
      return this;
    };

    Spring.prototype.removeListener = function removeListener(listenerToRemove) {
      removeFirst(this.listeners, listenerToRemove);
      return this;
    };

    Spring.prototype.removeAllListeners = function removeAllListeners() {
      this.listeners = [];
      return this;
    };

    Spring.prototype.currentValueIsApproximately = function currentValueIsApproximately(value) {
      return Math.abs(this.getCurrentValue() - value) <= this.getRestDisplacementThreshold();
    };

    return Spring;
  }();

  Spring._ID = 0;
  Spring.MAX_DELTA_TIME_SEC = 0.064;
  Spring.SOLVER_TIMESTEP_SEC = 0.001;
  /**
   * A set of Springs that all run on the same physics
   * timing loop. To get started with a Rebound animation, first
   * create a new SpringSystem and then add springs to it.
   * @public
   */

  var SpringSystem = function () {
    function SpringSystem(looper) {
      classCallCheck(this, SpringSystem);
      this.listeners = [];
      this._activeSprings = [];
      this._idleSpringIndices = [];
      this._isIdle = true;
      this._lastTimeMillis = -1;
      this._springRegistry = {};
      this.looper = looper || new AnimationLooper();
      this.looper.springSystem = this;
    }
    /**
     * A SpringSystem is iterated by a looper. The looper is responsible
     * for executing each frame as the SpringSystem is resolved to idle.
     * There are three types of Loopers described below AnimationLooper,
     * SimulationLooper, and SteppingSimulationLooper. AnimationLooper is
     * the default as it is the most useful for common UI animations.
     * @public
     */


    SpringSystem.prototype.setLooper = function setLooper(looper) {
      this.looper = looper;
      looper.springSystem = this;
    };
    /**
     * Add a new spring to this SpringSystem. This Spring will now be solved for
     * during the physics iteration loop. By default the spring will use the
     * default Origami spring config with 40 tension and 7 friction, but you can
     * also provide your own values here.
     * @public
     */


    SpringSystem.prototype.createSpring = function createSpring(tension, friction) {
      var springConfig = void 0;

      if (tension === undefined || friction === undefined) {
        springConfig = SpringConfig.DEFAULT_ORIGAMI_SPRING_CONFIG;
      } else {
        springConfig = SpringConfig.fromOrigamiTensionAndFriction(tension, friction);
      }

      return this.createSpringWithConfig(springConfig);
    };
    /**
     * Add a spring with a specified bounciness and speed. To replicate Origami
     * compositions based on PopAnimation patches, use this factory method to
     * create matching springs.
     * @public
     */


    SpringSystem.prototype.createSpringWithBouncinessAndSpeed = function createSpringWithBouncinessAndSpeed(bounciness, speed) {
      var springConfig = void 0;

      if (bounciness === undefined || speed === undefined) {
        springConfig = SpringConfig.DEFAULT_ORIGAMI_SPRING_CONFIG;
      } else {
        springConfig = SpringConfig.fromBouncinessAndSpeed(bounciness, speed);
      }

      return this.createSpringWithConfig(springConfig);
    };
    /**
     * Add a spring with the provided SpringConfig.
     * @public
     */


    SpringSystem.prototype.createSpringWithConfig = function createSpringWithConfig(springConfig) {
      var spring = new Spring(this);
      this.registerSpring(spring);
      spring.setSpringConfig(springConfig);
      return spring;
    };
    /**
     * Check if a SpringSystem is idle or active. If all of the Springs in the
     * SpringSystem are at rest, i.e. the physics forces have reached equilibrium,
     * then this method will return true.
     * @public
     */


    SpringSystem.prototype.getIsIdle = function getIsIdle() {
      return this._isIdle;
    };
    /**
     * Retrieve a specific Spring from the SpringSystem by id. This
     * can be useful for inspecting the state of a spring before
     * or after an integration loop in the SpringSystem executes.
     * @public
     */


    SpringSystem.prototype.getSpringById = function getSpringById(id) {
      return this._springRegistry[id];
    };
    /**
     * Get a listing of all the springs registered with this
     * SpringSystem.
     * @public
     */


    SpringSystem.prototype.getAllSprings = function getAllSprings() {
      var vals = [];

      for (var _id in this._springRegistry) {
        if (this._springRegistry.hasOwnProperty(_id)) {
          vals.push(this._springRegistry[_id]);
        }
      }

      return vals;
    };
    /**
     * Manually add a spring to this system. This is called automatically
     * if a Spring is created with SpringSystem#createSpring.
     *
     * This method sets the spring up in the registry so that it can be solved
     * in the solver loop.
     * @public
     */


    SpringSystem.prototype.registerSpring = function registerSpring(spring) {
      this._springRegistry[spring.getId()] = spring;
    };
    /**
     * Deregister a spring with this SpringSystem. The SpringSystem will
     * no longer consider this Spring during its integration loop once
     * this is called. This is normally done automatically for you when
     * you call Spring#destroy.
     * @public
     */


    SpringSystem.prototype.deregisterSpring = function deregisterSpring(spring) {
      removeFirst(this._activeSprings, spring);
      delete this._springRegistry[spring.getId()];
    };

    SpringSystem.prototype.advance = function advance(time, deltaTime) {
      while (this._idleSpringIndices.length > 0) {
        this._idleSpringIndices.pop();
      }

      for (var i = 0, len = this._activeSprings.length; i < len; i++) {
        var spring = this._activeSprings[i];

        if (spring.systemShouldAdvance()) {
          spring.advance(time / 1000.0, deltaTime / 1000.0);
        } else {
          this._idleSpringIndices.push(this._activeSprings.indexOf(spring));
        }
      }

      while (this._idleSpringIndices.length > 0) {
        var idx = this._idleSpringIndices.pop();

        idx >= 0 && this._activeSprings.splice(idx, 1);
      }
    };
    /**
     * This is the main solver loop called to move the simulation
     * forward through time. Before each pass in the solver loop
     * onBeforeIntegrate is called on an any listeners that have
     * registered themeselves with the SpringSystem. This gives you
     * an opportunity to apply any constraints or adjustments to
     * the springs that should be enforced before each iteration
     * loop. Next the advance method is called to move each Spring in
     * the systemShouldAdvance forward to the current time. After the
     * integration step runs in advance, onAfterIntegrate is called
     * on any listeners that have registered themselves with the
     * SpringSystem. This gives you an opportunity to run any post
     * integration constraints or adjustments on the Springs in the
     * SpringSystem.
     * @public
     */


    SpringSystem.prototype.loop = function loop(currentTimeMillis) {
      var listener = void 0;

      if (this._lastTimeMillis === -1) {
        this._lastTimeMillis = currentTimeMillis - 1;
      }

      var ellapsedMillis = currentTimeMillis - this._lastTimeMillis;
      this._lastTimeMillis = currentTimeMillis;
      var i = 0;
      var len = this.listeners.length;

      for (i = 0; i < len; i++) {
        listener = this.listeners[i];
        listener.onBeforeIntegrate && listener.onBeforeIntegrate(this);
      }

      this.advance(currentTimeMillis, ellapsedMillis);

      if (this._activeSprings.length === 0) {
        this._isIdle = true;
        this._lastTimeMillis = -1;
      }

      for (i = 0; i < len; i++) {
        listener = this.listeners[i];
        listener.onAfterIntegrate && listener.onAfterIntegrate(this);
      }

      if (!this._isIdle) {
        this.looper.run();
      }
    };
    /**
     * Used to notify the SpringSystem that a Spring has become displaced.
     * The system responds by starting its solver loop up if it is currently idle.
     */


    SpringSystem.prototype.activateSpring = function activateSpring(springId) {
      var spring = this._springRegistry[springId];

      if (this._activeSprings.indexOf(spring) === -1) {
        this._activeSprings.push(spring);
      }

      if (this.getIsIdle()) {
        this._isIdle = false;
        this.looper.run();
      }
    };
    /**
     * Add a listener to the SpringSystem to receive before/after integration
     * notifications allowing Springs to be constrained or adjusted.
     * @public
     */


    SpringSystem.prototype.addListener = function addListener(listener) {
      this.listeners.push(listener);
    };
    /**
     * Remove a previously added listener on the SpringSystem.
     * @public
     */


    SpringSystem.prototype.removeListener = function removeListener(listener) {
      removeFirst(this.listeners, listener);
    };
    /**
     * Remove all previously added listeners on the SpringSystem.
     * @public
     */


    SpringSystem.prototype.removeAllListeners = function removeAllListeners() {
      this.listeners = [];
    };

    return SpringSystem;
  }();

  var index = _extends({}, Loopers, {
    OrigamiValueConverter: OrigamiValueConverter,
    MathUtil: MathUtil,
    Spring: Spring,
    SpringConfig: SpringConfig,
    SpringSystem: SpringSystem,
    util: _extends({}, util, MathUtil)
  });

  return index;
});
},{"process":"../node_modules/process/browser.js"}],"../src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rebound = require("rebound");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var getViewportCoords = function getViewportCoords() {
  return {
    height: document.documentElement.clientHeight,
    width: document.documentElement.clientWidth
  };
};

var getScrollHeight = function getScrollHeight() {
  // insane code courtesy of https://javascript.info/size-and-scroll-window
  return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
};

var rectInViewport = function rectInViewport(_ref, _ref2) {
  var top = _ref.top,
      bottom = _ref.bottom,
      left = _ref.left,
      right = _ref.right;
  var windowWidth = _ref2.width,
      windowHeight = _ref2.height;
  return top < windowHeight && bottom > 0 && left < windowWidth && right > 0;
};

var rectCloseToViewport = function rectCloseToViewport(_ref3, _ref4) {
  var top = _ref3.top,
      bottom = _ref3.bottom;
  var windowHeight = _ref4.height;
  return top < windowHeight * 3 && bottom > -windowHeight * 2;
};

var initScrollBounce = function initScrollBounce() {
  var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref5$effectMultiplie = _ref5.effectMultiplier,
      effectMultiplier = _ref5$effectMultiplie === void 0 ? 2 : _ref5$effectMultiplie;

  var springSystem = new _rebound.SpringSystem();
  var bounceChildren = Array.from(document.querySelectorAll("[data-bounce-id]"));
  var offset = window.pageYOffset;
  var springs = bounceChildren.map(function (child) {
    var spring = springSystem.createSpring();
    spring.addListener({
      onSpringUpdate: function onSpringUpdate(_spring) {
        var val = _spring.getCurrentValue();

        child.style.transform = "translateY(".concat(val, "px)");
      }
    });
    return [child, spring];
  }).reduce(function (acc, curr) {
    acc[curr[0].dataset.bounceId] = curr[1];
    return acc;
  }, {});

  var resetSprings = function resetSprings() {
    Object.keys(springs).forEach(function (s) {
      springs[s].setEndValue(0);
    });
  };

  var cache = {};

  var getCenter = function getCenter(bounding) {
    return bounding.top + bounding.height / 2;
  };

  var onScroll = function onScroll() {
    if (!cache.scrollHeight) cache.scrollHeight = getScrollHeight();
    var fastScroll = Math.abs(diff) > cache.viewportCoords.height;
    if (fastScroll) return;
    var newOffset = window.pageYOffset;
    if (newOffset <= 0) return;

    if (newOffset >= cache.scrollHeight - cache.viewportCoords.height) {
      return;
    }

    var scrollDiffLimit = 40;
    var diff = Math.max(-scrollDiffLimit, Math.min(offset - newOffset, scrollDiffLimit));
    var closestChild = document.querySelector(["[data-bounce-id=\"".concat(cache.closestBounceId, "\"]")]);
    var closestChildIndex = bounceChildren.indexOf(closestChild);
    var animatedChildrenDict = {};
    var animatedAboveIndex = closestChildIndex - 1;
    var animatedBelowIndex = closestChildIndex + 1;
    var scrollDown = diff > 0;

    if (scrollDown) {
      while (true) {
        var el = bounceChildren[animatedAboveIndex];
        if (!el) break;
        var bounding = el.getBoundingClientRect();
        var isAnimated = rectCloseToViewport(bounding, cache.viewportCoords);
        if (!isAnimated) break;
        animatedChildrenDict[el.dataset.bounceId] = bounding;
        animatedAboveIndex -= 1;
      }
    } else {
      while (true) {
        var _el = bounceChildren[animatedBelowIndex];
        if (!_el) break;

        var _bounding = _el.getBoundingClientRect();

        var _isAnimated = rectCloseToViewport(_bounding, cache.viewportCoords);

        if (!_isAnimated) break;
        animatedChildrenDict[_el.dataset.bounceId] = _bounding;
        animatedBelowIndex += 1;
      }
    }

    var animatedChildren = bounceChildren.filter(function (c) {
      return animatedChildrenDict[c.dataset.bounceId];
    }).map(function (c) {
      return [c, animatedChildrenDict[c.dataset.bounceId]];
    });
    bounceChildren.filter(function (c) {
      return !animatedChildrenDict[c.dataset.bounceId];
    }).forEach(function (c) {
      c.style.willChange = "";
      springs[c.dataset.bounceId].setEndValue(0);
    });
    animatedChildren.forEach(function (_ref6) {
      var _ref7 = _slicedToArray(_ref6, 2),
          child = _ref7[0],
          bounding = _ref7[1];

      child.style.willChange = "transform";
      var spring = springs[child.dataset.bounceId];
      var resistance = Math.abs(cache.clientY - getCenter(bounding)) / cache.viewportCoords.height;
      resistance = resistance * effectMultiplier;
      spring.setEndValue(-diff * resistance);
    });
    offset = newOffset;
  };

  var scrollListener = false;

  var onTouchStart = function onTouchStart(event) {
    if (!scrollListener) scrollListener = window.addEventListener("scroll", onScroll);
    cache.clientY = event.targetTouches[0].clientY;
    cache.viewportCoords = getViewportCoords();
    var closestElTuple = bounceChildren.reduce(function (acc, curr, i, source) {
      if (acc.length && acc[0] !== source[i - 1]) return acc;
      var bounding = curr.getBoundingClientRect();
      if (!rectInViewport(bounding, cache.viewportCoords)) return acc;

      if (acc.length === 0 || Math.abs(cache.clientY - getCenter(bounding)) < Math.abs(cache.clientY - getCenter(acc[1]))) {
        return [curr, bounding];
      }

      return acc;
    }, []);
    cache.closestBounceId = closestElTuple[0].dataset.bounceId;
  };

  var onTouchEnd = function onTouchEnd() {
    window.removeEventListener("scroll", onScroll);
    resetSprings();
    cache = {};
  };

  var onTouchMove = function onTouchMove(event) {
    cache.clientY = event.targetTouches[0].clientY;
  };

  window.addEventListener("touchstart", onTouchStart, false);
  window.addEventListener("touchmove", onTouchMove, false);
  window.addEventListener("touchend", onTouchEnd, false);
  return function () {
    window.removeEventListener("touchstart", onTouchStart, false);
    window.removeEventListener("touchmove", onTouchMove, false);
    window.removeEventListener("touchend", onTouchEnd, false);
  };
};

var _default = initScrollBounce;
exports.default = _default;
},{"rebound":"../node_modules/rebound/dist/rebound.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _index = _interopRequireDefault(require("../src/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var ul = document.querySelector("ul");

_toConsumableArray(new Array(200).keys()).forEach(function (i) {
  var li = document.createElement("li");
  li.dataset.bounceId = "bounce-id-".concat(i);
  ul.appendChild(li);
});

(0, _index.default)({
  effectMultiplier: 3
});
},{"../src/index":"../src/index.js"}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59267" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/test.e31bb0bc.js.map