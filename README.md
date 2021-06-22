![good times@2x](https://user-images.githubusercontent.com/5470780/122680091-f30b7200-d1ed-11eb-907c-3fe27ad3fd8e.png)

![npm](https://img.shields.io/npm/v/axette)
![GitHub Repo stars](https://img.shields.io/github/stars/matronator/axette)
![Snyk Vulnerabilities for npm package version](https://img.shields.io/snyk/vulnerabilities/npm/axette)
![npm](https://img.shields.io/npm/dw/axette)
![NPM](https://img.shields.io/npm/l/axette)
![npm dev dependency version](https://img.shields.io/npm/dependency-version/axette/dev/typescript)

# Axette

https://www.npmjs.com/package/axette

Very simple and lightweight AJAX implementation for [Nette](https://nette.org). Axette = AJAX for Nette!

## Table of Contents

* [Introduction](#axette)
  * [Features](#features)
* [Installation](#installation)
  * [With npm (recommended)](#with-npm-recommended)
  * [With yarn (recommended)](#with-yarn-recommended)
  * [With `<script>` tag](#with-script-tag)
  * [Fetch polyfill](#fetch-polyfill)
* [Usage](#usage)
  * [Custom CSS class](#custom-css-class)
  * [Custom event listeners](#custom-event-listeners)
  * [Remove `?_fid=XXXX` from URLs](#remove-?_fid=xxxx-from-urls)
* [Credits](#credits)
* [License](#license)

### Features

- No dependency required (NO jQuery!)
- Supports links and forms (`<a>` and `<form>` tags) to be handled by AJAX
- Fast snippet updating
- Handles snippet updates (`$this->redrawControl()`) as well as redirects (`$this->redirect()`)
- Simple to use
  - Just import it, call `axette.init()` and you're done!
- Get rid of `?_fid=6ge7` in the URL when using Flash Messages
- Attach custom callbacks to `onAjax` event

## Installation

### With npm (recommended):

```
npm install axette
```

### With yarn (recommended):

```
yarn add axette
```

### With `<script>` tag:

Download the [latest release](https://github.com/matronator/axette/releases/latest), move `axette.js` or `axette.min.js` somewhere to your project and include it in your HTML or Latte file via a `<script>` tag.

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Axette - AJAX for Nette!</title>
    </head>
    <body>
        ...

        <!-- Minified version (recommended for production) -->
        <script src="./dist/axette.min.js"></script>
        OR
        <!-- Un-minified version (recommended for development) -->
        <script src="./dist/axette.js"></script>

        <!-- Your other scripts here... -->
    </body>
</html>
```

### Fetch polyfill

If you're not using any transpiler or bundler (just importing `<script>` tags directly to your page) and want maximum browser compatibility, it's recommended to include a polyfill for the ES6 `fetch()` function as well.

You will find it along with the rest of the files either in the `dist/` folder or when downloading from [Releases](https://github.com/matronator/axette/releases).

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Axette with fetch polyfill</title>
    </head>
    <body>
        ...

        <!-- Optional fetch polyfill -->
        <script src="./dist/fetch.umd.js"></script>

        <!-- Axette -->
        <script src="./dist/axette.min.js"></script>

        <!-- Your other scripts here... -->
    </body>
</html>
```

*Credits to GitHub* - https://github.com/github/fetch

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

### Custom CSS class

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

## Credits

Huge thanks to [Matouš Trča](https://github.com/blackhexagon) from [@Visualio](https://github.com/visualio) who wrote the core logic for handling the HTTP response from Nette.

## License

MIT License

Copyright (c) 2021 Matronator

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
