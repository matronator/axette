# Axette - AJAX for Nette

Very simple and lightweight AJAX implementation for [Nette](https://nette.org)

## Install

### With npm:

```
npm install axette
```

### With yarn:

```
yarn add axette
```

### With `<script>` tag / via CDN:

Soon

## Usage

Add a class to the links or forms that you would like to handle via AJAX:

```html
<a n:href="update!" class="ajax">Update snippets</a>
```

And in your `index.js` or other JavaScript file you just import `axette` and call the `init()` function like this:

```js
import axette from "axette"

axette.init()
```

And that's it! The `.init()` method handles everything.

If you'd like to use some other class for your links, you just pass the name of the class as a parameter in the `.init()`. So if for instance you want your AJAX links to have `custom-class` instead of `ajax`, then you'd do it like so:

`index.html`:

```html
<a n:href="update!" class="custom-class">Update snippets</a>
```

`index.js`:


```js
import axette from "axette"

axette.init("custom-class")
```

### Custom event listeners

If you have some event listeners that you're adding on the `DOMContentLoaded` event or similar, you will have to wrap them in a function and pass it as a hook to `axette`, to have them re-registered after the AJAX request is received. You can do that using the `.on()` function. So if you have something like this:

```js
document.addEventListener(`DOMContentLoaded`, () => {
    const buttons = document.querySelectorAll(`.btn`)
    buttons.forEach(button => {
        button.addEventListener(`click`, e => {
            e.preventDefault()
            // ...
        })
    })
})
```

You'd wrap it in a function and pass that function as a parameter to the `.on()` function like so:

```js
function registerButtons() {
    document.addEventListener(`DOMContentLoaded`, () => {
        const buttons = document.querySelectorAll(`.btn`)
        buttons.forEach(button => {
            button.addEventListener(`click`, e => {
                e.preventDefault()
                // ...
            })
        })
    })
}

axette.on(`onAjax`, registerButtons)
```

Or you could directly call `.onAjax()` or `.onInit()` with just the function reference like this:

```js
axette.onAjax(registerButtons)
// or
axette.onInit(registerButtons)
```

### Remove `?_fid=XXXX` from URLs

Nette by default appends `?_fid=XXXX` to the URLs if you call the `flashMessage()` function. To remove this from the URL, you can call the `.fixURL()` function somewhere in your script:

```js
axette.fixURL()
```
