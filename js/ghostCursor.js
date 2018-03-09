/*!
 * Ghost Cursors.js
 * - 90's cursors collection
 * -- https://github.com/tholman/90s-cursor-effects
 * -- http://codepen.io/tholman/full/oYJQZx
 */

(function ghostCursor() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var cursor = {
        x: width / 2,
        y: width / 2,
    };
    var particles = [];

    function init() {
        bindEvents();
        attachInitialParticleStyles();
        loop();
    }

    // Bind events that are needed
    function bindEvents() {
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("touchmove", onTouchMove);
        document.addEventListener("touchstart", onTouchMove);

        window.addEventListener("resize", onWindowResize);
    }

    function onWindowResize(e) {
        width = window.innerWidth;
        height = window.innerHeight;
    }

    function onTouchMove(e) {
        if (e.touches.length > 0) {
            for (var i = 0; i < e.touches.length; i++) {
                addParticle(e.touches[i].clientX, e.touches[i].clientY);
            }
        }
    }

    function onMouseMove(e) {
        cursor.x = e.clientX;
        cursor.y = e.clientY;

        addParticle(cursor.x, cursor.y);
    }

    function addParticle(x, y) {
        var particle = new Particle();
        particle.init(x, y);
        particles.push(particle);
    }

    function updateParticles() {
        // Updated
        for (var i = 0; i < particles.length; i++) {
            particles[i].update();
        }

        // Remove dead particles
        for (var i = particles.length - 1; i >= 0; i--) {
            if (particles[i].lifeSpan < 0) {
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
        // How long cursor particle will live for
        this.maxLifeSpan = 80;

        // Will begin fading at this point in the lifespan
        this.fadePoint = 50;

        this.lifeSpan = this.maxLifeSpan;

        // Init, and set properties
        this.init = function(x, y) {
            this.position = {
                x: x - 10,
                y: y - 10,
            };

            this.element = document.createElement("span");
            this.element.className = "particle-cursors";
            this.update();

            document.body.appendChild(this.element);
        };

        this.update = function() {
            this.lifeSpan--;

            this.element.style.transform = "translate3d(" + this.position.x + "px," + this.position.y + "px,0)";

            if (this.lifeSpan < this.fadePoint) {
                this.element.style.opacity = (this.lifeSpan - 1) / (this.fadePoint - 1);
            }
        };

        this.die = function() {
            this.element.parentNode.removeChild(this.element);
        };
    }

    /**
     * Utils
     */

    // Injects initial cursor styles to the head of the page.
    function attachInitialParticleStyles() {
        var initialStyles = [
            ".particle-cursors {",
            "position: absolute;",
            "display: block;",
            "pointer-events: none;",
            "z-index: 1000000;",
            "width: 12px;",
            "height: 19px;",
            "will-change: transform;",
            "background-size: contain;",
            "background-image: url('data:image/png;base64,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/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAA7NJREFUeAEAowNc/AEXFyPxp6WY3zQ2K0YBAwfqBgEHAAEAAgD9/fwA/P77AP4D/AADAQMABQAFAAH/AAACAAAADoGEjS/MztTBAf8DGv7/AQD/AAAA/AEAAPkC/wD3/wEA+/8DAPz+AQD/AQIAABcXI///////QEFJ/8DBw9318vUf8/DzAO7x8ADp8/AA7PXyAPP09QD18/YA+Pb1AAAXFyP///////////9AQUr/vLy/4fDp6yXw7u0A7/PxAPT49AD29vUA9fP0APX09AAAFxcj/////////////////z4+R/+9ubjm9fPuKvT48wD2+vQA9ffxAPDy7gDu8+0AABcXI///////////////////////P0BH/8HEv+v2+vEx9/nxAPX27wDx9e8A7PXtAAAXFyP///////////////////////////8/QUn/wMK/7/by7Dj28+8A8/byAO748gAAFxci/////////////////////////////////z8/Sf/Curzy9PHtP/H28QDr+PQAABcXIv/////////////////////////////////4+fv/QD5H/77AuPXu9utH6PfxAAAXFyL///////////////////////////////////////Dw8/8/QEb/vsG8+fD07k8AFxcj////////////////////////////////////////////6Ojq/z9ASf/AwMDXABcXI//////////////////////////////////////////////////h4eP/QEFK5gQAAAAAAAAAAAAAAAAAAAAA9fX4AAsLCAAAAAAAQEFLAAEAAAAAAP8A/wAAAAABAQ8AFxcj////////////9PT3/woKF/+ztLz//////0FBSv+vq6/59/PvOvL18Cf0+fQzABcXI///////9PT3/wsLGP++wML/KSo1///////h4eP/Kyo1//b08mjx9fQA9Pn1AAIAAAAA9fX4ABcWIACztav2MjQvaR4fHADDw8oAHh4cAB0gHAC1uLyXAgEBBgH/AQAAP0BJ9AsKF+XAvMDS8/LxOfL07gC/wL/tJiYx///////W1tj/LCw3//X08hH29vUAAPT49AD09fEA9vPwAPj27wD39+0A9vPvQUhIU//W1tj//////zExO//z9fEe9fbzAAD2+/cA9fn1APb17wD49uwA+PjtAPf18Aze2NvMJyYy3V5fZu7FyMX48fbtK/H07QABAAD//2frWsrkfUspAAAAAElFTkSuQmCC');",
            "}",
        ].join("");

        var style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = initialStyles;
        document.getElementsByTagName("head")[0].appendChild(style);
    }

    // Applies css `properties` to an element.
    function applyProperties(target, properties) {
        for (var key in properties) {
            target.style[key] = properties[key];
        }
    }

    init();
})();
