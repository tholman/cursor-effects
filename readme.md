# 90s Cursor Effects

_"Knowing the codes" used to be all the rage, I want to bring a few back._

A repo of the old effects that inspired creativity and the desire to learn at least a little code around the world. Modernised so they're a little more efficient, and just as annoying (and twice as fun) as they were before. [Have a play here](https://tholman.com/cursor-effects).

The current effects are:

- Rainbow Cursor
- Emoji Rain
- Elastic Emoji
- Ghost Following
- Trailing Cursor
- Text Flag Cursor
- Following Dot
- Bubbles Particles
- Snowflake Particles
- Fairy Dust
- Clock Cursor
- Character Cursor

# How to Set Up Locally/Develop

1. First the packages request (this is only rollup, which code compilation) with `npm install`
2. `npm run watch` This will compile the src in the `dist` folder that `index.html` is looking for and update it when changes are made. You can then go to index.html in the web browser of your choice.

# How to Use

You need to include the following script tag in your webpage (see next section if you want to use this package via npm). And then, once the script is loaded you'll be able to add the effects to the page

```html
<script src="https://unpkg.com/cursor-effects@latest/dist/browser.js"></script>
```

Alternatively you can use a `type="module"` script on newer browsers with a import statement, if you are using the esm module you will import the cursor specific to your needs, rather than having to use the `cursoreffects.x` style.

```html
<script type="module">
  import { fairyDustCursor } from "https://unpkg.com/cursor-effects@latest/dist/esm.js";

  new fairyDustCursor();
</script>
```

And then create a new instance of its type in your JavaScript. The script will create the canvas that is used, so nothing else is really needed.

```js
window.addEventListener("load", (event) => {
  new cursoreffects.ghostCursor();
});
```

You can also target specific elements, to have the canvas appear inside those, for example:

```js
const targetElement = document.querySelector("#ghost");
new cursoreffects.ghostCursor({ element: targetElement });
```

To remove the effect, you can call `destroy` on it.
```js
// Create
let cursorEffect = new ghostCursor();

// Destroy
cursorEffect.destroy()
```


### or you can use NPM

```sh
npm install cursor-effects
```

```js
import { emojiCursor } from "cursor-effects";
new emojiCursor({ emoji: ["🔥", "🐬", "🦆"] });
```

## Specific Customization

A few of these have custom options as well (if you are interested in more options, opening an issue or PR is the way to go).

### rainbowCursor

You can change the colors, size and length in `rainbowCursor`

```js
new cursoreffects.rainbowCursor({
  length: 3,
  colors: ["red", "blue"],
  size: 4,
});
```

### springyEmojiCursor

You can change the emoji in `springyEmojiCursor`'s emoji with the `emoji` a single string emoji.

```js
new cursoreffects.springyEmojiCursor({ emoji: "🤷‍♂️" });
```

### fairyDustCursor

You can change the emoji in `fairyDustCursor`'s colors with the `colors` option (an array of colors)

```js
new cursoreffects.fairyDustCursor({
  colors: ["#ff0000", "#00ff00", "#0000ff"],
});
```

### emojiCursor

You can change the emoji in `emojiCursor`'s emoji with the `emoji` option (a list of emoji)

```js
new cursoreffects.emojiCursor({ emoji: ["🔥", "🐬", "🦆"] });
```

### textFlag

You can change the  `textFlag`'s text with the `text` option (String),
and color of the text with the `color` option (hex)

```js
 new textFlag({text: "test",color:["#FF6800"]});
```

## Accessibility

The cursor won't display if the user's system accessibility settings have [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) enabled.

### trailingCursor

You can change the number of trail steps in `trailingCursor` with the `particles` option (a number), the rate of the trail with the `rate` option (a number between 0 and 1, default is `0.4`), and the trailing cursor image with the `baseImageSrc` option (a URL or base64 string)

```js
new cursoreffects.trailingCursor({particles: 15, rate: 0.8, baseImageSrc: "data:image/png;base64,iVB..."});
```

You can change the color of the following dot in `followingDotCursor` with the `color` option (hex)

```js
new cursoreffects.followingDotCursor({ color: ["#323232a6"] });
```

### characterCursor

Consider this cursor as an extension of the snowflake cursor, but instead of the snowflake emoji you can specify a list of characters and colors to use as well as defining how the character's velocity, rotation and scaling should change over the characters lifespan. For example to produce the same effect you see in the demo page, you would use this. (It will also do this by default, but this is a great way to experiement and play around with the effect)
```js
new cursoreffects.characterCursor({ 
    element: document.querySelector("#character"), 
    characters: ["h", "e", "l", "l", "o"],
    font: "15px serif",
    colors: [
        "#6622CC",
        "#A755C2",
        "#B07C9E",
        "#B59194",
        "#D2A1B8",
    ],
    characterLifeSpanFunction: function() {
        return Math.floor(Math.random() * 60 + 80);
    },
    initialCharacterVelocityFunction: function() {
        return {
            x: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 5,
            y: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 5,
        }
    },
    characterVelocityChangeFunctions: {
      x_func: function(age, lifeSpan) {
        return (Math.random() < 0.5 ? -1 : 1)/30;
      },
      y_func: function(age, lifeSpan) {
        return (Math.random() < 0.5 ? -1 : 1)/ 15;
      },
    },
    characterScalingFunction: function(age, lifeSpan) {
        let lifeLeft = lifeSpan - age;
        return Math.max(lifeLeft / lifeSpan * 2, 0);
    },
    characterNewRotationDegreesFunction: function(age, lifeSpan) {
        let lifeLeft = lifeSpan - age;
        console.log(age, lifeSpan);
        return lifeLeft / 5;
    }
})
```

Note that none of these behavior changing options are required but in that case it will use similar physics to the snowflake and use the asterisk character instead.

# License

MIT af, but if you're using the scripts a [GitHub sponsorship](https://github.com/sponsors/tholman) or [shouting me a coffee](https://www.buymeacoffee.com/tholman) would always be appreciated :)
