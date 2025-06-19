// Safe polyfills that only run in truly server-side environments
// and avoid property assignment conflicts

// Only polyfill if we're in Node.js server environment (not build time)
if (typeof process !== 'undefined' && 
    process.versions && 
    process.versions.node &&
    typeof window === 'undefined' &&
    !process.env.NEXT_RUNTIME) {
  
  // Only define self if it doesn't exist
  if (typeof self === 'undefined') {
    global.self = global;
  }
}

// Export empty object to make this a module
module.exports = {};