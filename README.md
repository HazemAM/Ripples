# Ripples

A simple, standalone, and customizable Material Design [surface reaction](https://material.io/guidelines/motion/material-motion.html) implementation.

&bullet; [***Demo***](https://hazemam.github.io/Ripples/demo) &bullet;



## Features

1.  **No dependencies:** *Ripples* is standalone and requires absolutely no dependencies.
    This makes the whole asset size `< 6KB` *non-minified*, and *non-gzipped*!

2.  **Performant:** *Ripples* internally uses custom-made animations inside of JavaScript's animation frames, for the best performance experience.

3.  **Keyboard support:** *Ripples* has support for `Enter`/`Return` and `Space` keybaord events.

4.  **Faithful to the source:** *Ripples* was mainly created as a simple and standalone implementation of the Material Design ripples (check [`/demo`](https://hazemam.github.io/Ripples/demo)). As a result, you'll see things like:

    1.  **Multiple ripples:** Every click generates a reaction as you'd expect. No more single-ripple animation resets before they actually finish.

    2.  **Animation easings.**

    3.  **Proper clipping on all elements.**



## Installation

You can use it in one of two ways:

1. You can add `script.js` and `style.css` in your HTML, e.g.:

   ````html
   <link rel="stylesheet" href="ripples/style.css"/>
   <script src="ripples/script.js"></script>
   ````

   Then use it from global scope (`window.Ripples`).
   
2. Or you can just add `script.js` and `style.css` to your project tree and then `require()` it as a module (e.g. `CommonJS`, `AMD`).


## Usage

To use *Ripples*:

1. First, add a `ripple` class to the DOM elements you want the ripples added to, e.g.:

   ````html
   <button class="ripple">Hello!</button>
   ````

2. Then, call `Ripples.init()` when the page/app is ready.

**Warning:** *Ripples* work on all elements except [void elements](http://www.w3.org/TR/html5/syntax.html#void-elements). If you want ripples to be added to a void element, you must wrap it in, say, a `div` parent.

````html
<div class="ripple">
  <img src="photo.jpg"/>
</div>
````

**Tip:** *Ripples* uses a minimal stylesheet to style the ripples. The *only* styling *Ripples* add to **your element** is `position: relative`, which is necessary for the ripples to work in all situations. The rest in `style.css` is styling the actual ripple circles.



## Customization

*Ripples* currently supports the following customization:


### Ripple color

You can customize the ripple color in a `data-ripple-color` element attribute:

````html
<button class="ripple" data-ripple-color="rgba(0, 0, 0, 0.5)">Hello!</button>
````

You can use any CSS-compatible format (e.g.: `rgba()`, `hsla()`, hexadecimal, ...etc).

*Default value*: `white`.
    
    
### Ripple opacity

You can customize the ripple opacity in a `data-ripple-opacity` element attribute:
    
````html
<button class="ripple" data-ripple-opacity="0.25">Hello!</button>
````

A use-case of this attribute is when you want to keep your markup clean. So you can use a simple `data-ripple-color` like `black`, but still customize the opacity, in a non-`rgba()`/`hsla()` way, which looks a bit cleaner in markup:

````html
<button class="ripple"
  data-ripple-color="black"
  data-ripple-opacity="0.25">
  Hello!
</button>
````

*Default value*: `0.5`.



## Contributing

Issues and pull requests are always welcome.



## License

&copy; Copyright 2017 Hazem AbuMostafa.

This project is subject to the [Apache License, Version 2.0](http://apache.org/licenses/LICENSE-2.0.html).
