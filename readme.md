## 90's Cursor Effects
_"Knowing the codes" used to be all the rage, I want to bring a few back._

A repo of the old effects that inspired creativity and the desire to learn at least a little code around the world. Modernised so they're a little more efficient, and just as annoying (and twice as fun) as they were before.


#### How to Use
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

#### NPM
I haven't got around to this part yet, but if you'd like to make a rollup function that compiles everything all nice, be my guest... otherwise I'll get to it eventually!

#### Contributing
