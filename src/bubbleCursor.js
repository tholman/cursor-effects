function bubbleCursor(wrapperEl) {
  var width = window.innerWidth;
  var height = window.innerHeight;
  var cursor = { x: width / 2, y: width / 2 };
  var particles = [];
  var element, canvas, context;

  var canvImages = [];

  function init(wrapperEl) {
    this.element = wrapperEl || document.body;
    canvas = document.createElement("canvas");
    context = canvas.getContext("2d");

    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.style.pointerEvents = "none";

    if (wrapperEl) {
      canvas.style.position = "absolute";
      wrapperEl.appendChild(canvas);
      canvas.width = wrapperEl.clientWidth;
      canvas.height = wrapperEl.clientHeight;
    } else {
      canvas.style.position = "fixed";
      document.body.appendChild(canvas);
      canvas.width = width;
      canvas.height = height;
    }

    bindEvents();
    loop();
  }

  // Bind events that are needed
  function bindEvents() {
    this.element.addEventListener("mousemove", onMouseMove);
    this.element.addEventListener("touchmove", onTouchMove);
    this.element.addEventListener("touchstart", onTouchMove);
    window.addEventListener("resize", onWindowResize);
  }

  function onWindowResize(e) {
    width = window.innerWidth;
    height = window.innerHeight;

    if (wrapperEl) {
      canvas.width = wrapperEl.clientWidth;
      canvas.height = wrapperEl.clientHeight;
    } else {
      canvas.width = width;
      canvas.height = height;
    }
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      for (var i = 0; i < e.touches.length; i++) {
        addParticle(
          e.touches[i].clientX,
          e.touches[i].clientY,
          canvImages[Math.floor(Math.random() * canvImages.length)]
        );
      }
    }
  }

  function onMouseMove(e) {
    if (wrapperEl) {
      const boundingRect = wrapperEl.getBoundingClientRect();
      cursor.x = e.clientX - boundingRect.left;
      cursor.y = e.clientY - boundingRect.top;
    } else {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
    }

    addParticle(cursor.x, cursor.y);
  }

  function addParticle(x, y, img) {
    particles.push(new Particle(x, y, img));
  }

  function updateParticles() {
    context.clearRect(0, 0, width, height);

    // Update
    for (var i = 0; i < particles.length; i++) {
      particles[i].update(context);
    }

    // Remove dead particles
    for (var i = particles.length - 1; i >= 0; i--) {
      if (particles[i].lifeSpan < 0) {
        particles.splice(i, 1);
      }
    }
  }

  function loop() {
    updateParticles();
    requestAnimationFrame(loop);
  }

  function Particle(x, y, canvasItem) {
    const lifeSpan = Math.floor(Math.random() * 60 + 60);
    this.initialLifeSpan = lifeSpan; //
    this.lifeSpan = lifeSpan; //ms
    this.velocity = {
      x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 10),
      y: -0.4 + Math.random() * -1,
    };
    this.position = { x: x, y: y };
    this.canv = canvasItem;

    this.baseDimension = 4;

    this.update = function (context) {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      this.velocity.x += ((Math.random() < 0.5 ? -1 : 1) * 2) / 75;
      this.velocity.y -= Math.random() / 600;
      this.lifeSpan--;

      const scale =
        0.2 + (this.initialLifeSpan - this.lifeSpan) / this.initialLifeSpan;

      context.fillStyle = "#e6f1f7";
      context.strokeStyle = "#3a92c5";
      context.beginPath();
      context.arc(
        this.position.x - (this.baseDimension / 2) * scale,
        this.position.y - this.baseDimension / 2,
        this.baseDimension * scale,
        0,
        2 * Math.PI
      );

      context.stroke();
      context.fill();

      context.closePath();
    };
  }

  init(wrapperEl);
}
