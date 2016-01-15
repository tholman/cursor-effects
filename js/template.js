/*!
 * Cursor Name.js
 * -- 90's cursors collection
 */

(function cursorName() {
  
  var width = window.innerWidth;
  var height = window.innerHeight;
  var cursor = {x: width/2, y: width/2};
  
  function init() {
    bindEvents();
  }
  
  // Bind events that are needed
  function bindEvents() {
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);
  }
  
  function onWindowResize(e) {
    width = window.innerWidth;
    height = window.innerHeight;
  }
  
  function onMouseMove(e) {    
    cursor.x = e.clientX;
    cursor.y = e.clientY;
  }
  
  /**
   * Utils
   */
  
  // Applies css `properties` to an element.
  function applyProperties( target, properties ) {
    for( var key in properties ) {
      target.style[ key ] = properties[ key ];
    }
  }
  
  init();
})();