// Text Flag
// via http://www.javascript-fx.com/mouse_trail/index.html (200X)
// via fun24.com (defunct, 199X)

export function textFlag(options) {
  let cursorOptions = options || {};
  let hasWrapperEl = options && options.element;
  let element = hasWrapperEl || document.body;

  let text = cursorOptions.text ? " " + options.text : " Your Text Here";
  let color = options?.color || "#000000";


  let font = cursorOptions.font || "monospace";
  let textSize = cursorOptions.textSize || 12;

  let fontFamily = textSize + "px " + font;

  let gap = cursorOptions.gap || textSize + 2;
  let angle = 0;
  let radiusX = 2;
  let radiusY = 5;
  let charArray = [];

  let width = window.innerWidth;
  let height = window.innerHeight;
  let cursor = { x: width / 2, y: width / 2 };

  for (let i = 0; i < text.length; i++) {
    charArray[i] = { letter: text.charAt(i), x: width / 2, y: width / 2 };
  }

  let canvas, context, animationFrame;

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
  }

  function updateParticles() {
    context.clearRect(0, 0, width, height);

    angle += 0.15;
    let locX = radiusX * Math.cos(angle);
    let locY = radiusY * Math.sin(angle);

    for (let i = charArray.length - 1; i > 0; i--) {
      charArray[i].x = charArray[i - 1].x + gap;
      charArray[i].y = charArray[i - 1].y;

      context.fillStyle = color;
      context.font = fontFamily;
      context.fillText(charArray[i].letter, charArray[i].x, charArray[i].y);
    }

    let x1 = charArray[0].x;
    let y1 = charArray[0].y;
    x1 += (cursor.x - x1) / 5 + locX + 2;
    y1 += (cursor.y - y1) / 5 + locY;
    charArray[0].x = x1;
    charArray[0].y = y1;
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
  }

  init();

  return {
    destroy: destroy,
  };
}
