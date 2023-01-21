// The trailing cursor's easing has bene pulled from this demo
// - https://codepen.io/jakedeakin/full/MWKQVxX

export function trailingCursor(options) {
  let hasWrapperEl = options && options.element;
  let element = hasWrapperEl || document.body;

  let width = window.innerWidth;
  let height = window.innerHeight;
  let cursor = { x: width / 2, y: width / 2 };
  let particles = [];
  let canvas, context, animationFrame;

  const totalParticles = options?.particles || 15;
  const rate = options?.rate || 0.4;
  const baseImageSrc = options?.baseImageSrc || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAATCAYAAACk9eypAAAAAXNSR0IArs4c6QAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAhGVYSWZNTQAqAAAACAAFARIAAwAAAAEAAQAAARoABQAAAAEAAABKARsABQAAAAEAAABSASgAAwAAAAEAAgAAh2kABAAAAAEAAABaAAAAAAAAAEgAAAABAAAASAAAAAEAA6ABAAMAAAABAAEAAKACAAQAAAABAAAADKADAAQAAAABAAAAEwAAAAAChpcNAAAACXBIWXMAAAsTAAALEwEAmpwYAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpMwidZAAABqElEQVQoFY3SPUvDQBgH8BREpRHExYiDgmLFl6WC+AYmWeyLg4i7buJX8DMpOujgyxGvUYeCgzhUQUSKKLUS0+ZyptXh8Z5Ti621ekPyJHl+uftfomhaf9Ei5JyxXKfynyEA6EYcLHpwyflT958GAQ7DTABNHd8EbtDbEH2BD5QEQmi2mM8P/Iq+A0SzszEg+3sPjDnDdVEtQKQbMUidHD3xVzf6A9UDEmEm+8h9KTqTVUjT+vB53aHrCbAPiceYq1dQI1Aqv4EhMll0jzv+Y0yiRgCnLRSYyDQHVoqUXe4uKL9l+L7GXC4vkMhE6eW/AOJs9k583ORDUyXMZ8F5SVHVVnllmPNKSFagAJ5DofaqGXw/gHBYg51dIldkmknY3tguv3jOtHR4+MqAzaraJXbEhqHhcQlwGSOi5pytVQHZLN5s0WNe8HPrLYlFsO20RPHkImxsbmHdLJFI76th7Z4SeuF53hTeFLvhRCJRCTKZKxgdnRDbW+iozFJbBMw14/ElwGYc0egMBMFzT21f5Rog33Z7dX02GBm7WV5ZfT5Nn5bE3zuCDe9UxdTpNvK+5AAAAABJRU5ErkJggg==";
  let cursorsInitted = false;

  let baseImage = new Image();
  baseImage.src = baseImageSrc;

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
        addParticle(cursor.x, cursor.y, baseImage);
      }
    }
  }

  function addParticle(x, y, image) {
    particles.push(new Particle(x, y, image));
  }

  function updateParticles() {
    context.clearRect(0, 0, width, height);

    let x = cursor.x;
    let y = cursor.y;

    particles.forEach(function (particle, index, particles) {
      let nextParticle = particles[index + 1] || particles[0];

      particle.position.x = x;
      particle.position.y = y;
      particle.move(context);
      x += (nextParticle.position.x - particle.position.x) * rate;
      y += (nextParticle.position.y - particle.position.y) * rate;
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

  /**
   * Particles
   */

  function Particle(x, y, image) {
    this.position = { x: x, y: y };
    this.image = image;

    this.move = function (context) {
      context.drawImage(
        this.image,
        this.position.x, // - (this.canv.width / 2) * scale,
        this.position.y //- this.canv.height / 2,
      );
    };
  }

  init();

  return {
    destroy: destroy
  }
}
