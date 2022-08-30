export function snowflakeCursor(options) {
  let hasWrapperEl = options && options.element
  let element = hasWrapperEl || document.body

  let possibleEmoji = ["❄️"]
  let width = window.innerWidth
  let height = window.innerHeight
  let cursor = { x: width / 2, y: width / 2 }
  let particles = []
  let canvas, context
  let lastTime = 0

  let canvImages = []

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

    context.font = "12px serif"
    context.textBaseline = "middle"
    context.textAlign = "center"

    possibleEmoji.forEach((emoji) => {
      let measurements = context.measureText(emoji)
      let bgCanvas = document.createElement("canvas")
      let bgContext = bgCanvas.getContext("2d")

      bgCanvas.width = measurements.width
      bgCanvas.height = measurements.actualBoundingBoxAscent * 2

      bgContext.textAlign = "center"
      bgContext.font = "12px serif"
      bgContext.textBaseline = "middle"
      bgContext.fillText(
        emoji,
        bgCanvas.width / 2,
        measurements.actualBoundingBoxAscent
      )

      canvImages.push(bgCanvas)
    })

    bindEvents()
    requestAnimationFrame(loop)
  }

  // Bind events that are needed
  function bindEvents() {
    element.addEventListener("mousemove", onMouseMove)
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
    if (hasWrapperEl) {
      const boundingRect = element.getBoundingClientRect()
      cursor.x = e.clientX - boundingRect.left
      cursor.y = e.clientY - boundingRect.top
    } else {
      cursor.x = e.clientX
      cursor.y = e.clientY
    }

    addParticle(
      cursor.x,
      cursor.y,
      canvImages[Math.floor(Math.random() * possibleEmoji.length)]
    )
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
      y: 1 + Math.random(),
    }
    this.position = { x: x, y: y }
    this.canv = canvasItem

    this.update = function(context, deltaTime) {
      this.position.x += this.velocity.x * deltaTime
      this.position.y += this.velocity.y * deltaTime
      this.lifeSpan -= deltaTime;

      this.velocity.x += ((Math.random() < 0.5 ? -1 : 1) * 2) / 75 * deltaTime
      this.velocity.y -= Math.random() / (300 * deltaTime)

      const scale = Math.max(this.lifeSpan / this.initialLifeSpan, 0)

      const degrees = 2 * this.lifeSpan
      const radians = degrees * 0.0174533 // not perfect but close enough

      context.translate(this.position.x, this.position.y)
      context.rotate(radians)

      context.drawImage(
        this.canv,
        (-this.canv.width / 2) * scale,
        -this.canv.height / 2,
        this.canv.width * scale,
        this.canv.height * scale
      )

      context.rotate(-radians)
      context.translate(-this.position.x, -this.position.y)
    }
  }

  init()
}
