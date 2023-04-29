![Axette logo](https://user-images.githubusercontent.com/5470780/122844829-ca28d100-d302-11eb-870f-050666075034.png)

![npm](https://img.shields.io/npm/v/axette)
![GitHub Repo stars](https://img.shields.io/github/stars/matronator/axette)
![Snyk Vulnerabilities for npm package version](https://img.shields.io/snyk/vulnerabilities/npm/axette)
[![CodeFactor](https://www.codefactor.io/repository/github/matronator/axette/badge)](https://www.codefactor.io/repository/github/matronator/axette)
![npm](https://img.shields.io/npm/dw/axette)
![NPM](https://img.shields.io/npm/l/axette)
![npm TypeScript version](https://img.shields.io/npm/dependency-version/axette/dev/typescript)
[![Buy us a tree](https://img.shields.io/badge/Treeware-%F0%9F%8C%B3-lightgreen)](https://plant.treeware.earth/matronator/axette)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/U7U2MDBC)

# Axette

https://www.npmjs.com/package/axette

Very simple and lightweight AJAX implementation for [Nette](https://nette.org). Axette = AJAX for Nette!

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Installation](#installation)
  - [With package manager (recommended)](#with-package-manager-recommended)
    - [NPM:](#npm)
    - [PNPM:](#pnpm)
    - [Yarn:](#yarn)
    - [Bun:](#bun)
  - [With a `<script>` tag:](#with-a-script-tag)
- [Migration from 1.x to 2.x](#migration-from-1x-to-2x)
  - [Breaking changes](#breaking-changes)
- [Usage](#usage)
  - [Custom CSS selector](#custom-css-selector)
  - [Custom event listeners](#custom-event-listeners)
  - [Events](#events)
    - [`beforeInit`](#beforeinit)
    - [`afterInit`](#afterinit)
    - [`beforeAjax`](#beforeajax)
    - [`afterAjax`](#afterajax)
  - [Sending requests manually](#sending-requests-manually)
  - [Remove `?_fid=XXXX` from URLs](#remove-_fidxxxx-from-urls)
- [Credits](#credits)
- [License](#license)

## Features

- Lightweight (**1kb** gzipped, **3kb** minified)
- Blazingly Fast
- No dependencies (no jQuery!)
- Simple to use
  - Just import it, call `const axette = new Axette()` and you're done!
- Supports links and forms (`<a>` and `<form>` tags) to be handled by AJAX
- Handles snippet updates (`$this->redrawControl()`) as well as redirects (`$this->redirect()`)
- Automatically executes JavaScript inside `<script>` tags in the snippets returned from AJAX requests
- Get rid of `?_fid=6ge7` in the URL when using Flash Messages
- Attach custom callbacks to various events (`beforeInit`, `afterInit`, `beforeAjax`, etc...)

## Installation

### With package manager (recommended)

#### NPM:

```
npm install axette
```

#### PNPM:

```
pnpm install axette
```

#### Yarn:

```
yarn add axette
```

#### Bun:

```sh
bun add axette
# or
bun install axette
```

### With a `<script>` tag:

Download the [latest release](https://github.com/matronator/axette/releases/latest), move `axette.iife.js` from the `dist/` folder somewhere to your project and include it in your HTML or Latte file via a `<script>` tag.

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Axette - AJAX for Nette!</title>
    </head>
    <body>
        ...

        <!-- Local version -->
        <script src="./path/to/axette.iife.js"></script>
        OR
        <!-- Via CDN -->
        <script src="https://unpkg.com/axette@latest/dist/axette.iife.js"></script>

        <!-- Your other scripts here... -->
    </body>
</html>
```

## Migration from 1.x to 2.x

Axette 2.x is a partial rewrite of the original 1.x version. It tries to keep the same API as much as possible, but there are some breaking changes.

### Breaking changes

- `Axette` is now a class instead of an object and is a named export instead of default export. This means that you need to import it like this:

```js
// Change this:
import axette from 'axette';

// To this:
import { Axette } from 'axette';
```

- You can now use any CSS selector for custom AJAX handlers and not just a class, so you can use for instance data-attributes instead. It's also not defined in the `init()` method anymore, but in the `Axette` class constructor. So if you want to use `[data-ajax]` instead of `.ajax` class, you'd do it like this (no need to call `init()` as that's called automatically in the constructor):

```js
import { Axette } from 'axette';

// Change this:
axette.init('ajax'); // note that here you can define only a class name

// To this:
const axette = new Axette('[data-ajax]'); // here you can define any CSS selector

// You can also use multiple selectors like this:
const axette = new Axette('.ajax, [data-ajax]');
```

```html
<a n:href="update!" data-ajax>Update snippets</a>
```

Or call it empty to use the default class name `.ajax` like before:

```js
const axette = new Axette();

// Is equivalent to this in the 1.x version:
axette.init();
```

- It is now possible to change the CSS selector after the `Axette` instance is created. So if you want to use a different selector after already using the original one, you can do so like this:

```js
import { Axette } from 'axette';

const axette = new Axette('.old-selector');

// Do some stuff...

axette.setSelector('.new-selector'); // Beware that this will call the `init()` method again, so your init hooks (beforeInit, afterInit) will be called again
```

- To remove the `?_fid=XXXX` in the URL when using Flash Messages, you now need to import the `noFlashUrl()` function without having to import Axette as well, instead of calling `fixUrl()` method on the axette object:

```js
// Change this:
axette.fixUrl();

// To this:
import { noFlashUrl } from 'axette';

noFlashUrl();
```

## Usage

Add `ajax` class to the links or forms that you would like to handle via AJAX:

```html
<a n:href="update!" class="ajax">Update snippets</a>
```

And in your `index.js` or other JavaScript file you just import `Axette` and initialize it:

```js
import { Axette } from "axette"

const axette = new Axette();
```

And that's it! The class constructor handles everything.

### Custom CSS selector

If you'd like to use some other class for your links, you just pass the name of the class as a parameter in the constructor. So if for instance you want your AJAX links to have `custom-class` instead of `ajax`, then you'd do it like so:

`index.html`:

```html
<a n:href="update!" class="custom-class">Update snippets</a>
```

`index.js`:

```js
import { Axette } from "axette"

const axette = new Axette('.custom-class'); // The selector can be any valid CSS selector

// You can also use multiple selectors like this:
const axette = new Axette('.custom-class, [data-ajax]');
```

### Custom event listeners

If you have some event listeners that you're adding on the `DOMContentLoaded` event or similar and you want them to work even after an AJAX request, you will have to wrap them in a function and pass it as a hook to `axette`, to have them re-registered after the AJAX request is received. You can do that using the `.on()` method. So if you have something like this:

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
import { Axette } from "axette"

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

const axette = new Axette()
axette.on(`afterAjax`, registerButtons)
```

Or you could directly call `onBeforeAjax()`, `onAfterAjax()`, `onBeforeInit()` or `onAfterInit()` with the function reference, optional arguments and optional ID like this:

```js
axette.onAfterAjax(registerButtons)
// or with the ID and arguments:
axette.onAfterAjax(registerButtons, [arg1, arg2], 'my-id')
// or with the ID only:
axette.onAfterAjax(registerButtons, [], 'my-id')
```

And then you can remove the hook with the `.off()` method:

```js
// Either by passing the function reference:
axette.off(`afterAjax`, registerButtons)
// or with ID:
axette.off(`afterAjax`, 'my-id')
// or with the Hook object:
axette.off(hook)
```

Or you can call the method without any parameters to remove all hooks on that specific event:

```js
axette.off(`afterAjax`)
```

### Events

Axette has several events you can attach hooks (callbacks) to. You can attach multiple hooks to the same event. The hooks are called in the order they were attached.

#### `beforeInit`

Called before the `init()` method is called.

#### `afterInit`

Called after the `init()` method is called.

#### `beforeAjax`

Called before the AJAX request is sent.

#### `afterAjax`

Called after the AJAX request is sent.

### Sending requests manually

If you call `fetch()` or `XMLHttpRequest()` manually, the snippets won't be automatically updated. To update the snippets, you can call the `sendRequest()` method on the `Axette` instance instead of `fetch()` or `XMLHttpRequest()`:

```js
axette.sendRequest("/url", "GET");
```

You can also send Body with the request and define headers. The method signature is like this:

```ts
axette.sendRequest(url, method = "POST", body?, headers?); // Only the URL is required

// Full signature:
Axette.sendRequest(url: string, method: string = `POST`, requestBody?: BodyInit|null, headers: {[key: string]: string} = {'Content-Type': `application/json`})
```

### Remove `?_fid=XXXX` from URLs

Nette by default appends `?_fid=XXXX` to the URLs if you call the `flashMessage()` function. To remove the `?_fid=XXXX` from the URL when using Flash Messages, you need to import the `noFlashUrl()` function:

```js
import { noFlashUrl } from 'axette';

noFlashUrl();
```

## Credits

Huge thanks to [Matouš Trča](https://github.com/blackhexagon) from [@Visualio](https://github.com/visualio) who wrote the core logic for handling the HTTP response from Nette.

## License

This package is [Treeware](https://treeware.earth). If you use it in production, then we ask that you [**buy the world a tree**](https://plant.treeware.earth/matronator/axette) to thank us for our work. By contributing to the Treeware forest you'll be creating employment for local families and restoring wildlife habitats.

---

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
