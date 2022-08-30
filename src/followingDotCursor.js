export function followingDotCursor(options) {
  let hasWrapperEl = options && options.element;
  let element = hasWrapperEl || document.body;

  let width = window.innerWidth;
  let height = window.innerHeight;
  let cursor = { x: width / 2, y: width / 2 };
  let dot = new Dot(width / 2, height / 2, 10, 10);
  let canvas, context;
  let lastTime = 0;

  function init() {
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
    requestAnimationFrame(loop);
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

  function updateDot(deltaTime) {
    context.clearRect(0, 0, width, height);

    dot.moveTowards(cursor.x, cursor.y, context, deltaTime);
  }

  function loop(time) {
    const deltaTime = Math.min(100, time - lastTime) / (1000 / 60);
    lastTime = time;
    updateDot(deltaTime);
    requestAnimationFrame(loop);
  }

  function Dot(x, y, width, lag) {
    this.position = { x: x, y: y };
    this.width = width;
    this.lag = lag;

    this.moveTowards = function (x, y, context, deltaTime) {
      this.position.x += (x - this.position.x) / (this.lag / deltaTime);
      this.position.y += (y - this.position.y) / (this.lag / deltaTime);

      context.fillStyle = "rgba(50, 50, 50, 0.65)";
      context.beginPath();
      context.arc(this.position.x, this.position.y, this.width, 0, 2 * Math.PI);
      context.fill();
      context.closePath();
    };
  }

  init();
}
