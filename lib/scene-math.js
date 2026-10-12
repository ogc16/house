/*
 * Pure, side-effect-free helpers shared by the 3D viewer.
 *
 * The module works both as a classic browser script (attaching `SceneMath`
 * to the global object) and as a CommonJS module (for the unit tests), so the
 * page keeps working when opened directly from disk with no build step.
 */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else if (root) {
    root.SceneMath = api;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MIN_PHI = 0.1;
  var MAX_PHI = 1.45;
  var MIN_RADIUS = 6;
  var MAX_RADIUS = 55;
  var DEFAULT_LEAN = 0.08;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function cameraPosition(state) {
    var sinPhi = Math.sin(state.phi);
    return {
      x: state.panX + state.radius * sinPhi * Math.sin(state.theta),
      y: state.panY + state.radius * Math.cos(state.phi),
      z: state.radius * sinPhi * Math.cos(state.theta)
    };
  }

  // Deterministic pseudo-random lean for decorative elements.
  // Replaces Math.random so the scene renders identically on every load.
  function lean(index) {
    var hashed = Math.sin(index * 12.9898) * 43758.5453;
    return (hashed - Math.floor(hashed) - 0.5) * DEFAULT_LEAN;
  }

  var VIEWS = {
    front: { t: Math.PI * 0.5, p: 0.95, r: 26, px: 0, py: 1.5 },
    side: { t: 0, p: 0.9, r: 26, px: 0, py: 1.5 },
    top: { t: 0.55, p: 0.12, r: 32, px: 0, py: 0 },
    iso: { t: 0.55, p: 0.78, r: 28, px: 0, py: 1.5 },
    pool: { t: 0.55, p: 0.65, r: 20, px: -2, py: 0.5 }
  };

  return {
    clamp: clamp,
    easeInOutQuad: easeInOutQuad,
    cameraPosition: cameraPosition,
    lean: lean,
    VIEWS: VIEWS,
    MIN_PHI: MIN_PHI,
    MAX_PHI: MAX_PHI,
    MIN_RADIUS: MIN_RADIUS,
    MAX_RADIUS: MAX_RADIUS
  };
});
