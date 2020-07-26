# 90's Cursor Effects
_"Knowing the codes" used to be all the rage, I want to bring a few back._

A repo of the old effects that inspired creativity and the desire to learn at least a little code around the world. Modernised so they're a little more efficient, and just as annoying (and twice as fun) as they were before. [Have a play here](https://tholman.com/cursor-effects/).


## How to Use
For the most part these scripts are plug and play.

Include the script in your HTML... 

```
<script src="your/path/to/ghostCursor.js"></script>
```

And then create a new instance of its type in your JavaScript. The script will create the canvas that is used, so nothing else is really needed.

```
new ghostCursor();
```

You can also target specific elements, to have the canvas appear inside those, for example:

```
const targetElement = document.querySelector("#ghost")
new ghostCursor({element: targetElement});
```

## Specific Customization

A few of these have custom options as well (if you are interested in more options, opening an issue or PR is the way to go).

### springyEmojiCursor

You can change the emoji in `springyEmojiCursor`'s emoji with the `emoji` a single string emoji.

```
new springyEmojiCursor({emoji: "🤷‍♂️"});
```

### fairyDustCursor

You can change the emoji in `fairyDustCursor`'s colors with the `colors` option (an array of colors)

```
new fairyDustCursor({colors: ["#ff0000", "#00ff00", "#0000ff"]});
```

### emojiCursor


You can change the emoji in `emojiCursor`'s emoji with the `emoji` option (a list of emoji)

```
new emojiCursor({emoji: ["🔥", "🐬", "🦆"]});
```

## NPM
I haven't got around to it yet, but if you'd like to make a rollup that compiles everything all nice, be my guest... otherwise I'll get to it eventually!

## License

MIT af, but if you're using the scripts a [GitHub sponsorship](https://github.com/sponsors/tholman) or [shouting me a coffee](https://www.buymeacoffee.com/tholman) would always be appreciated :)
