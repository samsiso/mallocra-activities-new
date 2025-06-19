// Minimal build-time polyfills to prevent deployment errors
// Only essential polyfills to avoid property assignment conflicts

// Just ensure global exists and basic self definition
if (typeof global !== 'undefined' && typeof self === 'undefined') {
  global.self = global;
}

module.exports = {}; 