export function antsCursor(options) {
  let hasWrapperEl = options && options.element;
  let element = hasWrapperEl || document.body;

  let width = window.innerWidth;
  let height = window.innerHeight;
  const cursor = { x: width / 2, y: height / 2 };
  const ants = [];
  let canvas, context, animationFrame;

  const numberOfAnts = options?.numberOfAnts || 20;
  const followRange = options?.followRange || 60;
  const antColor = options?.color || "#4a2c0a";
  const antSpeed = options?.speed || 1.2;
  const lineFormationSpeed = options?.lineFormationSpeed || 0.12;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  prefersReducedMotion.onchange = () => {
    if (prefersReducedMotion.matches) {
      destroy();
    } else {
      init();
    }
  };

  function init() {
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
    canvas.style.zIndex = options?.zIndex || "9999999999";

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

    // Spawn ants at random positions
    for (let i = 0; i < numberOfAnts; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ants.push(new Ant(x, y, i));
    }

    bindEvents();
    loop();
  }

  function bindEvents() {
    element.addEventListener("mousemove", onMouseMove);
    element.addEventListener("touchmove", onTouchMove, { passive: true });
    element.addEventListener("touchstart", onTouchMove, { passive: true });
    window.addEventListener("resize", onWindowResize);
  }

  function onWindowResize() {
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
      if (hasWrapperEl) {
        const boundingRect = element.getBoundingClientRect();
        cursor.x = e.touches[0].clientX - boundingRect.left;
        cursor.y = e.touches[0].clientY - boundingRect.top;
      } else {
        cursor.x = e.touches[0].clientX;
        cursor.y = e.touches[0].clientY;
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
  }

  function updateAnts() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Reset following state
    ants.forEach((ant) => {
      ant.following = false;
      ant.followTarget = null;
    });

    // Build the chain: find ants close to cursor first
    const followingAnts = [];

    // First pass: find ants within range of cursor
    ants.forEach((ant) => {
      const distToCursor = Math.hypot(
        ant.position.x - cursor.x,
        ant.position.y - cursor.y
      );
      if (distToCursor < followRange) {
        ant.following = true;
        ant.target = cursor;
        followingAnts.push(ant);
      }
    });

    // Keep adding ants that are close to any following ant
    let addedNew = true;
    while (addedNew) {
      addedNew = false;
      ants.forEach((ant) => {
        if (ant.following) return;

        // Find the closest following ant
        let closestDist = Infinity;
        let closestAnt = null;

        followingAnts.forEach((followingAnt) => {
          const dist = Math.hypot(
            ant.position.x - followingAnt.position.x,
            ant.position.y - followingAnt.position.y
          );
          if (dist < closestDist) {
            closestDist = dist;
            closestAnt = followingAnt;
          }
        });

        if (closestDist < followRange && closestAnt) {
          ant.following = true;
          ant.target = closestAnt.position;
          followingAnts.push(ant);
          addedNew = true;
        }
      });
    }

    // Update and draw all ants
    ants.forEach((ant) => {
      if (ant.following && ant.target) {
        ant.moveToward(ant.target);
      } else {
        ant.wander();
      }
      ant.update();
      ant.draw(context);
    });
  }

  function loop() {
    updateAnts();
    animationFrame = requestAnimationFrame(loop);
  }

  function destroy() {
    canvas.remove();
    cancelAnimationFrame(animationFrame);
    element.removeEventListener("mousemove", onMouseMove);
    element.removeEventListener("touchmove", onTouchMove);
    element.removeEventListener("touchstart", onTouchMove);
    window.removeEventListener("resize", onWindowResize);
  }

  function Ant(x, y, index) {
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.angle = Math.random() * Math.PI * 2;
    this.wanderAngle = this.angle;
    this.index = index;
    this.following = false;
    this.target = null;
    this.legPhase = Math.random() * Math.PI * 2;
    this.size = 1.5 + Math.random() * 1;

    this.wander = function () {
      // Random wandering behavior
      this.wanderAngle += (Math.random() - 0.5) * 0.3;

      const targetVx = Math.cos(this.wanderAngle) * antSpeed * 0.5;
      const targetVy = Math.sin(this.wanderAngle) * antSpeed * 0.5;

      this.velocity.x += (targetVx - this.velocity.x) * 0.05;
      this.velocity.y += (targetVy - this.velocity.y) * 0.05;

      // Bounce off edges
      if (this.position.x < 20) this.wanderAngle = 0;
      if (this.position.x > canvas.width - 20) this.wanderAngle = Math.PI;
      if (this.position.y < 20) this.wanderAngle = Math.PI / 2;
      if (this.position.y > canvas.height - 20) this.wanderAngle = -Math.PI / 2;
    };

    this.moveToward = function (target) {
      const dx = target.x - this.position.x;
      const dy = target.y - this.position.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 8) {
        const targetAngle = Math.atan2(dy, dx);

        // Smoothly interpolate angle - faster turning
        let angleDiff = targetAngle - this.angle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        this.angle += angleDiff * 0.3;

        const speed = Math.min(antSpeed * 1.8, dist * 0.15);
        const targetVx = Math.cos(this.angle) * speed;
        const targetVy = Math.sin(this.angle) * speed;

        this.velocity.x += (targetVx - this.velocity.x) * 0.2;
        this.velocity.y += (targetVy - this.velocity.y) * 0.2;
      } else {
        // Slow down when close to target
        this.velocity.x *= 0.8;
        this.velocity.y *= 0.8;
      }
    };

    this.update = function () {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      // Update angle based on velocity
      if (Math.hypot(this.velocity.x, this.velocity.y) > 0.1) {
        this.angle = Math.atan2(this.velocity.y, this.velocity.x);
      }

      // Keep within bounds
      this.position.x = Math.max(5, Math.min(canvas.width - 5, this.position.x));
      this.position.y = Math.max(5, Math.min(canvas.height - 5, this.position.y));

      // Animate legs
      this.legPhase += Math.hypot(this.velocity.x, this.velocity.y) * 0.3;
    };

    this.draw = function (ctx) {
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate(this.angle);

      const s = this.size;
      const phase = this.legPhase;

      // Draw legs - alternating tripod gait
      // Group A: front-left, middle-right, back-left
      // Group B: front-right, middle-left, back-right
      ctx.strokeStyle = antColor;
      ctx.lineWidth = 0.5;

      const legPositions = [
        { x: s * 0.4, side: -1, group: 0 },   // front-left
        { x: s * 0.4, side: 1, group: 1 },    // front-right
        { x: 0, side: -1, group: 1 },          // middle-left
        { x: 0, side: 1, group: 0 },           // middle-right
        { x: -s * 0.5, side: -1, group: 0 },  // back-left
        { x: -s * 0.5, side: 1, group: 1 },   // back-right
      ];

      legPositions.forEach((leg) => {
        const wiggle = Math.sin(phase + leg.group * Math.PI) * 0.4;
        const extendY = s * 0.9 * leg.side;
        const extendX = leg.x - s * 0.3 + wiggle * s * 0.3;

        ctx.beginPath();
        ctx.moveTo(leg.x, 0);
        ctx.lineTo(extendX, extendY);
        ctx.stroke();
      });

      // Draw body (3 segments)
      ctx.fillStyle = antColor;

      // Head
      ctx.beginPath();
      ctx.ellipse(s * 0.9, 0, s * 0.5, s * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Thorax (middle)
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.5, s * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();

      // Abdomen (back)
      ctx.beginPath();
      ctx.ellipse(-s * 1.1, 0, s * 0.7, s * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Antennae
      ctx.strokeStyle = antColor;
      ctx.lineWidth = 0.4;
      ctx.beginPath();
      ctx.moveTo(s * 1.2, -s * 0.2);
      ctx.quadraticCurveTo(s * 1.6, -s * 0.6, s * 1.8, -s * 0.3);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(s * 1.2, s * 0.2);
      ctx.quadraticCurveTo(s * 1.6, s * 0.6, s * 1.8, s * 0.3);
      ctx.stroke();

      ctx.restore();
    };
  }

  init();

  return {
    destroy: destroy
  };
}
