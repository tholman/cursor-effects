export function characterCursor(options) {
  let hasWrapperEl = options && options.element;
  let element = hasWrapperEl || document.body;

  let possibleCharacters = options?.characters || ["h", "e", "l", "l", "o"];
  const colors = options?.colors || [
    "#6622CC",
    "#A755C2",
    "#B07C9E",
    "#B59194",
    "#D2A1B8",
  ];
  let cursorOffset = options?.cursorOffset || {x: 0, y: 0}; 
  let width = window.innerWidth;
  let height = window.innerHeight;
  let cursor = { x: width / 2, y: width / 2 };
  let particles = [];
  let canvas, context, animationFrame;

  let font = options?.font || "15px serif"

  let randomPositiveOrNegativeOne = function() {
    return (Math.random() < 0.5 ? -1 : 1);
  }

  // Generates the lifespan for individual characters
  let characterLifeSpanFunction = options?.characterLifeSpanFunction || 
  function() {
    return Math.floor(Math.random() * 60 + 80);
  }

  // Defines the original velocity for the character
  let initialCharacterVelocityFunction = options?.initialCharacterVelocityFunction || 
  function() {
    return {
      x: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 5,
      y: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 5,
  }
  };

  // Defines how the velocity should change (additively)
  let characterVelocityChangeFunctions = options?.characterVelocityChangeFunctions || {
      x_func: function(age, lifeSpan) {
        return (Math.random() < 0.5 ? -1 : 1)/30;
      },
      y_func: function(age, lifeSpan) {
        return (Math.random() < 0.5 ? -1 : 1)/ 15;
      },
    };

  let characterScalingFunction = options?.characterScalingFunction || 
  function(age, lifeSpan) {
    let lifeLeft = lifeSpan - age;
    return Math.max(lifeLeft / lifeSpan * 2, 0);
  }

  // Produces new angles for the character
  let characterNewRotationDegreesFunction = options?.characterNewRotationDegreesFunction || 
  function(age, lifeSpan) {
    let lifeLeft = lifeSpan - age;
    return lifeLeft / 5;
  };

  let canvImages = [];

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

    context.font = font;
    context.textBaseline = "middle";
    context.textAlign = "center";

    possibleCharacters.forEach((emoji) => {
      let measurements = context.measureText(emoji);
      let bgCanvas = document.createElement("canvas");
      let bgContext = bgCanvas.getContext("2d");

      bgCanvas.width = measurements.width;
      bgCanvas.height = measurements.actualBoundingBoxAscent * 2.5;

      bgContext.textAlign = "center";
      bgContext.font = font
      bgContext.textBaseline = "middle";
      var randomColor = colors[Math.floor(Math.random() * colors.length)]
      bgContext.fillStyle = randomColor

      bgContext.fillText(
        emoji,
        bgCanvas.width / 2,
        measurements.actualBoundingBoxAscent
      );

      canvImages.push(bgCanvas);
    });

    bindEvents();
    loop();
  }

  // Bind events that are needed
  function bindEvents() {
    element.addEventListener("mousemove", onMouseMove);
    element.addEventListener("touchmove", onTouchMove, { passive: true });
    element.addEventListener("touchstart", onTouchMove, { passive: true });
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

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      for (let i = 0; i < e.touches.length; i++) {
        addParticle(
          e.touches[i].clientX,
          e.touches[i].clientY,
          canvImages[Math.floor(Math.random() * canvImages.length)]
        );
      }
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

    addParticle(
      cursor.x,
      cursor.y,
      canvImages[Math.floor(Math.random() * possibleCharacters.length)]
    );
  }

  function addParticle(x, y, img) {
    particles.push(new Particle(x, y, img));
  }

  function updateParticles() {
    if (particles.length == 0) {
      return;
    }

    context.clearRect(0, 0, width, height);

    // Update
    for (let i = 0; i < particles.length; i++) {
      particles[i].update(context);
    }

    // Remove dead particles
    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].lifeSpan < 0) {
        particles.splice(i, 1);
      }
    }

    if (particles.length == 0) {
      context.clearRect(0, 0, width, height);
    }
  }

  function loop() {
    updateParticles();
    animationFrame = requestAnimationFrame(loop);
  }

  function destroy() {
    canvas.remove();
    cancelAnimationFrame(animationFrame);
    element.removeEventListener("mousemove", onMouseMove);
    element.removeEventListener("touchmove", onTouchMove);
    element.removeEventListener("touchstart", onTouchMove);
    window.addEventListener("resize", onWindowResize);
  };

  /**
   * Particles
   */

  function Particle(x, y, canvasItem) {
    const lifeSpan = characterLifeSpanFunction()
    this.rotationSign = randomPositiveOrNegativeOne()
    this.age = 0;
    this.initialLifeSpan = lifeSpan; //
    this.lifeSpan = lifeSpan; //ms
    this.velocity = initialCharacterVelocityFunction();
    this.position = { 
      x: x + cursorOffset.x, 
      y: y + cursorOffset.y 
    };
    this.canv = canvasItem;

    this.update = function (context) {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      this.lifeSpan--;
      this.age++;

      // TODO pass in custom update functions
      this.velocity.x += characterVelocityChangeFunctions.x_func(this.age, this.initialLifeSpan);
      this.velocity.y += characterVelocityChangeFunctions.y_func(this.age, this.initialLifeSpan);

      const scale = characterScalingFunction(this.age, this.initialLifeSpan);

      const degrees = this.rotationSign * characterNewRotationDegreesFunction(this.age, this.initialLifeSpan)
      const radians = degrees * 0.0174533; // not perfect but close enough

      context.translate(this.position.x, this.position.y);
      context.rotate(radians);

      context.drawImage(
        this.canv,
        (-this.canv.width / 2) * scale,
        -this.canv.height / 2,
        this.canv.width * scale,
        this.canv.height * scale
      );

      context.rotate(-radians);
      context.translate(-this.position.x, -this.position.y);
    };
  }

  init();

  return {
    destroy: destroy
  }
}
