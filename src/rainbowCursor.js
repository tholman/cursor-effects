export function rainbowCursor(options) {
  let hasWrapperEl = options && options.element;
  let element = hasWrapperEl || document.body;

  let width = window.innerWidth;
  let height = window.innerHeight;
  let cursor = { x: width / 2, y: width / 2 };
  let particles = [];
  let canvas, context, animationFrame;

  const totalParticles = options?.length || 20;
  const colors = options?.colors || [
    "#FE0000",
    "#FD8C00",
    "#FFE500",
    "#119F0B",
    "#0644B3",
    "#C22EDC",
  ];
  const size = options?.size || 3;

  let cursorsInitted = false;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  // Re-initialise or destroy the cursor when the prefers-reduced-motion setting changes
  prefersReducedMotion.onchange = () => {
    if (prefersReducedMotion.matches) {
      destroy();
    } else {
      init();
    }
  };

  function init() {
    // Don't show the cursor trail if the user has prefers-reduced-motion enabled
    if (prefersReducedMotion.matches) {
      console.log(
        "This browser has prefers reduced motion turned on, so the cursor did not init"
      );
      return false;
    }

    canvas = document.createElement("canvas");
    context = canvas.getContext("2d");
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.style.pointerEvents = "none";

    if (hasWrapperEl) {
      canvas.style.position = "absolute";
      element.appendChild(canvas);
      canvas.width = element.clientWidth;
      canvas.height = element.clientHeight;
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
    element.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onWindowResize);
  }

  function onWindowResize(e) {
    width = window.innerWidth;
    height = window.innerHeight;

    if (hasWrapperEl) {
      canvas.width = element.clientWidth;
      canvas.height = element.clientHeight;
    } else {
      canvas.width = width;
      canvas.height = height;
    }
  }

  function onMouseMove(e) {
    if (hasWrapperEl) {
      const boundingRect = element.getBoundingClientRect();
      cursor.x = e.clientX - boundingRect.left;
      cursor.y = e.clientY - boundingRect.top;
    } else {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
    }

    if (cursorsInitted === false) {
      cursorsInitted = true;
      for (let i = 0; i < totalParticles; i++) {
        addParticle(cursor.x, cursor.y);
      }
    }
  }

  function addParticle(x, y, image) {
    particles.push(new Particle(x, y, image));
  }

  function updateParticles() {
    context.clearRect(0, 0, width, height);
    context.lineJoin = "round";

    let particleSets = [];

    let x = cursor.x;
    let y = cursor.y;

    particles.forEach(function (particle, index, particles) {
      let nextParticle = particles[index + 1] || particles[0];

      particle.position.x = x;
      particle.position.y = y;

      particleSets.push({ x: x, y: y });

      x += (nextParticle.position.x - particle.position.x) * 0.4;
      y += (nextParticle.position.y - particle.position.y) * 0.4;
    });

    colors.forEach((color, index) => {
      context.beginPath();
      context.strokeStyle = color;

      if (particleSets.length) {
        context.moveTo(
          particleSets[0].x,
          particleSets[0].y + index * (size - 1)
        );
      }

      particleSets.forEach((set, particleIndex) => {
        if (particleIndex !== 0) {
          context.lineTo(set.x, set.y + index * size);
        }
      });

      context.lineWidth = size;
      context.lineCap = "round";
      context.stroke();
    });
  }

  function loop() {
    updateParticles();
    animationFrame = requestAnimationFrame(loop);
  }

  function destroy() {
    canvas.remove();
    cancelAnimationFrame(animationFrame);
    element.removeEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onWindowResize);
  };

  function Particle(x, y) {
    this.position = { x: x, y: y };
  }

  init();

  return {
    destroy: destroy
  }
}
