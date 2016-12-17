/*!
 * Bats Cursor.js
 * - 90's cursors collection
 * -- https://github.com/tholman/90s-cursor-effects
 * -- http://codepen.io/tholman/full/kkmZyq/
 */

(function batCursor() {
  
  var width = window.innerWidth;
  var height = window.innerHeight;
  var cursor = {x: width/2, y: width/2};
  var particles = [];
  
  function init() {
    bindEvents();
    attachInitialParticleStyles();
    loop();
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
  
  function onTouchMove(e) {
    if( e.touches.length > 0 ) {
      for( var i = 0; i < e.touches.length; i++ ) {
        addParticle(e.touches[i].clientX, e.touches[i].clientY);
      }
    }
  }
  
  function onMouseMove(e) {    
    cursor.x = e.clientX;
    cursor.y = e.clientY;
    
    addParticle( cursor.x, cursor.y);
  }
  
  function addParticle(x, y) {
    var particle = new Particle();
    particle.init(x, y);
    particles.push(particle);
  }
  
  function updateParticles() {
    
    // Update
    for( var i = 0; i < particles.length; i++ ) {
      particles[i].update();
    }
    
    // Remove dead particles
    for( var i = particles.length - 1; i >= 0; i-- ) {
      if( particles[i].lifeSpan < 0 ) {
        particles[i].die();
        particles.splice(i, 1);
      }
    }
    
  }
  
  function loop() {
    requestAnimationFrame(loop);
    updateParticles();
  }
  
  /**
   * Particles
   */
  
  function Particle() {

    this.lifeSpan = 200; //ms
    
    // Init, and set properties
    this.init = function(x, y) {

      this.velocity = {
        x:  (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 2),
        y: (-2.5 + (Math.random() * -1))
      };
      
      this.position = {x: x - 15, y: y - 15};

      this.element = document.createElement('span');
      this.element.className = "particle-bats"
      this.update();
      
      document.body.appendChild(this.element);
    };
    
    this.update = function() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      
      // Update velocities
      this.velocity.x += (Math.random() < 0.5 ? -1 : 1) * 2 / 75;
      this.velocity.y -= Math.random() / 600;
      this.lifeSpan--;
      
      this.element.style.transform = "translate3d(" + this.position.x + "px," + this.position.y + "px,0) scale(" + ( 0.2 + (250 - this.lifeSpan) / 250) + ")";
    }
    
    this.die = function() {
      this.element.parentNode.removeChild(this.element);
    }
  }
  
  /**
   * Utils
   */
  
  // Injects initial bat styles to the head of the page.
  function attachInitialParticleStyles() {
    
    var initialStyles = 
        [
         ".particle-bats {",
           "position: absolute;",
           "display: block;",
           "pointer-events: none;",
           "z-index: 10000000;",
           "width: 20px;",
           "height: 20px;",
           "will-change: transform;",
           "background-size: contain;",
           "background-image: url('data:image/png;base64,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');",
          "}"
        ].join('');
    
    var style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = initialStyles;
    document.getElementsByTagName('head')[0].appendChild(style)
  };
  
  init();
})();