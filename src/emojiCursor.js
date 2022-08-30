export function emojiCursor(options) {
  const possibleEmoji = (options && options.emoji) || ["😀", "😂", "😆", "😊"]
  let hasWrapperEl = options && options.element
  let element = hasWrapperEl || document.body

  let width = window.innerWidth
  let height = window.innerHeight
  const cursor = { x: width / 2, y: width / 2 }
  const lastPos = { x: width / 2, y: width / 2 }
  let lastTimestamp = 0
  const particles = []
  const canvImages = []
  let canvas, context
  let lastTime = 0;

  function init() {
    canvas = document.createElement("canvas")
    context = canvas.getContext("2d")

    canvas.style.top = "0px"
    canvas.style.left = "0px"
    canvas.style.pointerEvents = "none"

    if (hasWrapperEl) {
      canvas.style.position = "absolute"
      element.appendChild(canvas)
      canvas.width = element.clientWidth
      canvas.height = element.clientHeight
    } else {
      canvas.style.position = "fixed"
      document.body.appendChild(canvas)
      canvas.width = width
      canvas.height = height
    }

    context.font = "21px serif"
    context.textBaseline = "middle"
    context.textAlign = "center"

    possibleEmoji.forEach((emoji) => {
      let measurements = context.measureText(emoji)
      let bgCanvas = document.createElement("canvas")
      let bgContext = bgCanvas.getContext("2d")

      bgCanvas.width = measurements.width
      bgCanvas.height = measurements.actualBoundingBoxAscent * 2

      bgContext.textAlign = "center"
      bgContext.font = "21px serif"
      bgContext.textBaseline = "middle"
      bgContext.fillText(
        emoji,
        bgCanvas.width / 2,
        measurements.actualBoundingBoxAscent
      )

      canvImages.push(bgCanvas)
    })

    bindEvents()
    requestAnimationFrame(loop);
  }

  // Bind events that are needed
  function bindEvents() {
    element.addEventListener("mousemove", onMouseMove, { passive: true })
    element.addEventListener("touchmove", onTouchMove, { passive: true })
    element.addEventListener("touchstart", onTouchMove, { passive: true })
    window.addEventListener("resize", onWindowResize)
  }

  function onWindowResize(e) {
    width = window.innerWidth
    height = window.innerHeight

    if (hasWrapperEl) {
      canvas.width = element.clientWidth
      canvas.height = element.clientHeight
    } else {
      canvas.width = width
      canvas.height = height
    }
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      for (let i = 0; i < e.touches.length; i++) {
        addParticle(
          e.touches[i].clientX,
          e.touches[i].clientY,
          canvImages[Math.floor(Math.random() * canvImages.length)]
        )
      }
    }
  }

  function onMouseMove(e) {
    // Dont run too fast
    if (e.timeStamp - lastTimestamp < 16) {
      return
    }

    window.requestAnimationFrame(() => {
      if (hasWrapperEl) {
        const boundingRect = element.getBoundingClientRect()
        cursor.x = e.clientX - boundingRect.left
        cursor.y = e.clientY - boundingRect.top
      } else {
        cursor.x = e.clientX
        cursor.y = e.clientY
      }

      const distBetweenPoints = Math.hypot(
        cursor.x - lastPos.x,
        cursor.y - lastPos.y
      )

      if (distBetweenPoints > 1) {
        addParticle(
          cursor.x,
          cursor.y,
          canvImages[Math.floor(Math.random() * possibleEmoji.length)]
        )

        lastPos.x = cursor.x
        lastPos.y = cursor.y
        lastTimestamp = e.timeStamp
      }
    })
  }

  function addParticle(x, y, img) {
    particles.push(new Particle(x, y, img))
  }

  function updateParticles(deltaTime) {
    context.clearRect(0, 0, width, height)

    // Update
    for (let i = 0; i < particles.length; i++) {
      particles[i].update(context, deltaTime)
    }

    // Remove dead particles
    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].lifeSpan < 0) {
        particles.splice(i, 1)
      }
    }
  }

  function loop(time) {
    const deltaTime = Math.min(100, time - lastTime) / (1000 / 60); 
    lastTime = time;
    updateParticles(deltaTime)
    requestAnimationFrame(loop)
  }

  /**
   * Particles
   */

  function Particle(x, y, canvasItem) {
    const lifeSpan = Math.floor(Math.random() * 60 + 80)
    this.initialLifeSpan = lifeSpan //
    this.lifeSpan = lifeSpan //ms
    this.velocity = {
      x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
      y: Math.random() * 0.4 + 0.8,
    }
    this.position = { x: x, y: y }
    this.canv = canvasItem

    this.update = function(context, deltaTime) {
      this.position.x += this.velocity.x * deltaTime
      this.position.y += this.velocity.y * deltaTime
      this.lifeSpan -= deltaTime;

      this.velocity.y += 0.05 * deltaTime;

      const scale = Math.max(this.lifeSpan / this.initialLifeSpan, 0)

      context.drawImage(
        this.canv,
        this.position.x - (this.canv.width / 2) * scale,
        this.position.y - this.canv.height / 2,
        this.canv.width * scale,
        this.canv.height * scale
      )
    }
  }

  init()
}
